import api from './api';
import { Product } from './productService';

export interface FavoriteProduct extends Product {
  favoriteId: string;
  addedAt: string;
}

class FavoritesService {
  async getFavorites(): Promise<FavoriteProduct[]> {
    try {
      const response = await api.get('/favorites');
      return response.data.favorites;
    } catch (error) {
      // Mock data for development
      if (__DEV__) {
        return this.getMockFavorites();
      }
      throw error;
    }
  }

  async addToFavorites(productId: string): Promise<void> {
    try {
      await api.post('/favorites/add', { productId });
    } catch (error) {
      if (!__DEV__) {
        throw error;
      }
      // Mock success in development
    }
  }

  async removeFromFavorites(productId: string): Promise<void> {
    try {
      await api.delete(`/favorites/remove/${productId}`);
    } catch (error) {
      if (!__DEV__) {
        throw error;
      }
      // Mock success in development
    }
  }

  async checkIsFavorite(productId: string): Promise<boolean> {
    try {
      const response = await api.get(`/favorites/check/${productId}`);
      return response.data.isFavorite;
    } catch (error) {
      // Mock data for development
      if (__DEV__) {
        return Math.random() > 0.5; // Random favorite status
      }
      throw error;
    }
  }

  private getMockFavorites(): FavoriteProduct[] {
    return [
      {
        _id: '1',
        favoriteId: 'fav_1',
        title: 'iPhone 13 Pro',
        description: 'Excellent condition iPhone 13 Pro with all accessories',
        category: 'Electronics',
        condition: 'Excellent',
        images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400'],
        location: 'New York, NY',
        views: 45,
        createdAt: new Date().toISOString(),
        addedAt: new Date().toISOString(),
        isFavorited: true,
        isFree: false,
        listedBy: {
          _id: '1',
          name: 'John Doe',
          rating: 4.8,
        },
        exchangePreferences: {
          barter: true,
          cash: true,
          cashOption: true,
          estimatedValue: 800,
          minPrice: 700,
          maxPrice: 900,
        },
      },
      {
        _id: '2',
        favoriteId: 'fav_2',
        title: 'MacBook Air M2',
        description: 'Like new MacBook Air with M2 chip, perfect for work',
        category: 'Electronics',
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'],
        location: 'San Francisco, CA',
        views: 32,
        createdAt: new Date().toISOString(),
        addedAt: new Date().toISOString(),
        isFavorited: true,
        isFree: false,
        listedBy: {
          _id: '2',
          name: 'Jane Smith',
          rating: 4.9,
        },
        exchangePreferences: {
          barter: true,
          cash: false,
          cashOption: false,
        },
      },
    ];
  }
}

export const favoritesService = new FavoritesService(); 