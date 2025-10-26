import { View, StyleSheet } from "react-native";
import { Octicons, Ionicons } from "@expo/vector-icons";
const { gray, black } = { black: "#000000",gray: "#C9C9C9"};
import styled from 'styled-components/native';

import {
    LoginLabel,
    LoginInput,
} from "../../Apps/screens/LoginScreen/loginStyling";
  
const LeftIconLogin = styled.View`
  left: 17px;
  top: 60%;
  position: absolute;
  z-index: 1;
`;

const RightIconLogin = styled.TouchableOpacity`
  right: 17px;
  top: 60%;
  position: absolute;
  z-index: 1;
`; 



export const LoginTextInput = ({label,icon,isPassword,hidePassword,setHidePassword,styles,...props}) => {
    return (
      <View style={styles}>
        <LeftIconLogin>
          <Octicons name={icon} size={20} color={black } />
        </LeftIconLogin>
        <LoginLabel>{label}</LoginLabel>
        <LoginInput {...props} />
        {isPassword && (
          <RightIconLogin onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={20}
              color={gray}
            />
          </RightIconLogin>
        )}
      </View>
    );
};
  
