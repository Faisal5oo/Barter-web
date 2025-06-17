import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Searchbar, 
  Button, 
  SegmentedButtons, 
  Menu, 
  Divider,
  Chip,
  FAB
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { productService } from '../../services/productService';
import { theme, spacing, typography } from '../../theme';
import ProductCard from '../../components/ProductCard';

const { width } = Dimensions.get('window');

const BrowseScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [exchangeType, setExchangeType] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const categories = [
    { name: 'Electronics', icon: 'phone-portrait-outline', color: '#0ea5e9' },
    { name: 'Furniture', icon: 'bed-outline', color: '#10b981' },
    { name: 'Clothing', icon: 'shirt-outline', color: '#f59e0b' },
    { name: 'Gaming', icon: 'game-controller-outline', color: '#8b5cf6' },
    { name: 'Sports', icon: 'football-outline', color: '#ef4444' },
    { name: 'Vehicles', icon: 'car-outline', color: '#06b6d4' },
    { name: 'Food & Grocery', icon: 'restaurant-outline', color: '#84cc16' },
    { name: 'Free Stuff', icon: 'gift-outline', color: '#f59e0b' },
  ];

  const exchangeOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'barter', label: 'Barter Only' },
    { value: 'cash', label: 'Cash Only' },
    { value: 'both', label: 'Both' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Highest Rated', value: 'rating_high' },
    { label: 'Lowest Rated', value: 'rating_low' },
  ];

  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ['browse-products', selectedCategory, searchQuery, exchangeType, sortOption],
    queryFn: () => productService.getProducts({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
      exchangeType: exchangeType === 'all' ? undefined : (exchangeType as 'barter' | 'cash' | 'both'),
      sort: sortOption,
      limit: 20,
    }),
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

  const renderHeader = () => (
    <LinearGradient
      colors={['#0ea5e9', '#1e40af']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.breadcrumbText}>Home</Text>
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
          <Text style={styles.breadcrumbTextActive}>Browse</Text>
        </View>
        
        <View style={styles.headerMain}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Browse Items</Text>
            <Text style={styles.headerSubtitle}>Find items to trade or purchase</Text>
          </View>
          
          <View style={styles.headerActions}>
            <Button
              mode="outlined"
              onPress={() => console.log('Nearby')}
              style={styles.nearbyButton}
              labelStyle={styles.nearbyButtonLabel}
              icon="location"
              compact
            >
              Nearby
            </Button>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderFilters = () => (
    <View style={styles.filtersSection}>
      <Searchbar
        placeholder="Search for items..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />
      
      <View style={styles.filtersRow}>
        <View style={styles.sortContainer}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setSortMenuVisible(true)}
                style={styles.sortButton}
                labelStyle={styles.sortButtonLabel}
                icon="swap-vertical"
                compact
              >
                {sortOptions.find(opt => opt.value === sortOption)?.label || 'Sort'}
              </Button>
            }
          >
            {sortOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setSortOption(option.value);
                  setSortMenuVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>
        </View>
        
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'grid' && styles.viewModeButtonActive
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons 
              name="grid" 
              size={20} 
              color={viewMode === 'grid' ? theme.colors.primary : theme.colors.onSurface} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'list' && styles.viewModeButtonActive
            ]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons 
              name="list" 
              size={20} 
              color={viewMode === 'list' ? theme.colors.primary : theme.colors.onSurface} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        <View style={styles.categoriesContainer}>
          <Chip
            selected={selectedCategory === null}
            onPress={() => handleCategorySelect(null)}
            style={[
              styles.categoryChip,
              selectedCategory === null && styles.categoryChipSelected
            ]}
            textStyle={[
              styles.categoryChipText,
              selectedCategory === null && styles.categoryChipTextSelected
            ]}
          >
            All Categories
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category.name}
              selected={selectedCategory === category.name}
              onPress={() => handleCategorySelect(
                selectedCategory === category.name ? null : category.name
              )}
              style={[
                styles.categoryChip,
                selectedCategory === category.name && styles.categoryChipSelected
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === category.name && styles.categoryChipTextSelected
              ]}
              icon={() => (
                <Ionicons 
                  name={category.icon as any} 
                  size={16} 
                  color={selectedCategory === category.name ? '#fff' : category.color} 
                />
              )}
            >
              {category.name}
            </Chip>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.exchangeFilterContainer}>
        <SegmentedButtons
          value={exchangeType}
          onValueChange={setExchangeType}
          buttons={exchangeOptions}
          style={styles.exchangeFilter}
        />
      </View>
    </View>
  );

  const renderProducts = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    if (!productsData?.products.length) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color={theme.colors.outline} />
          <Text style={styles.emptyTitle}>No items found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search or filters
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.productsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {productsData.products.length} items found
          </Text>
        </View>
        
        <View style={viewMode === 'grid' ? styles.productsGrid : styles.productsList}>
          {productsData.products.map((product) => (
            <View 
              key={product._id} 
              style={viewMode === 'grid' ? styles.productGridItem : styles.productListItem}
            >
              <ProductCard
                product={product}
                onPress={() => navigation.navigate('ProductDetail' as any, { productId: product._id })}
                style={styles.productCard}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderFilters()}
        {renderProducts()}
      </ScrollView>
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct' as any)}
        label="List Item"
      />
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
  
  // Header
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerContent: {
    gap: spacing.md,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  breadcrumbText: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
  },
  breadcrumbTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  headerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h1,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 16,
  },
  headerActions: {
    marginLeft: spacing.md,
  },
  nearbyButton: {
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  nearbyButtonLabel: {
    color: '#fff',
    fontSize: 12,
  },
  
  // Filters
  filtersSection: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  searchBar: {
    backgroundColor: theme.colors.background,
    elevation: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortContainer: {
    flex: 1,
  },
  sortButton: {
    borderColor: theme.colors.outline,
    alignSelf: 'flex-start',
  },
  sortButtonLabel: {
    color: theme.colors.onSurface,
    fontSize: 12,
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    padding: spacing.sm,
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoriesScroll: {
    marginHorizontal: -spacing.lg,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    color: theme.colors.onSurface,
    fontSize: 12,
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  exchangeFilterContainer: {
    marginTop: spacing.sm,
  },
  exchangeFilter: {
    backgroundColor: theme.colors.background,
  },
  
  // Products
  productsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  resultsHeader: {
    marginBottom: spacing.lg,
  },
  resultsCount: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  productsList: {
    gap: spacing.md,
  },
  productGridItem: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
  },
  productListItem: {
    width: '100%',
  },
  productCard: {
    width: '100%',
  },
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
  },
  
  // FAB
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default BrowseScreen; 