import { View, Image, Dimensions, Text, ImageBackground, StyleSheet } from 'react-native';
import Constants from "expo-constants";
import backgroundImage from '../../../assets/images/register.jpg';
const StatusBarHeight = Constants.statusBarHeight;
const { width, height } = Dimensions.get('window');
import styled from 'styled-components/native';

export const RegisterColors = {
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
  } = RegisterColors;

export const RegisterBackground = styled.ImageBackground`
  width: ${width}px;
  height: ${height}px;
`;

export const ContainerRegister = styled.View`
  flex: 1;
  padding: 22px;
  padding-top: ${StatusBarHeight}px;
  padding-bottom: 30px;
  flex-grow: 1;
  height: 730px;
`;

export const RegisterInteriorSquare = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  background-color: ${transparent_white};
  padding: 10px;
`;


export const FormRegister = styled.View`
  width: 100%;
  margin-top: 10%;
`;



export const ButtonTextRegister = styled.Text`
  color: ${white};
  font-size: 16px;
  font-weight: bold;
`;

export const RegisterButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${dark_blue};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
`;

export const RegisterLabel = styled.Text`
  color: ${black};
  font-size: 13px;
  text-align: left;
`;


export const RegisterInput = styled.TextInput`
  background-color: ${white};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 15px;
  height: 43px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${black};
`;


export const MessageRegister = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${(props) => (props.type == "SUCCESS" ? green : red)};
`;

export const LogoImage = styled.Image`
  width: 250px;
  height: 100px;
  margin: 3px;
  
`;


export const AdditionalLabelRegister = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${black};
  font-size: 15px;
  padding-top:15px;
`;

export const AdditionalWrapperRegister = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;


export const AdditiveLinkRegister = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const LinkToLogin = styled.Text`
  color: ${black};
  font-size: 17px;
  font-weight: bold;
  padding-top:15px;

  ${(props) => {
    const { resendStatus } = props;
    if (resendStatus === "Failed") {
      return `color: ${red}`;
    } else if (resendStatus === "Sent!") {
      return `color: ${green}`;
    }
  }}
`;

