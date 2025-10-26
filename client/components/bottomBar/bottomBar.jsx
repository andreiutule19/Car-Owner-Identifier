import React, { useState, useContext, useEffect } from "react";
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Alert } from "react-native"; 
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CredentialsContext } from "../contextCreds/contextCreds";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode'; 

const BottomBar = () => {
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState(null);
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const { exp } = jwtDecode(token);
        const expirationDate = new Date(exp * 1000);

        console.log(expirationDate);
        if (Date.now() >= exp * 1000) {
          console.log("EXPIREEED");
          setStoredCredentials(null);
        }
      }
    };

    checkTokenExpiration();
  }, []);

  const buttons = [
    {
      title: "Home",
      iconName: "home",
      isActive: false,
      screen: "HomeScreen",
    },
    {
      title: "Found persons",
      iconName: "search",
      isActive: false,
      screen: "DetectScreen",
    },
    {
      title: "Log out",
      iconName: "log-out-outline",
      isActive: false,
      screen: "",
    }
  ];

  const logOut = async () => {
    // Show confirmation dialog
    Alert.alert(
      "Confirm Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: () => {
            handleLogout(); // Call handleLogout if user confirms
          }
        }
      ]
    );
  }

  const handleLogout = async () => {
    setStoredCredentials(null);
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("currentUserCredentials");
    } catch (e) {
      console.error("Error log out:", e);
    }
    // Navigate to login or another screen after logout
    navigation.navigate("LoginScreen"); // Replace with your login screen
  };

  const handleButtonPress = (index, screen, title) => {
    if (title === "Log out") {
      logOut();
    } else {
      setActiveButton(index === activeButton ? null : index);
      navigation.navigate(screen);
      setActiveButton(null);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/hbb.jpeg')} style={styles.container}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            {
              backgroundColor: activeButton === index ? "#4CAF50" : button.backgroundColor,
            },
          ]}
          onPress={() => {
            handleButtonPress(index, button.screen, button.title);
          }}
        >
          <Ionicons name={button.iconName} size={24} color="#fff" />
          <Text style={styles.buttonText}>{button.title}</Text>
        </TouchableOpacity>
      ))}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  buttonText: {
    fontSize: 12,
    marginTop: 4,
    color: "#fff", // Changed to white
  },
});

export default BottomBar;
