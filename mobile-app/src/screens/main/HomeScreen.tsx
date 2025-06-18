import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Searchbar, Button, Badge, Avatar, SegmentedButtons } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { productService } from '../../services/productService';
import { aiService } from '../../services/aiService';
import { theme, spacing, typography } from '../../theme';
import ProductCard from '../../components/ProductCard';
import { RootState } from '../../store';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [exchangeType, setExchangeType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const categories = [
    { name: 'Electronics', icon: 'phone-portrait-outline', color: '#3b82f6' },
    { name: 'Furniture', icon: 'bed-outline', color: '#10b981' },
    { name: 'Clothing', icon: 'shirt-outline', color: '#f59e0b' },
    { name: 'Gaming', icon: 'game-controller-outline', color: '#8b5cf6' },
    { name: 'Sports', icon: 'football-outline', color: '#ef4444' },
    { name: 'Vehicles', icon: 'car-outline', color: '#06b6d4' },
    { name: 'Food & Grocery', icon: 'restaurant-outline', color: '#84cc16' },
    { name: 'Free Stuff', icon: 'gift-outline', color: '#f97316' },
  ];

  const exchangeOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'barter', label: 'Barter' },
    { value: 'cash', label: 'Cash' },
    { value: 'both', label: 'Both' },
  ];

  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, exchangeType],
    queryFn: () => productService.getProducts({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
      exchangeType: exchangeType === 'all' ? undefined : (exchangeType as 'barter' | 'cash' | 'both'),
      limit: 6,
    }),
  });

  const { data: aiRecommendations } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: () => aiService.getRecommendations(),
    enabled: isAuthenticated,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderHeroSection = () => (
    <LinearGradient
      colors={['#0ea5e9', '#1e40af']}
      style={styles.heroSection}
    >
      <View style={styles.heroContent}>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>
            Trade What You Have,{'\n'}Get What You Need
          </Text>
          <Text style={styles.heroSubtitle}>
            EcoTradeX is a modern marketplace that lets you barter your items for things you actually want. No more gathering dust, start creating value.
          </Text>
          <View style={styles.heroButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('AddProduct' as never)}
              style={styles.primaryButton}
              labelStyle={styles.primaryButtonLabel}
              icon="plus"
            >
              List Your Item
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Browse' as never)}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
              icon="search"
            >
              Browse Marketplace
            </Button>
          </View>
        </View>

        {/* Floating Cards */}
        <View style={styles.floatingCards}>
          <Card style={[styles.floatingCard, styles.floatingCard1]}>
            <View style={styles.floatingCardContent}>
              <View style={styles.floatingCardHeader}>
                <View style={[styles.floatingCardIcon, { backgroundColor: '#14b8a6' }]}>
                  <Ionicons name="cube-outline" size={16} color="#fff" />
                </View>
                <View>
                  <Text style={styles.floatingCardTitle}>New Exchange</Text>
                  <Text style={styles.floatingCardSubtitle}>iPhone 13 Pro</Text>
                </View>
              </View>
              <View style={styles.floatingCardProgress} />
              <Text style={styles.floatingCardTime}>Just now</Text>
            </View>
          </Card>

          <Card style={[styles.floatingCard, styles.floatingCard2]}>
            <View style={styles.floatingCardContent}>
              <View style={styles.floatingCardHeader}>
                <View style={[styles.floatingCardIcon, { backgroundColor: '#f59e0b' }]}>
                  <Ionicons name="people" size={16} color="#fff" />
                </View>
                <View>
                  <Text style={styles.floatingCardTitle}>Deal Complete</Text>
                  <Text style={styles.floatingCardSubtitle}>MacBook for iPad</Text>
                </View>
              </View>
              <View style={styles.floatingCardProgress} />
              <Text style={styles.floatingCardTime}>5 minutes ago</Text>
            </View>
          </Card>
        </View>
      </View>
    </LinearGradient>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Browse by Category</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryCard,
              selectedCategory === category.name && styles.categoryCardSelected
            ]}
            onPress={() => handleCategorySelect(
              selectedCategory === category.name ? null : category.name
            )}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
              <Ionicons
                name={category.icon as any}
                size={24}
                color={category.color}
              />
            </View>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.name && styles.categoryTextSelected
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAIRecommendations = () => {
    if (!isAuthenticated || !aiRecommendations?.length) return null;

    return (
      <LinearGradient
        colors={['#f3e8ff', '#e0e7ff']}
        style={styles.aiSection}
      >
        <View style={styles.aiHeader}>
          <View style={styles.aiTitleContainer}>
            <LinearGradient
              colors={['#8b5cf6', '#ec4899']}
              style={styles.aiIcon}
            >
              <Ionicons name="bulb" size={20} color="#fff" />
            </LinearGradient>
            <Text style={styles.aiTitle}>AI-Powered Recommendations</Text>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={10} color="#fff" />
              <Text style={styles.aiBadgeText}>New</Text>
            </View>
          </View>
          <Text style={styles.aiSubtitle}>
            Discover products tailored just for you. Our AI analyzes your preferences to suggest perfect trades.
          </Text>
          <Button
            mode="outlined"
            onPress={() => console.log('Navigate to AI Dashboard')}
            style={styles.aiButton}
            labelStyle={styles.aiButtonLabel}
            icon="arrow-right"
            compact
          >
            View Full AI Dashboard
          </Button>
        </View>

        <View style={styles.aiSingleRecommendation}>
          {aiRecommendations.slice(0, 1).map((recommendation) => (
            <View key={recommendation.id} style={styles.aiRecommendationCard}>
              <ProductCard
                product={recommendation.product}
                onPress={() => navigation.navigate('ProductDetail' as any, { productId: recommendation.product._id })}
                style={styles.aiProductCard}
              />
              <View style={styles.aiRecommendationReason}>
                <Text style={styles.aiReasonText}>{recommendation.reason}</Text>
                <View style={styles.aiConfidence}>
                  <Text style={styles.aiConfidenceText}>
                    {Math.round(recommendation.confidence * 100)}% match
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>
    );
  };

  const renderRecentListings = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Recent Listings</Text>
          <Text style={styles.sectionSubtitle}>Find your next trade opportunity</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Browse' as never)}>
          <Text style={styles.seeAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <Searchbar
        placeholder="Search for items..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />

      {/* Exchange Type Filter */}
      <View style={styles.exchangeFilterContainer}>
        <SegmentedButtons
          value={exchangeType}
          onValueChange={setExchangeType}
          buttons={exchangeOptions}
          style={styles.exchangeFilter}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <View style={styles.productsGrid}>
          {productsData?.products.slice(0, 6).map((product) => (
            <View key={product._id} style={styles.productContainer}>
              <ProductCard
                product={product}
                onPress={() => navigation.navigate('ProductDetail' as any, { productId: product._id })}
                style={styles.productCard}
              />
            </View>
          ))}
        </View>
      )}

      <View style={styles.viewAllContainer}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Browse' as never)}
          style={styles.viewAllButton}
          labelStyle={styles.viewAllButtonLabel}
          icon="arrow-right"
        >
          View All Listings
        </Button>
      </View>
    </View>
  );

  const renderHowItWorks = () => (
    <View style={styles.howItWorksSection}>
      <Text style={styles.sectionTitle}>How BarterX Works</Text>
      <Text style={styles.sectionSubtitle}>Simple steps to start trading</Text>

      <View style={styles.howItWorksSteps}>
        <View style={styles.howItWorksStep}>
          <View style={[styles.stepIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="people" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.stepTitle}>List Your Items</Text>
          <Text style={styles.stepDescription}>
            Take a few photos, add a description, and specify if you're looking for barter, cash, or both.
          </Text>
        </View>

        <View style={styles.howItWorksStep}>
          <View style={[styles.stepIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="search-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.stepTitle}>Browse & Offer</Text>
          <Text style={styles.stepDescription}>
            Find items you want and make offers using your own items, cash, or a combination of both.
          </Text>
        </View>

        <View style={styles.howItWorksStep}>
          <View style={[styles.stepIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="people" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.stepTitle}>Exchange & Rate</Text>
          <Text style={styles.stepDescription}>
            Meet safely to exchange items, or arrange shipping. Rate your experience afterward.
          </Text>
        </View>
      </View>

      <Button
        mode="contained"
        onPress={() => console.log('Learn more')}
        style={styles.learnMoreButton}
        labelStyle={styles.learnMoreButtonLabel}
      >
        Learn More About the Process
      </Button>
    </View>
  );

  const renderSafetySection = () => (
    <View style={styles.safetySection}>
      <View style={styles.safetyContent}>
        <View style={styles.safetyText}>
          <Text style={styles.safetyTitle}>Trading Safely on BarterX</Text>
          
          <View style={styles.safetyTips}>
            <View style={styles.safetyTip}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.secondary} />
              <View style={styles.safetyTipContent}>
                <Text style={styles.safetyTipTitle}>Meet in public places</Text>
                <Text style={styles.safetyTipDescription}>
                  Always arrange exchanges in well-lit, public areas with plenty of people around.
                </Text>
              </View>
            </View>

            <View style={styles.safetyTip}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.secondary} />
              <View style={styles.safetyTipContent}>
                <Text style={styles.safetyTipTitle}>Verify items before exchanging</Text>
                <Text style={styles.safetyTipDescription}>
                  Take time to inspect items thoroughly before finalizing any exchange.
                </Text>
              </View>
            </View>

            <View style={styles.safetyTip}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.secondary} />
              <View style={styles.safetyTipContent}>
                <Text style={styles.safetyTipTitle}>Use secure payment methods</Text>
                <Text style={styles.safetyTipDescription}>
                  When cash is involved, use the BarterX secure payment system.
                </Text>
              </View>
            </View>
          </View>

          <Button
            mode="outlined"
            onPress={() => console.log('Safety tips')}
            style={styles.safetyButton}
            labelStyle={styles.safetyButtonLabel}
          >
            Read All Safety Tips
          </Button>
        </View>

        <View style={styles.safetyImageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?q=80&w=1266&auto=format&fit=crop'
            }}
            style={styles.safetyImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeroSection()}
        {renderCategories()}
        {renderAIRecommendations()}
        {renderRecentListings()}
        {renderHowItWorks()}
        {renderSafetySection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
  },
  heroText: {
    marginBottom: spacing.xl,
  },
  heroTitle: {
    ...typography.h1,
    color: '#fff',
    marginBottom: spacing.md,
    lineHeight: 40,
  },
  heroSubtitle: {
    ...typography.body,
    color: '#fff',
    opacity: 0.9,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  heroButtons: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.secondary,
    marginBottom: spacing.sm,
  },
  primaryButtonLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  secondaryButtonLabel: {
    color: '#fff',
    fontWeight: '600',
  },

  // Floating Cards
  floatingCards: {
    position: 'absolute',
    right: -spacing.md,
    top: spacing.lg,
    width: 200,
  },
  floatingCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: spacing.md,
  },
  floatingCard1: {
    transform: [{ translateX: -20 }],
  },
  floatingCard2: {
    transform: [{ translateX: 20 }],
  },
  floatingCardContent: {
    padding: spacing.md,
  },
  floatingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  floatingCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  floatingCardTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  floatingCardSubtitle: {
    color: '#fff',
    opacity: 0.7,
    fontSize: 10,
  },
  floatingCardProgress: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 1,
    marginBottom: spacing.xs,
  },
  floatingCardTime: {
    color: '#fff',
    opacity: 0.7,
    fontSize: 10,
  },

  // Sections
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  seeAllText: {
    ...typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Categories - 3 per row
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - spacing.lg * 2 - spacing.md * 2) / 3,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: spacing.md,
  },
  categoryCardSelected: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryText: {
    ...typography.caption,
    textAlign: 'center',
    color: theme.colors.onSurface,
    fontSize: 11,
  },
  categoryTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // AI Section
  aiSection: {
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  aiHeader: {
    marginBottom: spacing.lg,
  },
  aiTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  aiTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginRight: spacing.sm,
  },
  aiBadge: {
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
  },
  aiBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  aiSubtitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  aiButton: {
    borderColor: theme.colors.primary,
    alignSelf: 'flex-start',
  },
  aiButtonLabel: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  aiSingleRecommendation: {
    alignItems: 'center',
  },
  aiRecommendationCard: {
    width: 200,
  },
  aiProductCard: {
    width: '100%',
  },
  aiRecommendationReason: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
  },
  aiReasonText: {
    ...typography.caption,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  aiConfidence: {
    alignSelf: 'flex-start',
  },
  aiConfidenceText: {
    ...typography.small,
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Search and Products
  searchBar: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing.lg,
  },
  exchangeFilterContainer: {
    marginBottom: spacing.lg,
  },
  exchangeFilter: {
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  productContainer: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
  },
  productCard: {
    width: '100%',
  },
  viewAllContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  viewAllButton: {
    borderColor: theme.colors.outline,
  },
  viewAllButtonLabel: {
    color: theme.colors.onSurface,
  },

  // How It Works
  howItWorksSection: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  howItWorksSteps: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  howItWorksStep: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  stepTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  stepDescription: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
  learnMoreButton: {
    backgroundColor: theme.colors.primary,
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
  learnMoreButtonLabel: {
    color: '#fff',
    fontWeight: '600',
  },

  // Safety Section
  safetySection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  safetyContent: {
    gap: spacing.lg,
  },
  safetyText: {
    flex: 1,
  },
  safetyTitle: {
    ...typography.h2,
    color: theme.colors.onSurface,
    marginBottom: spacing.lg,
  },
  safetyTips: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  safetyTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  safetyTipContent: {
    flex: 1,
  },
  safetyTipTitle: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  safetyTipDescription: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    lineHeight: 20,
  },
  safetyButton: {
    borderColor: theme.colors.outline,
    alignSelf: 'flex-start',
  },
  safetyButtonLabel: {
    color: theme.colors.onSurface,
  },
  safetyImageContainer: {
    marginTop: spacing.lg,
  },
  safetyImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});

export default HomeScreen; 