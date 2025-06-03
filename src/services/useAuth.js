import { axiosInstanceWeb } from '../lib/axiosInstance';
const register = async (userData) => {
  try {
    const response = await axiosInstanceWeb.post('/auth/register', userData);
    
    const formattedData = {
      user: {
        id: response.data.user._id || response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        isEmailVerified: true,
      },
      token: response.data.token
    };

    if (formattedData.token && formattedData.user) {
      localStorage.setItem('token', formattedData.token);
      localStorage.setItem('user', JSON.stringify(formattedData.user));
    }

    return formattedData;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};
const login = async (credentials) => {
  try {
    const response = await axiosInstanceWeb.post('/auth/login', credentials);
    
    const formattedData = {
      user: {
        id: response.data.user._id || response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        isEmailVerified: response.data.user.isEmailVerified || true,
      },
      token: response.data.token
    };

    if (formattedData.token && formattedData.user) {
      localStorage.setItem('token', formattedData.token);
      localStorage.setItem('user', JSON.stringify(formattedData.user));
    }

    return formattedData;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
const getCurrentUser = async () => {
  try {
    const response = await axiosInstanceWeb.get('/auth/me');
    
    const formattedData = {
      user: {
        id: response.data._id || response.data.id,
        name: response.data.name,
        email: response.data.email,
        isEmailVerified: response.data.isEmailVerified || true,
      }
    };

    if (formattedData.user) {
      localStorage.setItem('user', JSON.stringify(formattedData.user));
    }

    return formattedData;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error(error.response?.data?.message || 'Failed to get current user');
  }
};
const getUserFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { user, token };
    }
    return null;
  } catch (error) {
    return null;
  }
};
const forgotPassword = async (email) => {
  try {
    const response = await axiosInstanceWeb.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send reset email');
  }
};
const logout = async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { message: 'Logged out successfully' };
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error('Logout failed');
  }
};
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export {
  register,
  login,
  getCurrentUser,
  getUserFromStorage,
  forgotPassword,
  logout,
  isAuthenticated
}; 