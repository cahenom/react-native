import axios from 'axios';

const {
  default: AsyncStorage,
} = require('@react-native-async-storage/async-storage');
const {API_URL} = require('./const');

export const api = axios.create({
  baseURL: API_URL,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use(async config => {
  const jsonValue = await AsyncStorage.getItem('users');
  config.headers.Authorization = 'Bearer ' + JSON.parse(jsonValue)?.token;
  return config;
});
