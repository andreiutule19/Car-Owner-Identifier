import { View, StyleSheet } from "react-native";
import { Octicons, Ionicons } from "@expo/vector-icons";
const { gray, black } = { black: "#000000",gray: "#C9C9C9"};
import styled from 'styled-components/native';
import {
    RegisterLabel,
    RegisterInput,
} from "../../Apps/screens/RegisterScreen/registerStyling";
  

export const LeftIconRegister = styled.View`
  left: 17px;
  top: 57%;
  position: absolute;
  z-index: 1;
`;

export const RightIconRegister = styled.TouchableOpacity`
  right: 17px;
  top: 57%;
  position: absolute;
  z-index: 1;
`;


export const RegisterTextInput = ({label,icon,isPassword,hidePassword,setHidePassword,styles,...props}) => {
    return (
      <View style={styles}>
        <LeftIconRegister>
          <Octicons name={icon} size={20} color={black } />
        </LeftIconRegister>
        <RegisterLabel>{label}</RegisterLabel>
        <RegisterInput {...props} />
        {isPassword && (
          <RightIconRegister onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={20}
              color={gray}
            />
          </RightIconRegister>
        )}
      </View>
    );
};
  
const styles = StyleSheet.create({
  container: {
    paddingTop: 13,
    paddingBottom:13,
    paddingLeft: 8,
    paddingRight: 8,
  },
});