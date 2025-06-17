import api from './api';
import { Product } from './productService';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface AIRecommendation {
  id: string;
  product: Product;
  reason: string;
  confidence: number;
}

export interface UserInsight {
  id: string;
  title: string;
  description: string;
  type: 'tip' | 'trend' | 'opportunity';
  icon: string;
}

class AIService {
  async sendChatMessage(message: string, conversationId?: string): Promise<ChatMessage> {
    try {
      const response = await api.post('/ai/chat', {
        message,
        conversationId,
      });
      return response.data.message;
    } catch (error) {
      // Mock response for development
      if (__DEV__) {
        return this.getMockChatResponse(message);
      }
      throw error;
    }
  }

  async getRecommendations(userId?: string): Promise<AIRecommendation[]> {
    try {
      const response = await api.get('/ai/recommendations', {
        params: { userId },
      });
      return response.data.recommendations;
    } catch (error) {
      // Mock data for development
      if (__DEV__) {
        return this.getMockRecommendations();
      }
      throw error;
    }
  }

  async getUserInsights(userId?: string): Promise<UserInsight[]> {
    try {
      const response = await api.get('/ai/insights', {
        params: { userId },
      });
      return response.data.insights;
    } catch (error) {
      // Mock data for development
      if (__DEV__) {
        return this.getMockInsights();
      }
      throw error;
    }
  }

  async getSmartPricing(productData: any): Promise<{ suggestedPrice: number; confidence: number }> {
    try {
      const response = await api.post('/ai/smart-pricing', productData);
      return response.data;
    } catch (error) {
      // Mock data for development
      if (__DEV__) {
        return {
          suggestedPrice: Math.floor(Math.random() * 500) + 100,
          confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        };
      }
      throw error;
    }
  }

  private getMockChatResponse(userMessage: string): ChatMessage {
    const responses = [
      "I'd be happy to help you with that! What specific information are you looking for?",
      "Based on your trading history, I recommend checking out electronics and gaming items.",
      "Here are some tips for successful bartering: Be clear about what you want, respond quickly to messages, and meet in safe public places.",
      "I can help you find the best items to trade based on your preferences. What categories interest you most?",
      "For pricing guidance, I suggest checking similar items in your area. Would you like me to search for comparable products?",
    ];

    return {
      id: Date.now().toString(),
      text: responses[Math.floor(Math.random() * responses.length)],
      isUser: false,
      timestamp: new Date().toISOString(),
    };
  }

  private getMockRecommendations(): AIRecommendation[] {
    return [
      {
        id: '1',
        product: {
          _id: 'rec_1',
          title: 'Gaming Headset',
          description: 'High-quality gaming headset with noise cancellation',
          category: 'Gaming',
          condition: 'Good',
          images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=400'],
          location: 'Los Angeles, CA',
          views: 23,
          createdAt: new Date().toISOString(),
          isFavorited: false,
          isFree: false,
          listedBy: {
            _id: '3',
            name: 'Alex Johnson',
            rating: 4.7,
          },
          exchangePreferences: {
            barter: true,
            cash: true,
            cashOption: true,
            price: 150,
          },
        },
        reason: 'Based on your interest in gaming items',
        confidence: 0.85,
      },
      {
        id: '2',
        product: {
          _id: 'rec_2',
          title: 'Vintage Camera',
          description: 'Classic film camera in excellent working condition',
          category: 'Electronics',
          condition: 'Excellent',
          images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400'],
          location: 'Seattle, WA',
          views: 18,
          createdAt: new Date().toISOString(),
          isFavorited: false,
          isFree: false,
          listedBy: {
            _id: '4',
            name: 'Sarah Wilson',
            rating: 4.9,
          },
          exchangePreferences: {
            barter: true,
            cash: false,
            cashOption: false,
            estimatedValue: 300,
          },
        },
        reason: 'Popular in your area',
        confidence: 0.78,
      },
    ];
  }

  private getMockInsights(): UserInsight[] {
    return [
      {
        id: '1',
        title: 'Peak Trading Hours',
        description: 'Most users are active between 6-9 PM. List your items during these hours for better visibility.',
        type: 'tip',
        icon: 'time-outline',
      },
      {
        id: '2',
        title: 'Electronics Trending',
        description: 'Electronics category is 40% more active this week. Great time to list your tech items!',
        type: 'trend',
        icon: 'trending-up-outline',
      },
      {
        id: '3',
        title: 'Quick Response Opportunity',
        description: 'You have 3 pending messages. Quick responses increase successful trades by 60%.',
        type: 'opportunity',
        icon: 'chatbubble-outline',
      },
    ];
  }
}

export const aiService = new AIService(); 