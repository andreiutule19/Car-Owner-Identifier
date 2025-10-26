import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { useObjectContext } from '../../../components/contextCreds/contextObject';
import { detectLicense } from '../../../utils/licensePlateCalls';
import Spinner from 'react-native-loading-spinner-overlay';
import { HomeButton } from './homeStyling';

export default function HomeScreen({ navigation }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const initialZoomRef = useRef(0);
  const initialPinchScaleRef = useRef(1);
  const photoZoomRef = useRef(1);
  const { objects, addObject } = useObjectContext();
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);

  const onPinchGestureEvent = (event) => {
    const { scale, state } = event.nativeEvent;
    if (state === State.BEGAN) {
      initialZoomRef.current = zoom;
      initialPinchScaleRef.current = scale;
    } else if (state === State.ACTIVE) {
      const pinchDelta = scale - initialPinchScaleRef.current;
      const newZoom = initialZoomRef.current + pinchDelta * 0.5; 
      setZoom(Math.max(0, Math.min(newZoom, 1)));
    }
  };

  const onPinchGestureEventPhoto = (event) => {
    const { scale, state } = event.nativeEvent;
    if (state === State.BEGAN) {
      initialPinchScaleRef.current = scale;
    } else if (state === State.ACTIVE) {
      const pinchDelta = scale - initialPinchScaleRef.current;
      const newScale = photoZoomRef.current + pinchDelta * 0.5; 
      photoZoomRef.current = Math.max(1, Math.min(newScale, 3)); 
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  }

  async function uploadPhoto() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  function handleCancel() {
    setPhoto(null);
    photoZoomRef.current = 1; // Reset zoom scale for the photo
  }

  async function handleDetect() {
    setLoading(true); 
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      let response = await detectLicense(formData);
      if (!response) {
        throw new Error('Detection failed. Please try again.');
      }
      const newObject = {
        county: response.county,
        country: response.country,
        licenseNumber: response.licenseNumber,
        fullName: response.fullName,
        legalStatus: response.legalStatus,
      };
      addObject(newObject);
      navigation.navigate('DetectScreen');
    } catch (error) {
      setErrorMessage(error.message);
      Alert.alert("Error", error.message, [{ text: "OK" }]);
    } finally {
      setLoading(false); 
    }
  }

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      {photo ? (
        <PinchGestureHandler onGestureEvent={onPinchGestureEventPhoto}>
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={[styles.photo, { transform: [{ scale: photoZoomRef.current }] }]} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleDetect}>
                <Text style={styles.text}>Detect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </PinchGestureHandler>
      ) : (
        <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            facing={facing}
            autoFocus="on"
            focusDepth={0}
            zoom={zoom}
          >
            <View style={styles.cameraButtonContainer}>
              <HomeButton style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip</Text>
              </HomeButton>
              <HomeButton style={styles.button} onPress={takePhoto}>
                <Text style={styles.text}>Snap</Text>
              </HomeButton>
              <HomeButton style={styles.button} onPress={uploadPhoto}>
                <Text style={styles.text}>Upload</Text>
              </HomeButton>
            </View>
          </CameraView>
        </PinchGestureHandler>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '80%',
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row', // Set the direction to row to align buttons side by side
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    width: 100,
    height: 50,
    backgroundColor: '#003beb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
