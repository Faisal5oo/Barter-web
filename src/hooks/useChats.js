import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  getChats,
  getChatMessages,
  sendMessage,
  markMessageAsRead,
  getUnreadCount
} from '../services/useChat';

export const CHAT_QUERY_KEYS = {
  all: ['chats'],
  list: (filters) => [...CHAT_QUERY_KEYS.all, 'list', filters],
  messages: (chatId) => [...CHAT_QUERY_KEYS.all, 'messages', chatId],
  messagesList: (chatId, filters) => [...CHAT_QUERY_KEYS.messages(chatId), filters],
  unreadCount: () => [...CHAT_QUERY_KEYS.all, 'unreadCount'],
};

export const useChats = (options = {}) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.list(options),
    queryFn: () => getChats(options),
    staleTime: 30 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
};

export const useChatMessages = (chatId, options = {}) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.messagesList(chatId, options),
    queryFn: () => getChatMessages(chatId, options),
    enabled: !!chatId,
    staleTime: 10 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.unreadCount(),
    queryFn: getUnreadCount,
    staleTime: 30 * 1000,
    cacheTime: 5 * 60 * 1000,
    enabled: false,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ chatId, messageData }) => sendMessage(chatId, messageData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(variables.chatId) });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.unreadCount() });
    },
    onError: (error) => {
      const message = error.message || 'Failed to send message';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId) => markMessageAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.unreadCount() });
    },
  });
}; 