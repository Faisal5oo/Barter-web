import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper functions for secure storage
const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('token', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Add request interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // You might want to navigate to login screen here
      // This would depend on your navigation setup
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, getToken, setToken, removeToken }; 