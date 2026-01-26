import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './const';
import { Alert } from 'react-native';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token'); // ← ambil token langsung
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Response interceptor to handle all API errors globally
api.interceptors.response.use(
  (response) => {
    // If the response is successful, return it as is
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      console.log('Server Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.log('Network Error: No response received', error.request);
      Alert.alert('Error', 'kesalahan gagal terhubung ke server');
    } else {
      // Something else happened while setting up the request
      console.log('Request Setup Error:', error.message);
      Alert.alert('Error', 'kesalahan gagal terhubung ke server');
    }

    // Return the error to the calling function so it can be handled locally if needed
    return Promise.reject(error);
  }
);
