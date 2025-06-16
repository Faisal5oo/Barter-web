const API_BASE_URL = 'http://localhost:5000/api';

export class FavoritesService {
  static async addToFavorites(productId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  static async removeFromFavorites(productId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  static async getUserFavorites(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      
      const data = await response.json();
      return data.favorites || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Return mock data for development
      return [
        {
          _id: '1',
          title: 'iPhone 13 Pro',
          image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
          category: 'Electronics',
          condition: 'Excellent',
          description: 'Barely used iPhone 13 Pro in excellent condition',
          owner: { name: 'John Doe', rating: 4.8 },
          createdAt: new Date().toISOString(),
          allowsBarter: true,
          allowsCash: true
        },
        {
          _id: '2',
          title: 'MacBook Air M2',
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
          category: 'Electronics',
          condition: 'Good',
          description: 'MacBook Air with M2 chip, perfect for work and study',
          owner: { name: 'Jane Smith', rating: 4.9 },
          createdAt: new Date().toISOString(),
          allowsBarter: true,
          allowsCash: false
        }
      ];
    }
  }

  static async checkIfFavorite(productId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/check?productId=${productId}&userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to check favorite status');
      }
      
      const data = await response.json();
      return data.isFavorite || false;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
} 