import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomHeader = ({title }) => {
  return (
    <ImageBackground source={require('../../assets/images/hbb.jpeg')}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 70 }}>
    </ImageBackground>
  );
};

export default CustomHeader;