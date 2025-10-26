import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text,StyleSheet } from "react-native";
import { RegisterTextInput } from '../../../components/inputText/inputTextRegister';
import React, { useState, useContext } from "react";
import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../../components/contextCreds/contextCreds";
import TouchWrapKeyboard  from "../../../components/keyboardWrapper/keyboardWrapper";
import {
  RegisterBackground,
  ContainerRegister ,
  RegisterInteriorSquare,
  FormRegister,
  ButtonTextRegister,
  RegisterButton,
  RegisterColors,
  MessageRegister,
  LogoImage,
  AdditionalLabelRegister,
  AdditionalWrapperRegister,
  AdditiveLinkRegister,
  LinkToLogin,
} from "./registerStyling";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { handleRegister } from "../../../utils/userCalls";
import logoImg from "../../../assets/images/logo.png";
const { grey,blue } = RegisterColors;
import backgroundImage from '../../../assets/images/register.jpg';

export default function RegisterScreen({ navigation }) {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  
  
  const handleMessage = (message, type = "FAILED") => {
      setMessage(message);
      setMessageType(type);
  };
  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem("currentUserCredentials", JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
        handleMessage("Persisted login failed!");
      });
  };

    
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom:10,
    paddingLeft: 8,
    paddingRight: 8,
  },
});
  
  return (
    <RegisterBackground source={backgroundImage}>
    <TouchWrapKeyboard >
      <ContainerRegister >
        <StatusBar style="purple" />
        <RegisterInteriorSquare>
          <LogoImage source={ logoImg } />
          <Formik
            initialValues={{
              fullName: "",
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (
                values.username == "" ||
                values.password == "" ||
                values.fullName == "" ||
                values.email == "" ||
                values.confirmPassword == ""
              ) {
                handleMessage("Please fill all the fields");
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage("Password and confirm password do not match!");
                setSubmitting(false);
              } else {
                handleRegister(values, setSubmitting,handleMessage,persistLogin);
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
              <FormRegister>
                <RegisterTextInput
                  label="Full Name"
                  icon="person"
                  placeholder="James Smith"
                  placeholderTextColor={grey}
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  value={values.fullName}
                  styles ={styles.container}  
                />

                <RegisterTextInput
                  label="Username"
                  icon="person"
                  placeholder="james.smith12"
                  placeholderTextColor={grey}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                    value={values.username}
                    styles ={styles.container} 
                />

                <RegisterTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="example123@domain.com"
                  placeholderTextColor={grey}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                    keyboardType="email-address"
                    styles ={styles.container} 
                />

                <RegisterTextInput
                  label="Password"
                  icon="lock"
                  placeholder=" P@ssw0rd1"
                  placeholderTextColor={grey}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    styles ={styles.container} 
                />

                <RegisterTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder=" P@ssw0rd1"
                  placeholderTextColor={grey}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    styles ={styles.container} 
                />

                <MessageRegister type={messageType}>{message}</MessageRegister>
                {!isSubmitting && (
                  <RegisterButton onPress={handleSubmit}>
                    <ButtonTextRegister>Register</ButtonTextRegister>
                  </RegisterButton>
                )}

                {isSubmitting && (
                  <RegisterButton disabled={true}>
                    <ActivityIndicator size="large" color={blue} />
                  </RegisterButton>
                )}
           
                <AdditionalWrapperRegister>
                  <AdditionalLabelRegister> Already have an account? </AdditionalLabelRegister>
                  <AdditiveLinkRegister onPress={() => navigation.navigate("LoginScreen")}>
                    <LinkToLogin>Login</LinkToLogin>
                  </AdditiveLinkRegister>
                </AdditionalWrapperRegister>
              </FormRegister>
            )}
          </Formik>
          </RegisterInteriorSquare>
      </ContainerRegister >
      </TouchWrapKeyboard >
      </RegisterBackground>
  );
};