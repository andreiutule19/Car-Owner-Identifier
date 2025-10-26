import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useObjectContext } from '../../../components/contextCreds/contextObject';
import backgroundImage from '../../../assets/images/hbb.jpeg';
import romanianFlag from '../../../assets/images/rf.png';

const DetectScreen = () => {
  const { objects, deleteObject } = useObjectContext();
  const navigation = useNavigation();

  const handleDelete = (index) => {
    deleteObject(index);
  };

  const handleDebug = (index) => {
    navigation.navigate('DebugScreen', { number: index });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <FlatList
          data={objects}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.messageContainer, styles.listItem]}>
              <View style={styles.rowContainer}>
                <Text style={styles.highlightedText}>{`Full Name: ${item.fullName}`}</Text>
                <Image source={romanianFlag} style={styles.flagIcon} />
              </View>
              <Text style={styles.highlightedText}>{`Legal Status: ${item.legalStatus}`}</Text>
              <Text style={styles.normalText}>{`County: ${item.county}`}</Text>
              <Text style={styles.normalText}>{`Country: ${item.country}`}</Text>
              <Text style={styles.normalText}>{`License Number: ${item.licenseNumber}`}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDebug(index)} style={styles.debugButton}>
                  <Text style={styles.debugButtonText}>Debug</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  messageContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    elevation: 3,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 10,
  },
  normalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffcccc',
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  debugButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#003beb',
    borderRadius: 5,
    marginLeft: 5,
  },
  debugButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flagIcon: {
    width: 35,
    height: 25,
    resizeMode: 'contain',
  },
});

export default DetectScreen;
