import { createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CredentialsContext = createContext({
  storedCredentials: {},
  setStoredCredentials: () => {},
});

export const checkLoginCredentials = (setStoredCredentials) => {
    AsyncStorage.getItem("currentUserCredentials")
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };