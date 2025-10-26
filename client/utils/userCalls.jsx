import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAxios } from "../components/axios/axiosComplex";



const keepToken = async (token) => {
  try {
    console.log("My token");
    console.log(token);
      await AsyncStorage.setItem("token", JSON.stringify(token));
    } catch (e) {
      console.error("Error saving token to storage:", e);
    }
  };

export const doLogin = async (credentials, setSubmitting,showMessage,executeLogin) => {
  showMessage(null);
  console.log(credentials)
    try {
      const response = await authAxios.post("/login", {
        username: credentials.username,
        password: credentials.password,
      });
      const token = response.data.token;
      let userLogin = {
         userId:response.data.userId,
         fullName:response.data.fullName,
         email:response.data.email,
         username:response.data.username,
         role:response.data.role
      }
     
      await keepToken(token);
      executeLogin(userLogin, response.message, response.status);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showMessage("Invalid username or password.", "FAILED");
      } else {
        showMessage(
          "It looks like you are offline!",
          "FAILED"
        );
      }
    }
    setSubmitting(false);
};

export const handleRegister = async (credentials, setSubmitting, handleMessage, executeRegister) => {
  handleMessage(null);
  try {
    const response = await authAxios.post("/register", {
      username: credentials.username,
      fullName: credentials.fullName,
      email: credentials.email,
      password: credentials.password,
      confirmedPassword: credentials.confirmPassword,
    });
    const token = response.data.token;
    let userRegistered = {
      userId:response.data.userId,
      fullName:response.data.fullName,
      email:response.data.email,
      username:response.data.username,
      role:response.data.role
   }
    await keepToken(token);

    executeRegister(userRegistered, response.message, response.status);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleMessage("Invalid or already used info!", "FAILED");
    } else {
      console.log(error);
      handleMessage(
        "An error occurred. Check your network and try again!",
        "FAILED"
      );
    }
  }
  setSubmitting(false);

};
