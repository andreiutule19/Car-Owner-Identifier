import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,ActivityIndicator} from 'react-native';
import LoginScreen from './Apps/screens/LoginScreen/LoginScreen';
import RootStack from './Apps/screens/Routes';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from './components/contextCreds/contextCreds';
import React, { useState, useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { ObjectProvider } from './components/contextCreds/contextObject';
export default function App() {
  const [prepared, setPrepared] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  useEffect(() => {
    const loadAsyncData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await checkLoginCredentials();
        setPrepared(true);
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    loadAsyncData();
  }, []);

  const checkLoginCredentials = async () => {
    try {
      const result = await AsyncStorage.getItem("currentUserCredentials");
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ObjectProvider>
      <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
         {prepared ? <RootStack /> : null}
      </CredentialsContext.Provider>
   </ObjectProvider>
  );
}

