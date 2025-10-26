import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { debugLicensePlate } from '../../../utils/licensePlateCalls';
import ViewPager from '@react-native-community/viewpager'; // Importing ViewPager from react-native-pager-view

const DebugScreen = ({ route }) => {
  const { number } = route.params;
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [text] = useState([
    "License plate marked after detection",
    "License plate cut and binarized",
    "Contours discovered",
    "The contours left after the post-processing",
    "Characters cut out for classification"
  ]);

  useEffect(() => {
    const loadImages = async () => {
      const imagePaths = await debugLicensePlate(number);
      setImages(imagePaths);
    };

    loadImages();
  }, [number]);

  const onPageSelected = (event) => {
    setCurrentPage(event.nativeEvent.position);
  };

  if (images.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No images found</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../../assets/images/hbb.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ViewPager
          style={styles.viewPager}
          initialPage={0}
          onPageSelected={onPageSelected}
        >
          {images.slice(7).map((image, index) => (
            <View key={index} style={styles.singleImageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.largeImage}
                resizeMode="contain"
              />
              <Text style={styles.descriptionText}>{text[index]}</Text>
            </View>
          ))}
          <View key="lastPage" style={styles.lastPageContainer}>
            <View style={styles.gridContainer}>
              {images.slice(0, 7).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.smallImage}
                  resizeMode="contain"
                />
              ))}
            </View>
            <Text style={styles.lastPageText}>{text[4]}</Text>
          </View>
        </ViewPager>
        <Text style={styles.pageText}>{currentPage + 1} / 5</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for readability
  },
  viewPager: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  lastPageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom:65
  },
  smallImage: {
    width: Dimensions.get('window').width / 4 - 10,
    height: Dimensions.get('window').width / 4 - 10,
    margin: 5,
    borderRadius: 5,
  },
  singleImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeImage: {
    width: '100%',
    height: '100%',
  },
  pageText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    fontSize: 16,
    color: '#333',
  },
  descriptionText: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    fontSize: 16,
    color: '#000',
    paddingBottom: 55,
    fontWeight: 'bold',
  },
  lastPageText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DebugScreen;
