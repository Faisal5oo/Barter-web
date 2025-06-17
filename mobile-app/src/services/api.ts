import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Use your web app's API base URL or a mock server
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Development
  : 'https://your-production-api.com/api'; // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('auth_token');
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

export default api; 