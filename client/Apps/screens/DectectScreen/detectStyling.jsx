import { View, Image, Dimensions, Text, ImageBackground, StyleSheet } from 'react-native';
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;
const { width, height } = Dimensions.get('window');
import styled from 'styled-components/native';

export const DetectColors = {
    white: "#FFFFFF",
    black: "#000000",
    gray: "#C9C9C9",
    green: "#B4E197",
    red: "#FF6961",
    transparent_white: "#FFFFFF80",
    dark_blue:"#00008B"
};

export const DetectBackground = styled.ImageBackground`
  width: ${width}px;
  height: ${height}px;
`;