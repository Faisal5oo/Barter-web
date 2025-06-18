import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAIRecommendations, 
  sendAIChatMessage, 
  getUserInsights, 
  checkAIStatus,
  getDailyRecommendations,
  trackUserInteraction
} from '../services/aiService';

// AI Query Keys
export const AI_QUERY_KEYS = {
  recommendations: (options) => ['ai', 'recommendations', options],
  insights: (userId) => ['ai', 'insights', userId],
  status: ['ai', 'status'],
  dailyRecommendations: (userId) => ['ai', 'daily', userId],
};

// Get AI Recommendations
export const useAIRecommendations = (options = {}) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.recommendations(options),
    queryFn: () => getAIRecommendations(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!options.userId || true, // Enable by default or when userId is provided
  });
};

// Send AI Chat Message
export const useAIChatMessage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ message, userId }) => sendAIChatMessage(message, userId),
    onError: (error) => {
      toast({
        title: 'Chat Error',
        description: error.message || 'Failed to send message to AI assistant',
        variant: 'destructive',
      });
    },
  });
};

// Get User Insights
export const useUserInsights = (userId = null) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.insights(userId),
    queryFn: () => getUserInsights(userId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    enabled: true,
  });
};

// Check AI Status
export const useAIStatus = () => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.status,
    queryFn: checkAIStatus,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Custom hook for managing chat conversation
export const useChatConversation = () => {
  const [messages, setMessages] = React.useState([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const chatMutation = useAIChatMessage();

  const predefinedAnswers = {
    "how do i list an item": "To list an item on CirculaX: 1) Click 'List Item' or go to Add Product page 2) Upload clear photos 3) Add detailed description 4) Set category & location 5) Choose exchange preferences (barter/cash/both). Food items expire in 24 hours!",
    "how does bartering work": "Bartering is simple: 1) Browse items you want 2) Click 'Make Offer' 3) Select your items to trade 4) Add cash if needed 5) Wait for response 6) Meet safely in public 7) Exchange items & rate each other!",
    "is it safe to trade here": "Yes! CirculaX prioritizes safety with: ✅ User ratings & reviews ✅ Identity verification ✅ Safe meetup suggestions ✅ In-app messaging ✅ Report/block features. Always meet in public places!",
    "how to find nearby items": "Finding nearby items: 1) Visit 'Nearby' page 2) Enable location access 3) Adjust distance filter (5-50 miles) 4) Use category filters 5) Sort by distance. Check food items first as they expire quickly!",
    "what's the best way to negotiate": "Negotiation tips: 1) Be fair & respectful 2) Research item values 3) Consider both items' condition 4) Be flexible with cash add-ons 5) Communicate clearly 6) Start with reasonable offers",
    "how do ratings work": "After each trade, both users rate each other (1-5 stars). Good ratings build trust and help you get better trade offers. Be honest and fair in your ratings!"
  };

  const getQuickAnswer = (message) => {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Check for exact matches
    if (predefinedAnswers[normalizedMessage]) {
      return predefinedAnswers[normalizedMessage];
    }
    
    // Check for keyword matches
    for (const [key, answer] of Object.entries(predefinedAnswers)) {
      if (normalizedMessage.includes(key.replace(/[^a-zA-Z0-9 ]/g, '')) || 
          key.replace(/[^a-zA-Z0-9 ]/g, '').includes(normalizedMessage)) {
        return answer;
      }
    }
    
    return null;
  };

  const sendMessage = async (message, userId = null) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Check for predefined answers first
    const quickAnswer = getQuickAnswer(message);
    
    if (quickAnswer) {
      // Use predefined answer with slight delay for natural feel
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: quickAnswer,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 800 + Math.random() * 400); // 0.8-1.2s delay
    } else {
      // Use AI API for other questions
      try {
        const response = await chatMutation.mutateAsync({ message, userId });
        
        // Add AI response
        const aiMessage = {
          id: Date.now() + 1,
          text: response.response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        // Add error message
        const errorMessage = {
          id: Date.now() + 1,
          text: "I'm sorry, I couldn't process your message right now. Here are some common questions I can help with: How do I list an item? How does bartering work? Is it safe to trade here?",
          sender: 'ai',
          timestamp: new Date(),
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearConversation,
    isLoading: chatMutation.isPending,
  };
};

// Get Daily Recommendations
export const useDailyRecommendations = (userId = null) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.dailyRecommendations(userId),
    queryFn: () => getDailyRecommendations(userId),
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: !!userId,
  });
};

// Track User Interaction
export const useTrackInteraction = () => {
  return useMutation({
    mutationFn: trackUserInteraction,
    // Don't show errors for tracking - it's not critical
    onError: () => {},
  });
}; 