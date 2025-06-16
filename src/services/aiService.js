// AI Service - Handle AI-related API calls
import { axiosInstanceWeb } from '../lib/axiosInstance';

// Get AI recommendations for user
export const getAIRecommendations = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/ai/recommendations?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get AI recommendations');
  }
};

// AI Chat
export const sendAIChatMessage = async (message, userId = null) => {
  try {
    const payload = {
      message,
      ...(userId && { userId })
    };

    const response = await axiosInstanceWeb.post('/ai/chat', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send chat message');
  }
};

// Get User Insights
export const getUserInsights = async (userId = null) => {
  try {
    const params = new URLSearchParams();
    if (userId) {
      params.append('userId', userId);
    }

    const response = await axiosInstanceWeb.get(`/ai/insights?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user insights');
  }
};

// Get Daily Recommendations
export const getDailyRecommendations = async (userId = null) => {
  try {
    const params = new URLSearchParams();
    if (userId) {
      params.append('userId', userId);
    }

    const response = await axiosInstanceWeb.get(`/ai/daily-recommendations?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get daily recommendations');
  }
};

// Track User Interaction
export const trackUserInteraction = async (interactionData) => {
  try {
    const response = await axiosInstanceWeb.post('/ai/track/click', interactionData);
    return response.data;
  } catch (error) {
    // Don't throw error for tracking - it's not critical
    console.warn('Failed to track user interaction:', error);
    return null;
  }
};

// Check AI service status
export const checkAIStatus = async () => {
  try {
    const response = await axiosInstanceWeb.get('/ai/status');
    return response.data;
  } catch (error) {
    return { available: false, message: 'AI service unavailable' };
  }
}; 