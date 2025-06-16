import React from 'react';

// AI Notification Service
class AINotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  // Add a notification listener
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  notify(notification) {
    this.notifications.unshift(notification);
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    
    this.listeners.forEach(callback => callback(notification));
    
    // Console log for development
    console.log(`🤖 AI Notification: ${notification.title}`, notification);
  }

  // Recommendation notifications
  sendRecommendationNotification(recommendations) {
    if (!recommendations || recommendations.length === 0) return;

    const topMatch = recommendations[0];
    this.notify({
      id: Date.now(),
      type: 'recommendation',
      title: '📦 New Recommendations Available',
      message: `Found ${recommendations.length} items that match your interests! Top match: ${topMatch.title} (${topMatch.aiInsights?.matchPercentage || 85}% match)`,
      data: recommendations,
      timestamp: new Date(),
      icon: '🎯'
    });
  }

  // Interest tracking notifications
  sendInterestNotification(productId, similarProducts = []) {
    this.notify({
      id: Date.now(),
      type: 'interest',
      title: '🎯 Similar Items Found',
      message: `Based on your interest, we found ${similarProducts.length} similar items you might like!`,
      data: { productId, similarProducts },
      timestamp: new Date(),
      icon: '👀'
    });
  }

  // Daily recommendations
  sendDailyRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) return;

    this.notify({
      id: Date.now(),
      type: 'daily',
      title: '🌅 Fresh Daily Picks',
      message: `${recommendations.length} new items added today that match your preferences!`,
      data: recommendations,
      timestamp: new Date(),
      icon: '✨'
    });
  }

  // Chat notifications  
  sendChatNotification(productSuggestions) {
    if (!productSuggestions || productSuggestions.length === 0) return;

    this.notify({
      id: Date.now(),
      type: 'chat',
      title: '💬 AI Product Suggestions',
      message: `AI suggested ${productSuggestions.length} products based on your chat conversation`,
      data: productSuggestions,
      timestamp: new Date(),
      icon: '🤖'
    });
  }

  // User activity notifications
  sendActivityNotification(activity) {
    this.notify({
      id: Date.now(),
      type: 'activity',
      title: '📊 Trading Insight',
      message: activity.message,
      data: activity,
      timestamp: new Date(),
      icon: '📈'
    });
  }

  // Offer accepted notification
  sendOfferAcceptedNotification(productTitle, offerType) {
    this.notify({
      id: Date.now(),
      type: 'offer',
      title: '🎉 Offer Accepted!',
      message: `Your ${offerType} offer for "${productTitle}" has been accepted!`,
      data: { productTitle, offerType },
      timestamp: new Date(),
      icon: '✅'
    });
  }

  // Product sold/traded notification
  sendProductTradedNotification(productTitle, isBartered = true) {
    const action = isBartered ? 'bartered' : 'sold';
    const icon = isBartered ? '🔄' : '💰';
    
    this.notify({
      id: Date.now(),
      type: 'trade',
      title: `${icon} Item ${action.charAt(0).toUpperCase() + action.slice(1)}!`,
      message: `"${productTitle}" has been successfully ${action}!`,
      data: { productTitle, isBartered },
      timestamp: new Date(),
      icon
    });
  }

  // Get all notifications
  getNotifications() {
    return this.notifications;
  }

  // Clear notifications
  clearNotifications() {
    this.notifications = [];
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
}

// Create singleton instance
export const aiNotificationService = new AINotificationService();

// React hook for using notifications
export const useAINotifications = () => {
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = aiNotificationService.subscribe((notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    // Get existing notifications
    setNotifications(aiNotificationService.getNotifications());

    return unsubscribe;
  }, []);

  const clearNotifications = () => {
    aiNotificationService.clearNotifications();
    setNotifications([]);
  };

  const markAsRead = (notificationId) => {
    aiNotificationService.markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  return {
    notifications,
    clearNotifications,
    markAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  };
};

export default aiNotificationService; 