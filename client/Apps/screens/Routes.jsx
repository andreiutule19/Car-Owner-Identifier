import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./LoginScreen/LoginScreen";
import HomeScreen from "./HomeScreen/HomeScreen";
import RegisterScreen from "./RegisterScreen/RegisterScreen";
import CustomHeader from "../../components/customHeader/customHeader";
import { CredentialsContext } from "../../components/contextCreds/contextCreds";
import BottomBar from "../../components/bottomBar/bottomBar";
import DetectScreen from "./DectectScreen/DetectScreen";
import DebugScreen from "./DebugScreen/DebugScreen";
import { ObjectProvider } from "../../components/contextCreds/contextObject";

const Stack = createStackNavigator();

const RootStack = () => {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  useEffect(() => {
    console.log("Salutix", storedCredentials);
  }, []);

  return (
    <NavigationContainer>
      {storedCredentials !== null ? (
       <Stack.Navigator
       initialRouteName="HomeScreen"
       screenOptions={{
        header: () => (
          <CustomHeader/>
        ),
        headerShown: true,
      }}
     >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DetectScreen" component={DetectScreen} />
        <Stack.Screen name="DebugScreen" component={DebugScreen} />
      </Stack.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerTransparent: true,
            headerTitle: "",
            headerLeftContainerStyle: {
              paddingLeft: 20,
            },
            headerShown: false,
          }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </Stack.Navigator>
      )}

      {storedCredentials !== null ? <BottomBar /> : null}
    </NavigationContainer>
  );
};

export default RootStack;
