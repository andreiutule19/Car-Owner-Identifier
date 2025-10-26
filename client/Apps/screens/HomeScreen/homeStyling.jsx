import { View, Image, Dimensions, Text, ImageBackground, StyleSheet } from 'react-native';
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;
const { width, height } = Dimensions.get('window');
import styled from 'styled-components/native';

export const HomeColors = {
    white: "#FFFFFF",
    black: "#000000",
    gray: "#C9C9C9",
    green: "#B4E197",
    red: "#FF6961",
    transparent_white: "#FFFFFF80",
    dark_blue:"#00008B"
};
  

const {
    white,
    gray,
    green,
    red,
    black,
    transparent_white,
    dark_blue
} = HomeColors;
  

export const HomeButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${dark_blue};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
`;