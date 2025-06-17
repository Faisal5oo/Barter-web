import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'offer' | 'image';
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  productId: string;
  productTitle?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  loading: boolean;
  error: string | null;
  unreadTotal: number;
}

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
  loading: false,
  error: null,
  unreadTotal: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
      state.unreadTotal = action.payload.reduce((total, chat) => total + chat.unreadCount, 0);
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      const existingChat = state.chats.find(c => c.id === action.payload.id);
      if (!existingChat) {
        state.chats.unshift(action.payload);
        state.unreadTotal += action.payload.unreadCount;
      }
    },
    updateChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        const oldUnread = state.chats[index].unreadCount;
        state.chats[index] = action.payload;
        state.unreadTotal = state.unreadTotal - oldUnread + action.payload.unreadCount;
      }
    },
    setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        chat.messages.push(action.payload.message);
        chat.lastMessage = action.payload.message;
        chat.updatedAt = new Date().toISOString();
        
        // Update unread count if message is from another user
        if (!action.payload.message.read && action.payload.message.senderId !== 'currentUserId') {
          chat.unreadCount += 1;
          state.unreadTotal += 1;
        }
      }
      
      // Update selected chat if it matches
      if (state.selectedChat?.id === action.payload.chatId) {
        state.selectedChat = chat;
      }
    },
    markMessagesAsRead: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        const unreadCount = chat.unreadCount;
        chat.unreadCount = 0;
        state.unreadTotal -= unreadCount;
        
        // Mark all messages as read
        chat.messages.forEach(message => {
          if (!message.read) {
            message.read = true;
          }
        });
      }
      
      // Update selected chat if it matches
      if (state.selectedChat?.id === action.payload) {
        state.selectedChat.unreadCount = 0;
        state.selectedChat.messages.forEach(message => {
          message.read = true;
        });
      }
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
    updateUnreadCount: (state, action: PayloadAction<{ chatId: string; count: number }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        const oldCount = chat.unreadCount;
        chat.unreadCount = action.payload.count;
        state.unreadTotal = state.unreadTotal - oldCount + action.payload.count;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setChats,
  addChat,
  updateChat,
  setSelectedChat,
  addMessage,
  markMessagesAsRead,
  clearSelectedChat,
  updateUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer; 