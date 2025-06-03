import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'offer';
}

export interface Chat {
  id: string;
  participants: string[];
  productId: string;
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
}

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload);
    },
    setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        chat.lastMessage = action.payload.message;
        chat.updatedAt = new Date().toISOString();
      }
    },
    updateUnreadCount: (state, action: PayloadAction<{ chatId: string; count: number }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        chat.unreadCount = action.payload.count;
      }
    },
  },
});

export const { setChats, addChat, setSelectedChat, addMessage, updateUnreadCount } = chatSlice.actions;
export default chatSlice.reducer; 