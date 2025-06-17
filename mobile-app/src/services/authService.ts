import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isEmailVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Helper function to store user data securely
const setUserData = async (user: AuthUser): Promise<void> => {
  try {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

// Helper function to get user data from secure storage
const getUserData = async (): Promise<AuthUser | null> => {
  try {
    const userData = await SecureStore.getItemAsync('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Helper function to remove user data
const removeUserData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('user');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      await SecureStore.setItemAsync('auth_token', token);
      return { user, token };
    } catch (error: any) {
      if (__DEV__) {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: credentials.email,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          rating: 4.8,
        };
        const mockToken = 'mock_token_' + Date.now();
        
        await SecureStore.setItemAsync('auth_token', mockToken);
        return { user: mockUser, token: mockToken };
      }
      
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;
      
      await SecureStore.setItemAsync('auth_token', token);
      return { user, token };
    } catch (error: any) {
      if (__DEV__) {
        const mockUser: User = {
          id: '2',
          name: data.name,
          email: data.email,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          rating: 5.0,
        };
        const mockToken = 'mock_token_' + Date.now();
        
        await SecureStore.setItemAsync('auth_token', mockToken);
        return { user: mockUser, token: mockToken };
      }
      
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await SecureStore.deleteItemAsync('auth_token');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return null;

      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      if (__DEV__) {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          return {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            rating: 4.8,
          };
        }
      }
      
      await SecureStore.deleteItemAsync('auth_token');
      return null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  }
}

export const authService = new AuthService(); 