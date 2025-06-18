import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  Button,
  Card,
  Switch,
  HelperText,
  Menu,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useQuery } from '@tanstack/react-query';
import { theme, spacing, typography } from '../../theme';
import { productService } from '../../services/productService';

const EditProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params as { productId: string };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: '',
    images: [] as string[],
    exchangePreferences: {
      barter: true,
      cash: false,
      cashOption: false,
      estimatedValue: '',
      minPrice: '',
      maxPrice: '',
      price: '',
    },
    isFree: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showConditionMenu, setShowConditionMenu] = useState(false);

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category,
        condition: product.condition,
        location: product.location,
        images: product.images,
        exchangePreferences: {
          barter: product.exchangePreferences.barter,
          cash: product.exchangePreferences.cash,
          cashOption: product.exchangePreferences.cashOption,
          estimatedValue: product.exchangePreferences.estimatedValue?.toString() || '',
          minPrice: product.exchangePreferences.minPrice?.toString() || '',
          maxPrice: product.exchangePreferences.maxPrice?.toString() || '',
          price: product.exchangePreferences.price?.toString() || '',
        },
        isFree: product.isFree || false,
      });
    }
  }, [product]);

  const categories = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Gaming',
    'Sports',
    'Vehicles',
    'Books',
    'Home & Garden',
    'Toys',
    'Other',
  ];

  const conditions = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    if (!formData.isFree && !formData.exchangePreferences.barter && !formData.exchangePreferences.cash) {
      newErrors.exchange = 'Select at least one exchange option';
    }

    if (formData.exchangePreferences.cash && formData.exchangePreferences.price && 
        isNaN(Number(formData.exchangePreferences.price))) {
      newErrors.price = 'Price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = async () => {
    if (formData.images.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 images');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to add images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        ...formData,
        exchangePreferences: {
          ...formData.exchangePreferences,
          estimatedValue: formData.exchangePreferences.estimatedValue ? 
            Number(formData.exchangePreferences.estimatedValue) : undefined,
          minPrice: formData.exchangePreferences.minPrice ? 
            Number(formData.exchangePreferences.minPrice) : undefined,
          maxPrice: formData.exchangePreferences.maxPrice ? 
            Number(formData.exchangePreferences.maxPrice) : undefined,
          price: formData.exchangePreferences.price ? 
            Number(formData.exchangePreferences.price) : undefined,
        },
      };

      await productService.updateProduct(productId, productData);
      
      Alert.alert(
        'Success!',
        'Your item has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update listing');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Edit Your Item</Text>
              <Text style={styles.subtitle}>
                Update your listing details
              </Text>
            </View>

            {/* Images Section */}
            <Card style={styles.section}>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Photos</Text>
                <Text style={styles.sectionDescription}>
                  Add up to 5 photos. The first photo will be your main image.
                </Text>

                <View style={styles.imagesContainer}>
                  {formData.images.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image source={{ uri: image }} style={styles.productImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                      </TouchableOpacity>
                      {index === 0 && (
                        <View style={styles.mainImageBadge}>
                          <Text style={styles.mainImageText}>Main</Text>
                        </View>
                      )}
                    </View>
                  ))}

                  {formData.images.length < 5 && (
                    <TouchableOpacity style={styles.addImageButton} onPress={handleImagePicker}>
                      <Ionicons name="add" size={32} color={theme.colors.primary} />
                      <Text style={styles.addImageText}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {errors.images && (
                  <HelperText type="error" visible={true}>
                    {errors.images}
                  </HelperText>
                )}
              </View>
            </Card>

            {/* Basic Info */}
            <Card style={styles.section}>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Basic Information</Text>

                <TextInput
                  label="Title"
                  value={formData.title}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.title}
                />
                {errors.title && (
                  <HelperText type="error" visible={true}>
                    {errors.title}
                  </HelperText>
                )}

                <TextInput
                  label="Description"
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={styles.input}
                  error={!!errors.description}
                />
                {errors.description && (
                  <HelperText type="error" visible={true}>
                    {errors.description}
                  </HelperText>
                )}

                <Menu
                  visible={showCategoryMenu}
                  onDismiss={() => setShowCategoryMenu(false)}
                  anchor={
                    <TextInput
                      label="Category"
                      value={formData.category}
                      mode="outlined"
                      style={styles.input}
                      editable={false}
                      right={<TextInput.Icon icon="chevron-down" onPress={() => setShowCategoryMenu(true)} />}
                      onPressIn={() => setShowCategoryMenu(true)}
                      error={!!errors.category}
                    />
                  }
                >
                  {categories.map((category) => (
                    <Menu.Item
                      key={category}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, category }));
                        setShowCategoryMenu(false);
                      }}
                      title={category}
                    />
                  ))}
                </Menu>

                <Menu
                  visible={showConditionMenu}
                  onDismiss={() => setShowConditionMenu(false)}
                  anchor={
                    <TextInput
                      label="Condition"
                      value={formData.condition}
                      mode="outlined"
                      style={styles.input}
                      editable={false}
                      right={<TextInput.Icon icon="chevron-down" onPress={() => setShowConditionMenu(true)} />}
                      onPressIn={() => setShowConditionMenu(true)}
                      error={!!errors.condition}
                    />
                  }
                >
                  {conditions.map((condition) => (
                    <Menu.Item
                      key={condition}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, condition }));
                        setShowConditionMenu(false);
                      }}
                      title={condition}
                    />
                  ))}
                </Menu>

                <TextInput
                  label="Location"
                  value={formData.location}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.location}
                />
              </View>
            </Card>

            {/* Exchange Preferences */}
            <Card style={styles.section}>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Exchange Preferences</Text>

                <View style={styles.switchRow}>
                  <View style={styles.switchInfo}>
                    <Text style={styles.switchLabel}>Free Item</Text>
                    <Text style={styles.switchDescription}>
                      Give this item away for free
                    </Text>
                  </View>
                  <Switch
                    value={formData.isFree}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isFree: value }))}
                  />
                </View>

                {!formData.isFree && (
                  <>
                    <View style={styles.switchRow}>
                      <View style={styles.switchInfo}>
                        <Text style={styles.switchLabel}>Accept Barter</Text>
                        <Text style={styles.switchDescription}>
                          Trade for other items
                        </Text>
                      </View>
                      <Switch
                        value={formData.exchangePreferences.barter}
                        onValueChange={(value) => 
                          setFormData(prev => ({
                            ...prev,
                            exchangePreferences: { ...prev.exchangePreferences, barter: value }
                          }))
                        }
                      />
                    </View>

                    <View style={styles.switchRow}>
                      <View style={styles.switchInfo}>
                        <Text style={styles.switchLabel}>Accept Cash</Text>
                        <Text style={styles.switchDescription}>
                          Sell for money
                        </Text>
                      </View>
                      <Switch
                        value={formData.exchangePreferences.cash}
                        onValueChange={(value) => 
                          setFormData(prev => ({
                            ...prev,
                            exchangePreferences: { ...prev.exchangePreferences, cash: value }
                          }))
                        }
                      />
                    </View>

                    {formData.exchangePreferences.cash && (
                      <TextInput
                        label="Price (PKR)"
                        value={formData.exchangePreferences.price}
                        onChangeText={(text) => 
                          setFormData(prev => ({
                            ...prev,
                            exchangePreferences: { ...prev.exchangePreferences, price: text }
                          }))
                        }
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        error={!!errors.price}
                      />
                    )}

                    {formData.exchangePreferences.barter && (
                      <TextInput
                        label="Estimated Value (PKR) - Optional"
                        value={formData.exchangePreferences.estimatedValue}
                        onChangeText={(text) => 
                          setFormData(prev => ({
                            ...prev,
                            exchangePreferences: { ...prev.exchangePreferences, estimatedValue: text }
                          }))
                        }
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    )}
                  </>
                )}
              </View>
            </Card>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
              labelStyle={styles.submitButtonLabel}
            >
              Update Item
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  section: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing.lg,
  },
  sectionContent: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: spacing.md,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainImageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    ...typography.caption,
    color: theme.colors.primary,
    marginTop: spacing.xs,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.background,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  switchInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
  },
  submitButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProductScreen; 