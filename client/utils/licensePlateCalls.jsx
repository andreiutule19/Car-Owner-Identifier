import { createBaseAxios } from "../components/axios/axiosComplex";
import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { Buffer } from 'buffer';

export const detectLicense = async (formData) => {
  const axiosInstance = await createBaseAxios();
  try {
    const response = await axiosInstance.post('license', formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};





export const debugLicensePlate = async (number) => {
  const axiosInstance = await createBaseAxios({"Content-Type": "application/json"});
  try {
    const response = await axiosInstance.get(`/license/debug/${number}`);

    const imageData = response.data;
    const imagePaths = [];

    for (const [filename, base64Data] of Object.entries(imageData)) {
      const imagePath = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(imagePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      imagePaths.push(imagePath);
    }

    return imagePaths;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};