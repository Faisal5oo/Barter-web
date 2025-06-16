const express = require('express');
const router = express.Router();

// Mock favorites storage (in production, this would be a database)
let favorites = [];

// Add to favorites
router.post('/add', (req, res) => {
  try {
    const { productId, userId } = req.body;
    
    if (!productId || !userId) {
      return res.status(400).json({ error: 'Product ID and User ID are required' });
    }

    // Check if already favorited
    const existingFavorite = favorites.find(
      fav => fav.productId === productId && fav.userId === userId
    );

    if (existingFavorite) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    // Add to favorites
    favorites.push({
      id: Date.now().toString(),
      productId,
      userId,
      createdAt: new Date().toISOString()
    });

    console.log(`✅ Added product ${productId} to favorites for user ${userId}`);
    res.json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove from favorites
router.post('/remove', (req, res) => {
  try {
    const { productId, userId } = req.body;
    
    if (!productId || !userId) {
      return res.status(400).json({ error: 'Product ID and User ID are required' });
    }

    // Remove from favorites
    const initialLength = favorites.length;
    favorites = favorites.filter(
      fav => !(fav.productId === productId && fav.userId === userId)
    );

    if (favorites.length === initialLength) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    console.log(`✅ Removed product ${productId} from favorites for user ${userId}`);
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user favorites
router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get user's favorites
    const userFavorites = favorites.filter(fav => fav.userId === userId);
    
    // Mock product data for favorites
    const favoriteProducts = userFavorites.map(fav => ({
      _id: fav.productId,
      title: `Favorite Product ${fav.productId}`,
      image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
      category: 'Electronics',
      condition: 'Excellent',
      description: 'This is a favorite product',
      owner: { name: 'John Doe', rating: 4.8 },
      createdAt: fav.createdAt,
      allowsBarter: true,
      allowsCash: true
    }));

    console.log(`✅ Retrieved ${favoriteProducts.length} favorites for user ${userId}`);
    res.json({ favorites: favoriteProducts });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if product is favorite
router.get('/check', (req, res) => {
  try {
    const { productId, userId } = req.query;
    
    if (!productId || !userId) {
      return res.status(400).json({ error: 'Product ID and User ID are required' });
    }

    const isFavorite = favorites.some(
      fav => fav.productId === productId && fav.userId === userId
    );

    res.json({ isFavorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 