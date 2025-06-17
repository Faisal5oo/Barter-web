import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Chip, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { favoritesService } from '../../services/favoritesService';
import { theme, spacing, typography } from '../../theme';
import ProductCard from '../../components/ProductCard';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    'All',
    'Electronics',
    'Furniture',
    'Clothing',
    'Gaming',
    'Sports',
    'Vehicles',
    'Books',
  ];

  const sortOptions = [
    { key: 'newest', label: 'Recently Added' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'price_low', label: 'Price: Low to High' },
    { key: 'price_high', label: 'Price: High to Low' },
    { key: 'alphabetical', label: 'A to Z' },
  ];

  const { data: favorites, isLoading, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesService.getFavorites(),
  });

  const filteredFavorites = favorites?.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      selectedCategory === 'All' || 
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }) || [];

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'oldest':
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      case 'price_low':
        const priceA = a.exchangePreferences.price || a.exchangePreferences.estimatedValue || 0;
        const priceB = b.exchangePreferences.price || b.exchangePreferences.estimatedValue || 0;
        return priceA - priceB;
      case 'price_high':
        const priceA2 = a.exchangePreferences.price || a.exchangePreferences.estimatedValue || 0;
        const priceB2 = b.exchangePreferences.price || b.exchangePreferences.estimatedValue || 0;
        return priceB2 - priceA2;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail' as never, { productId } as never);
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      await favoritesService.removeFromFavorites(productId);
      refetch();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productContainer}>
      <ProductCard
        product={item}
        onPress={() => handleProductPress(item._id)}
        onFavoritePress={() => handleRemoveFromFavorites(item._id)}
        style={styles.productCard}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>My Favorites</Text>
      <Text style={styles.subtitle}>
        {filteredFavorites.length} saved item{filteredFavorites.length !== 1 ? 's' : ''}
      </Text>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search favorites..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />

      {/* Categories */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterTitle}>Categories</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesContainer}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item || (item === 'All' && !selectedCategory)}
              onPress={() => setSelectedCategory(item === 'All' ? null : item)}
              style={styles.categoryChip}
              textStyle={styles.chipText}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      {/* Sort */}
      <View style={styles.sortContainer}>
        <Menu
          visible={showSortMenu}
          onDismiss={() => setShowSortMenu(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setShowSortMenu(true)}
              icon="sort"
              style={styles.sortButton}
            >
              {sortOptions.find(option => option.key === sortBy)?.label}
            </Button>
          }
        >
          {sortOptions.map((option) => (
            <Menu.Item
              key={option.key}
              onPress={() => {
                setSortBy(option.key);
                setShowSortMenu(false);
              }}
              title={option.label}
              leadingIcon={sortBy === option.key ? 'check' : undefined}
            />
          ))}
        </Menu>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={64} color={theme.colors.outline} />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyDescription}>
        {searchQuery || selectedCategory
          ? 'No items match your current filters.'
          : 'Start browsing and save items you like to see them here.'}
      </Text>
      {(searchQuery || selectedCategory) ? (
        <Button
          mode="contained"
          onPress={() => {
            setSearchQuery('');
            setSelectedCategory(null);
          }}
          style={styles.clearFiltersButton}
        >
          Clear Filters
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Browse' as never)}
          style={styles.browseButton}
        >
          Browse Items
        </Button>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedFavorites}
        renderItem={renderProduct}
        keyExtractor={(item) => item.favoriteId}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...typography.h1,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: spacing.lg,
  },
  searchBar: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing.lg,
  },
  filtersSection: {
    marginBottom: spacing.lg,
  },
  filterTitle: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  categoriesContainer: {
    paddingRight: spacing.md,
  },
  categoryChip: {
    marginRight: spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  chipText: {
    fontSize: 12,
  },
  sortContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  sortButton: {
    borderColor: theme.colors.outline,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  productContainer: {
    flex: 1,
    maxWidth: '48%',
  },
  productCard: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  clearFiltersButton: {
    backgroundColor: theme.colors.primary,
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
  },
});

export default FavoritesScreen; 