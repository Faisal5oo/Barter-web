import { axiosInstanceWeb } from '../lib/axiosInstance';

const getChats = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/chats?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch chats');
  }
};

const getChatMessages = async (chatId, options = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/chats/${chatId}/messages?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};

const sendMessage = async (chatId, messageData) => {
  try {
    const response = await axiosInstanceWeb.post(`/chats/${chatId}/messages`, messageData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

const markMessageAsRead = async (messageId) => {
  try {
    const response = await axiosInstanceWeb.put(`/chats/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark message as read');
  }
};

const getUnreadCount = async () => {
  try {
    const response = await axiosInstanceWeb.get('/chats/messages/unread-count');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get unread count');
  }
};

export {
  getChats,
  getChatMessages,
  sendMessage,
  markMessageAsRead,
  getUnreadCount
}; 