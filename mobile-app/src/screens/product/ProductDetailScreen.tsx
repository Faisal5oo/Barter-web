import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Card, 
  Button, 
  Badge, 
  Divider, 
  Chip,
  TextInput,
  RadioButton,
  ActivityIndicator,
  FAB
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { productService } from '../../services/productService';
import { theme, spacing, typography } from '../../theme';
import ProductCard from '../../components/ProductCard';
import { RootState } from '../../store';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  productId: string;
}

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as RouteParams;
  const queryClient = useQueryClient();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showBarterModal, setShowBarterModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [exchangeType, setExchangeType] = useState<'barter' | 'barter_plus_cash' | 'cash_only'>('barter');
  const [cashAmount, setCashAmount] = useState<string>('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Fetch product data
  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
  });

  // Get user's products for offering (simplified)
  const { data: myListingsData } = useQuery({
    queryKey: ['my-products'],
    queryFn: () => productService.getProducts({}),
    enabled: isAuthenticated,
  });

  // Check if current user is the owner (simplified)
  const isOwner = user && product && product.listedBy && (
    (user as any).id === (product.listedBy as any)._id
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getCategoryIcon = (category: string, size = 24) => {
    const categoryLower = category?.toLowerCase() || '';
    
    if (categoryLower.includes('electronics') || categoryLower.includes('phone')) {
      return 'phone-portrait-outline';
    }
    if (categoryLower.includes('furniture')) {
      return 'bed-outline';
    }
    if (categoryLower.includes('clothing')) {
      return 'shirt-outline';
    }
    if (categoryLower.includes('gaming')) {
      return 'game-controller-outline';
    }
    if (categoryLower.includes('sports')) {
      return 'football-outline';
    }
    if (categoryLower.includes('vehicle') || categoryLower.includes('car')) {
      return 'car-outline';
    }
    return 'cube-outline';
  };

  const handleBarter = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to make an offer',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login' as any) }
        ]
      );
      return;
    }
    setShowBarterModal(true);
  };

  const handleEdit = () => {
    navigation.navigate('EditProduct' as any, { productId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${product?.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(productId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  const handleBarterSubmit = async () => {
    if (exchangeType !== 'cash_only' && !selectedProduct) {
      Alert.alert('Selection Required', 'Please select a product to offer.');
      return;
    }

    if ((exchangeType === 'barter_plus_cash' || exchangeType === 'cash_only') && !cashAmount) {
      Alert.alert('Cash Amount Required', 'Please enter the cash amount for this offer.');
      return;
    }

    try {
      const offerData = {
        offeredTo: product?.listedBy?._id || product?.listedBy,
        offeredProduct: exchangeType === 'cash_only' ? undefined : selectedProduct,
        requestedProduct: productId,
        message: offerMessage || 'I would like to trade my product for yours.',
        exchangeType: exchangeType,
        cashAmount: (exchangeType === 'barter_plus_cash' || exchangeType === 'cash_only') ? parseFloat(cashAmount) : undefined
      };

      // This would be implemented in your offer service
      // await offerService.createOffer(offerData);
      
      setShowBarterModal(false);
      setSelectedProduct('');
      setOfferMessage('');
      setExchangeType('barter');
      setCashAmount('');
      
      Alert.alert('Success', 'Your offer has been sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send offer. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
          <Text style={styles.errorTitle}>Product not found</Text>
          <Text style={styles.errorText}>
            The product you're looking for doesn't exist or has been removed.
          </Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const renderImageGallery = () => (
    <View style={styles.imageSection}>
      <TouchableOpacity
        style={styles.mainImageContainer}
        onPress={() => setShowImageModal(true)}
      >
        {product.images?.[mainImageIndex] ? (
          <Image
            source={{ uri: product.images[mainImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons 
              name={getCategoryIcon(product.category, 48) as any} 
              size={48} 
              color={theme.colors.outline} 
            />
          </View>
        )}
        {((product as any).isSold && (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        ))}
      </TouchableOpacity>
      
      {product.images && product.images.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailScroll}
        >
          <View style={styles.thumbnailContainer}>
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnail,
                  mainImageIndex === index && styles.thumbnailActive
                ]}
                onPress={() => setMainImageIndex(index)}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <View style={styles.titleSection}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <View style={styles.badgeContainer}>
          <Chip 
            icon={() => <Ionicons name={getCategoryIcon(product.category, 16) as any} size={16} color={theme.colors.primary} />}
            style={styles.categoryChip}
            textStyle={styles.chipText}
          >
            {product.category}
          </Chip>
          <Chip 
            style={[styles.conditionChip, { backgroundColor: '#f59e0b' + '20' }]}
            textStyle={[styles.chipText, { color: '#f59e0b' }]}
          >
            {product.condition}
          </Chip>
        </View>
      </View>

      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <Ionicons name="location" size={16} color={theme.colors.outline} />
          <Text style={styles.metaText}>{product.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={16} color={theme.colors.outline} />
          <Text style={styles.metaText}>
            Listed {new Date(product.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {product.views && (
          <View style={styles.metaItem}>
            <Ionicons name="eye" size={16} color={theme.colors.outline} />
            <Text style={styles.metaText}>{product.views} views</Text>
          </View>
        )}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{product.description}</Text>
      </View>

      {/* Condition Details */}
      {((product as any).age || (product as any).warranty || (product as any).boxAccessories) && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition Details</Text>
            <View style={styles.detailsGrid}>
              {(product as any).age && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Age</Text>
                  <Text style={styles.detailValue}>{(product as any).age}</Text>
                </View>
              )}
              {(product as any).warranty && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Warranty</Text>
                  <Text style={styles.detailValue}>{(product as any).warranty}</Text>
                </View>
              )}
              {(product as any).boxAccessories && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Box & Accessories</Text>
                  <Text style={styles.detailValue}>{(product as any).boxAccessories}</Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {/* Exchange Preferences */}
      {product.exchangePreferences && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exchange Preferences</Text>
            
            {product.exchangePreferences.preferredItems?.length > 0 && (
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Preferred Items</Text>
                <View style={styles.chipContainer}>
                  {product.exchangePreferences.preferredItems.map((item, index) => (
                    <Chip key={index} style={styles.preferenceChip} textStyle={styles.preferenceChipText}>
                      {item}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.exchangeOptions}>
              <View style={styles.exchangeOption}>
                <Text style={styles.exchangeLabel}>Cash Option</Text>
                <View style={styles.exchangeValue}>
                  <Text style={styles.exchangeText}>
                    {product.exchangePreferences.cashOption ? 'Yes' : 'No'}
                  </Text>
                  {!product.exchangePreferences.cashOption && (
                    <Chip 
                      style={[styles.barterOnlyChip, { backgroundColor: '#0ea5e9' + '20' }]}
                      textStyle={[styles.chipText, { color: '#0ea5e9' }]}
                    >
                      Barter Only
                    </Chip>
                  )}
                </View>
              </View>

              {(product.exchangePreferences.minPrice || product.exchangePreferences.maxPrice || product.exchangePreferences.price) && (
                <View style={styles.exchangeOption}>
                  <Text style={styles.exchangeLabel}>Price Range</Text>
                  <Text style={[styles.priceText, { color: '#f59e0b' }]}>
                    {product.exchangePreferences.minPrice && product.exchangePreferences.maxPrice ? 
                      `PKR ${product.exchangePreferences.minPrice.toLocaleString()} - ${product.exchangePreferences.maxPrice.toLocaleString()}` :
                      product.exchangePreferences.price ?
                      `PKR ${product.exchangePreferences.price.toLocaleString()}` :
                      `PKR ${(product.exchangePreferences.minPrice || product.exchangePreferences.maxPrice)?.toLocaleString()}`
                    }
                  </Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {/* Shipping Options */}
      {product.shippingOptions && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping & Location</Text>
            <View style={styles.shippingGrid}>
              <View style={styles.shippingItem}>
                <Text style={styles.shippingLabel}>In-Person Exchange</Text>
                <Text style={styles.shippingValue}>
                  {product.shippingOptions.inPerson ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.shippingItem}>
                <Text style={styles.shippingLabel}>Can Ship</Text>
                <Text style={styles.shippingValue}>
                  {product.shippingOptions.canShip ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Listed By */}
      {product.listedBy && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed By</Text>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerInitial}>
                  {product.listedBy.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>{product.listedBy.name || 'Unknown User'}</Text>
                {product.listedBy.email && (
                  <Text style={styles.sellerEmail}>{product.listedBy.email}</Text>
                )}
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );

  const renderActionButtons = () => {
    if (isOwner) {
      return (
        <View style={styles.ownerActions}>
          <Text style={styles.ownerText}>You are the owner of this listing</Text>
          <View style={styles.ownerButtons}>
            <Button
              mode="outlined"
              onPress={handleEdit}
              style={styles.editButton}
              icon="pencil"
            >
              Edit
            </Button>
            <Button
              mode="contained"
              onPress={handleDelete}
              style={styles.deleteButton}
              buttonColor={theme.colors.error}
              icon="delete"
            >
              Delete
            </Button>
          </View>
        </View>
      );
    }

    if (((product as any).isSold)) {
      return (
        <View style={styles.soldContainer}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.soldBanner}
          >
            <Text style={styles.soldBannerText}>SOLD</Text>
            <Text style={styles.soldSubtext}>This item is no longer available</Text>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View style={styles.actionButtons}>
        <LinearGradient
          colors={['#0ea5e9', '#1e40af']}
          style={styles.barterButton}
        >
          <TouchableOpacity
            style={styles.barterButtonInner}
            onPress={handleBarter}
          >
            <Ionicons name="chatbubble" size={20} color="#fff" />
            <Text style={styles.barterButtonText}>
              {isAuthenticated 
                ? product.exchangePreferences?.cashOption 
                  ? 'Start Barter' 
                  : 'Make Barter Offer'
                : 'Login to Barter'
              }
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        
        {!isAuthenticated && (
          <Text style={styles.loginHint}>
            Please login or register to initiate a barter
          </Text>
        )}
        
        {isAuthenticated && !product.exchangePreferences?.cashOption && (
          <Text style={styles.barterHint}>
            💡 This seller only accepts product exchanges (no cash offers)
          </Text>
        )}
      </View>
    );
  };

  const renderBarterModal = () => (
    <Modal
      visible={showBarterModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowBarterModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowBarterModal(false)}>
            <Ionicons name="close" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Make a Barter Offer</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          {/* Select Product to Offer */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Select Your Product to Offer</Text>
            {myListingsData?.products?.length === 0 ? (
              <Card style={styles.noProductsCard}>
                <Text style={styles.noProductsText}>
                  You don't have any products listed yet.
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    setShowBarterModal(false);
                    navigation.navigate('AddProduct' as any);
                  }}
                  style={styles.addProductButton}
                >
                  Add a Product
                </Button>
              </Card>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.productsList}>
                  {myListingsData?.products?.map((userProduct) => (
                    <TouchableOpacity
                      key={userProduct._id}
                      style={[
                        styles.productOption,
                        selectedProduct === userProduct._id && styles.productOptionSelected
                      ]}
                      onPress={() => setSelectedProduct(userProduct._id)}
                    >
                      <Image
                        source={{ uri: userProduct.images?.[0] || 'https://via.placeholder.com/150' }}
                        style={styles.productOptionImage}
                      />
                      {selectedProduct === userProduct._id && (
                        <View style={styles.selectedOverlay}>
                          <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        </View>
                      )}
                      <Text style={styles.productOptionTitle} numberOfLines={2}>
                        {userProduct.title}
                      </Text>
                      <Text style={styles.productOptionCategory}>{userProduct.category}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Exchange Type */}
          {product.exchangePreferences?.cashOption && (
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Exchange Type</Text>
              <RadioButton.Group onValueChange={setExchangeType} value={exchangeType}>
                <View style={styles.radioOption}>
                  <RadioButton value="barter" />
                  <View style={styles.radioContent}>
                    <Text style={styles.radioTitle}>Product Exchange Only</Text>
                    <Text style={styles.radioDescription}>Trade your product for theirs</Text>
                  </View>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="barter_plus_cash" />
                  <View style={styles.radioContent}>
                    <Text style={styles.radioTitle}>Product + Cash</Text>
                    <Text style={styles.radioDescription}>Trade your product plus additional cash</Text>
                  </View>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="cash_only" />
                  <View style={styles.radioContent}>
                    <Text style={styles.radioTitle}>Cash Only</Text>
                    <Text style={styles.radioDescription}>Make a cash offer without trading items</Text>
                  </View>
                </View>
              </RadioButton.Group>

              {(exchangeType === 'barter_plus_cash' || exchangeType === 'cash_only') && (
                <View style={styles.cashInputContainer}>
                  <Text style={styles.cashInputLabel}>
                    {exchangeType === 'barter_plus_cash' ? 'Additional Cash Amount' : 'Offer Amount'}
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={cashAmount}
                    onChangeText={setCashAmount}
                    placeholder="0"
                    keyboardType="numeric"
                    left={<TextInput.Affix text="PKR" />}
                    style={styles.cashInput}
                  />
                </View>
              )}
            </View>
          )}

          {/* Message */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Message (Optional)</Text>
            <TextInput
              mode="outlined"
              value={offerMessage}
              onChangeText={setOfferMessage}
              placeholder="Add a message to your offer..."
              multiline
              numberOfLines={3}
              style={styles.messageInput}
            />
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={() => setShowBarterModal(false)}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleBarterSubmit}
            disabled={exchangeType !== 'cash_only' && !selectedProduct}
            style={styles.sendButton}
          >
            Send Offer
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
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
        {renderImageGallery()}
        {renderProductInfo()}
      </ScrollView>

      {renderActionButtons()}
      {renderBarterModal()}

      {/* Image Modal */}
      <Modal
        visible={showImageModal}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setShowImageModal(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageModalScroll}
          >
            {product.images?.map((image, index) => (
              <View key={index} style={styles.imageModalPage}>
                <Image
                  source={{ uri: image }}
                  style={styles.imageModalImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
  
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: {
    ...typography.h2,
    color: theme.colors.error,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: theme.colors.primary,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: '#fff',
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },

  // Image Section
  imageSection: {
    backgroundColor: theme.colors.surface,
  },
  mainImageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width,
  },
  placeholderImage: {
    width: width,
    height: width,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldText: {
    ...typography.h1,
    color: '#fff',
    fontWeight: 'bold',
    transform: [{ rotate: '-15deg' }],
  },
  thumbnailScroll: {
    paddingVertical: spacing.md,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: theme.colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  // Product Info
  productInfo: {
    padding: spacing.lg,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  productTitle: {
    ...typography.h1,
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryChip: {
    backgroundColor: theme.colors.primary + '20',
  },
  conditionChip: {
    backgroundColor: '#f59e0b' + '20',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  
  // Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  descriptionText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.8,
    lineHeight: 24,
  },
  
  // Details Grid
  detailsGrid: {
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    color: theme.colors.onSurface,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },

  // Exchange Preferences
  preferenceItem: {
    marginBottom: spacing.md,
  },
  preferenceLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  preferenceChip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  preferenceChipText: {
    fontSize: 12,
  },
  exchangeOptions: {
    gap: spacing.md,
  },
  exchangeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exchangeLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  exchangeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  exchangeText: {
    ...typography.body,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  barterOnlyChip: {
    backgroundColor: '#0ea5e9' + '20',
  },
  priceText: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 16,
  },

  // Shipping
  shippingGrid: {
    gap: spacing.md,
  },
  shippingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shippingLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  shippingValue: {
    ...typography.body,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },

  // Seller Info
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerInitial: {
    ...typography.h3,
    color: '#fff',
    fontWeight: 'bold',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    ...typography.body,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  sellerEmail: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },

  // Action Buttons
  ownerActions: {
    padding: spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  ownerText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  ownerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  editButton: {
    flex: 1,
    borderColor: '#0ea5e9',
  },
  deleteButton: {
    flex: 1,
  },
  soldContainer: {
    padding: spacing.lg,
  },
  soldBanner: {
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  soldBannerText: {
    ...typography.h2,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  soldSubtext: {
    ...typography.body,
    color: '#fff',
    opacity: 0.9,
  },
  actionButtons: {
    padding: spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  barterButton: {
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  barterButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  barterButtonText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginHint: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
  },
  barterHint: {
    ...typography.caption,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  modalTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  modalSection: {
    marginBottom: spacing.xl,
  },
  modalSectionTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  noProductsCard: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  noProductsText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
  },
  addProductButton: {
    backgroundColor: '#0ea5e9',
  },
  productsList: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  productOption: {
    width: 120,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  productOptionSelected: {
    borderColor: theme.colors.primary,
  },
  productOptionImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  selectedOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
  productOptionTitle: {
    ...typography.caption,
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  productOptionCategory: {
    ...typography.small,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  radioContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  radioTitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  radioDescription: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  cashInputContainer: {
    marginTop: spacing.md,
  },
  cashInputLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  cashInput: {
    backgroundColor: theme.colors.surface,
  },
  messageInput: {
    backgroundColor: theme.colors.surface,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  cancelButton: {
    flex: 1,
    borderColor: theme.colors.outline,
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#0ea5e9',
  },

  // Image Modal
  imageModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: spacing.sm,
  },
  imageModalScroll: {
    flex: 1,
  },
  imageModalPage: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalImage: {
    width: width,
    height: height,
  },
});

export default ProductDetailScreen; 