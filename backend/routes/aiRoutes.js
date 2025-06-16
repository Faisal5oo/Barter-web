const express = require('express');
const router = express.Router();

// Mock data for demonstration
const sampleProducts = [
  {
    _id: '1',
    title: 'iPhone 12 Pro',
    description: 'Excellent condition, barely used',
    category: 'Electronics',
    condition: 'Like New',
    images: ['https://via.placeholder.com/300x200'],
    location: 'New York, NY',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    views: 25,
    exchangePreferences: { barter: true, cash: true, estimatedValue: 800 },
    listedBy: { _id: 'user1', name: 'John Doe', rating: 4.8 }
  },
  {
    _id: '2',
    title: 'Nintendo Switch',
    description: 'Works perfectly, includes original box',
    category: 'Gaming',
    condition: 'Good',
    images: ['https://via.placeholder.com/300x200'],
    location: 'Los Angeles, CA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    views: 18,
    exchangePreferences: { barter: true, cash: false },
    listedBy: { _id: 'user2', name: 'Jane Smith', rating: 4.9 }
  },
  {
    _id: '3',
    title: 'Vintage Guitar',
    description: 'Beautiful acoustic guitar from the 80s',
    category: 'Music',
    condition: 'Good',
    images: ['https://via.placeholder.com/300x200'],
    location: 'Austin, TX',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    views: 42,
    exchangePreferences: { barter: true, cash: true, estimatedValue: 350 },
    listedBy: { _id: 'user3', name: 'Mike Johnson', rating: 4.7 }
  }
];

// GET /api/ai/recommendations - Get AI recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;
    
    console.log('📦 RECOMMENDATION NOTIFICATION: AI generating personalized recommendations', {
      userId,
      limit,
      timestamp: new Date().toISOString()
    });

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const recommendations = sampleProducts.map(product => ({
      ...product,
      aiInsights: {
        matchPercentage: Math.floor(Math.random() * 30) + 70, // 70-100%
        reason: 'Based on your browsing history and preferences',
        confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
      }
    }));

    res.json({
      success: true,
      recommendations: recommendations.slice(0, parseInt(limit)),
      totalCount: recommendations.length,
      aiMeta: {
        processingTime: '1.2s',
        confidence: 0.87,
        matchQuality: 'high'
      }
    });

  } catch (error) {
    console.error('AI Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

// GET /api/ai/daily-recommendations - Get daily fresh recommendations
router.get('/daily-recommendations', async (req, res) => {
  try {
    const { userId } = req.query;
    
    console.log('🌅 DAILY RECOMMENDATIONS: Fetching fresh daily picks', {
      userId,
      timestamp: new Date().toISOString()
    });

    // Simulate fetching products from last 3 days
    const dailyProducts = sampleProducts.filter(product => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      return new Date(product.createdAt) > threeDaysAgo;
    });

    res.json({
      success: true,
      recommendations: dailyProducts,
      totalCount: dailyProducts.length,
      freshness: 'last_3_days',
      generated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Daily Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get daily recommendations',
      error: error.message
    });
  }
});

// POST /api/ai/chat - AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    console.log('💬 CHAT NOTIFICATION: User chatting with AI', {
      userId,
      messagePreview: message.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple response logic
    let response = "I'm here to help you with your bartering needs! ";
    
    if (message.toLowerCase().includes('recommend') || message.toLowerCase().includes('suggest')) {
      response += "Based on your interests, I'd suggest checking out electronics and gaming items. They're quite popular for trading!";
      
      // Send notification about product suggestions
      console.log('🤖 CHAT NOTIFICATION: AI provided product suggestions', {
        suggestedCategories: ['Electronics', 'Gaming'],
        timestamp: new Date().toISOString()
      });
    } else if (message.toLowerCase().includes('how') || message.toLowerCase().includes('help')) {
      response += "You can browse items by category, make offers using your own items or cash, and arrange safe meetups for exchanges.";
    } else {
      response += "Feel free to ask me about bartering, finding items, or how the platform works!";
    }

    res.json({
      success: true,
      response,
      suggestions: [
        "What items are trending?",
        "How do I make a good offer?",
        "Show me electronics"
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message
    });
  }
});

// POST /api/ai/track/click - Track user interactions
router.post('/track/click', async (req, res) => {
  try {
    const { productId, userId, sessionId } = req.body;
    
    console.log('🎯 INTEREST NOTIFICATION: User clicked on product', {
      productId,
      userId,
      sessionId,
      timestamp: new Date().toISOString()
    });

    // Simulate finding similar products
    const similarProducts = sampleProducts.filter(p => p._id !== productId).slice(0, 3);
    
    console.log('👀 INTEREST NOTIFICATION: Found similar items based on click', {
      originalProduct: productId,
      similarCount: similarProducts.length,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      tracked: true,
      similarProducts,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Track Click Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track interaction'
    });
  }
});

// GET /api/ai/insights - Get user insights
router.get('/insights', async (req, res) => {
  try {
    const { userId } = req.query;
    
    console.log('📊 ACTIVITY NOTIFICATION: Generating user insights', {
      userId,
      timestamp: new Date().toISOString()
    });

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const insights = {
      tradingActivity: {
        totalTrades: Math.floor(Math.random() * 20) + 5,
        successRate: Math.floor(Math.random() * 30) + 70,
        averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
        preferredCategories: ['Electronics', 'Gaming', 'Books']
      },
      recommendations: [
        "Your electronics listings get 40% more views than average",
        "Consider trading during weekends for better response rates",
        "Items with multiple photos receive 60% more offers"
      ],
      marketTrends: {
        hotCategories: ['Electronics', 'Gaming', 'Sports'],
        bestTimeToTrade: 'Weekends',
        averageResponseTime: '2.4 hours'
      }
    };

    res.json({
      success: true,
      insights,
      generated: new Date().toISOString(),
      aiConfidence: 0.92
    });

  } catch (error) {
    console.error('User Insights Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate insights',
      error: error.message
    });
  }
});

// GET /api/ai/status - Check AI service status
router.get('/status', (req, res) => {
  res.json({
    available: true,
    status: 'operational',
    services: {
      recommendations: 'active',
      chat: 'active',
      insights: 'active',
      dailyPicks: 'active'
    },
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 