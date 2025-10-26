import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect } from "react";

export const createBaseAxios = async (baseHeaders = { "Content-Type": "multipart/form-data" }) => {
  const token = await AsyncStorage.getItem("token");
  const defaultHeaders = { ...baseHeaders };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${JSON.parse(token)}`;
  }

  const headers = {
    ...defaultHeaders,
  };

  const baseAxios = axios.create({
    baseURL: "http://172.20.10.4:8080/",
    headers,
  });

  baseAxios.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  baseAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("currentUserCredentials");
      }
      return Promise.reject(error);
    }
  );

  return baseAxios;
};

export const authAxios = axios.create({
    baseURL: "http://172.20.10.4:8080/auth",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      "Content-Type": "application/json",
    },
  });

