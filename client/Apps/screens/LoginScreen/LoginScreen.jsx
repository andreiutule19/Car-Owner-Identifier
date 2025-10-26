import { View,Image, Dimensions,Text,ImageBackground, StyleSheet ,ActivityIndicator} from 'react-native';
import TouchWrapKeyboard  from '../../../components/keyboardWrapper/keyboardWrapper';
import { StatusBar } from "expo-status-bar";
import backgroundImage from '../../../assets/images/login.jpg';
import { Formik } from "formik";
const { width, height } = Dimensions.get('window');
const { purple, light_yellow, grey } = LoginColors;
import { LoginTextInput } from '../../../components/inputText/inputTextLogin';
import {
  LoginInteriorSquare,
  FormLogin,
  ButtonTextLogin,
  LoginButton,
  LoginColors,
  MessageLogin,
  AdditionalLabelLogin,
  AdditionalWrapperLogin,
  AdditiveLinkLogin,
  LinkToRegister,
  LogoImage,
  LoginBackgroung,
  LoginWrapper,
} from './loginStyling';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from '../../../components/contextCreds/contextCreds';
import { doLogin } from '../../../utils/userCalls';
import  { useState, useContext } from "react";
import logoImg from "../../../assets/images/logo.png";

export default function LoginScreen({ navigation }) {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  const styles = StyleSheet.create({
    container: {
      paddingTop: 13,
      paddingBottom:13,
      paddingLeft: 8,
      paddingRight: 8,
    },
  });
    
  const showMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  }; 

  const executeLogin = (credentials, message, status) => {
    console.log("aici")
    console.log(message)
    AsyncStorage.setItem("currentUserCredentials", JSON.stringify(credentials))
      .then(() => {
        showMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
        showMessage("Persisted login failed!");
      });
  };

  
  return (
    <LoginBackgroung source={backgroundImage}>
      <TouchWrapKeyboard >
      < LoginWrapper>
        <StatusBar/>
        <LoginInteriorSquare>
            <LogoImage source={ logoImg } />
        <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.username == "" || values.password == "") {
                showMessage("Please fill all the fields");
                setSubmitting(false);
              } else {
                doLogin(values, setSubmitting,showMessage,executeLogin);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
            }) => (
              <FormLogin>
                <LoginTextInput
                  label="Username"
                  icon="person"
                  placeholder="johndoe1234"
                  placeholderTextColor={grey}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                    value={values.username}
                    styles ={styles.container} 
                />

                <LoginTextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={purple}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    styles ={styles.container} 
                />

                <MessageLogin type={messageType}>{message}</MessageLogin>
                {!isSubmitting && (
                  <LoginButton onPress={handleSubmit}>
                    <ButtonTextLogin>Login</ButtonTextLogin>
                  </LoginButton>
                )}

                {isSubmitting && (
                  <LoginButton disabled={true}>
                    <ActivityIndicator size="large" />
                  </LoginButton>
                )}

                <AdditionalWrapperLogin>
                  <AdditionalLabelLogin> Don't have an account already? </AdditionalLabelLogin>
                  <AdditiveLinkLogin onPress={() => navigation.navigate("RegisterScreen")}>
                    <LinkToRegister>Sign up</LinkToRegister>
                  </AdditiveLinkLogin>
                </AdditionalWrapperLogin>
              </FormLogin>
            )}
          </Formik>
        </LoginInteriorSquare>
      </ LoginWrapper>
      </TouchWrapKeyboard >
    </LoginBackgroung>
  )
} 