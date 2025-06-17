import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Card, IconButton, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, typography } from '../theme';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onFavoritePress?: () => void;
  style?: any;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.md * 3) / 2;

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onFavoritePress,
  style,
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
        return theme.colors.success;
      case 'like new':
        return theme.colors.info;
      case 'good':
        return theme.colors.secondary;
      case 'fair':
        return theme.colors.warning;
      case 'poor':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const formatPrice = (product: Product) => {
    if (product.isFree) return 'Free';
    if (product.exchangePreferences.price) {
      return `$${product.exchangePreferences.price}`;
    }
    if (product.exchangePreferences.estimatedValue) {
      return `~$${product.exchangePreferences.estimatedValue}`;
    }
    return 'Barter Only';
  };

  const getExchangeType = (product: Product) => {
    const { barter, cash } = product.exchangePreferences;
    if (barter && cash) return 'Both';
    if (barter) return 'Barter';
    if (cash) return 'Cash';
    return 'Free';
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: product.images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
            }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Favorite Button */}
          <IconButton
            icon={product.isFavorited ? 'heart' : 'heart-outline'}
            iconColor={product.isFavorited ? theme.colors.error : '#fff'}
            size={20}
            style={styles.favoriteButton}
            onPress={onFavoritePress}
          />

          {/* Free Badge */}
          {product.isFree && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          )}

          {/* Exchange Type Badge */}
          <View style={[styles.exchangeBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.exchangeBadgeText}>{getExchangeType(product)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          
          <View style={styles.details}>
            <View style={styles.conditionContainer}>
              <View style={[styles.conditionDot, { backgroundColor: getConditionColor(product.condition) }]} />
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
            
            <Text style={styles.category}>{product.category}</Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={theme.colors.onSurface} />
            <Text style={styles.location} numberOfLines={1}>
              {product.location}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.price}>{formatPrice(product)}</Text>
            <View style={styles.stats}>
              <Ionicons name="eye-outline" size={14} color={theme.colors.onSurface} />
              <Text style={styles.views}>{product.views}</Text>
            </View>
          </View>

          <View style={styles.sellerInfo}>
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>{product.listedBy.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color={theme.colors.secondary} />
                <Text style={styles.rating}>{product.listedBy.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 0,
  },
  freeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  exchangeBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exchangeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  conditionText: {
    ...typography.small,
    color: theme.colors.onSurface,
  },
  category: {
    ...typography.small,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  location: {
    ...typography.small,
    color: theme.colors.onSurface,
    marginLeft: spacing.xs,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.body,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  views: {
    ...typography.small,
    color: theme.colors.onSurface,
    marginLeft: spacing.xs,
  },
  sellerInfo: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    paddingTop: spacing.sm,
  },
  sellerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerName: {
    ...typography.small,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...typography.small,
    color: theme.colors.onSurface,
    marginLeft: spacing.xs,
  },
});

export default ProductCard; 