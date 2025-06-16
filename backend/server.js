const express = require('express');
const cors = require('cors');
const favoritesRoutes = require('./routes/favoritesRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/favorites', favoritesRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BarterX Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BarterX Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`❤️  Favorites API: http://localhost:${PORT}/api/favorites`);
  console.log(`🤖 AI API: http://localhost:${PORT}/api/ai`);
}); 