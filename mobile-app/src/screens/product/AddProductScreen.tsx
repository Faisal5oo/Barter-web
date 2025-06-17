import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Card, 
  Button, 
  TextInput, 
  Switch, 
  Chip,
  ProgressBar,
  SegmentedButtons,
  ActivityIndicator,
  Menu,
  Divider
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { theme, spacing, typography } from '../../theme';
import { RootState } from '../../store';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  'Electronics',
  'Furniture', 
  'Clothing',
  'Gaming',
  'Sports',
  'Vehicles',
  'Food & Grocery',
  'Free Stuff'
] as const;

const FOOD_TYPES = [
  { value: 'fresh', label: 'Fresh' },
  { value: 'packaged', label: 'Packaged' },
  { value: 'cooked', label: 'Cooked' },
  { value: 'other', label: 'Other' }
] as const;

const STEPS = [
  { id: 'basic', title: 'Basic Info', icon: 'information-circle' },
  { id: 'condition', title: 'Details', icon: 'settings' },
  { id: 'exchange', title: 'Exchange', icon: 'swap-horizontal' },
  { id: 'shipping', title: 'Shipping', icon: 'location' },
];

const AddProductScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Food-specific fields
  const [foodType, setFoodType] = useState('');
  const [dietaryInfo, setDietaryInfo] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    containsNuts: false,
    halal: false,
    kosher: false
  });

  // Condition fields
  const [condition, setCondition] = useState('');
  const [age, setAge] = useState('');
  const [warranty, setWarranty] = useState('');
  const [boxAccessories, setBoxAccessories] = useState('');
  const [screenCondition, setScreenCondition] = useState('');
  const [bodyCondition, setBodyCondition] = useState('');

  // Exchange preferences
  const [preferredItems, setPreferredItems] = useState<string[]>([]);
  const [newPreferredItem, setNewPreferredItem] = useState('');
  const [notInterestedIn, setNotInterestedIn] = useState<string[]>([]);
  const [newNotInterestedItem, setNewNotInterestedItem] = useState('');
  const [cashOption, setCashOption] = useState(false);
  const [exchangeNotes, setExchangeNotes] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [price, setPrice] = useState('');

  // Location & shipping
  const [location, setLocation] = useState('');
  const [inPerson, setInPerson] = useState(true);
  const [withinMiles, setWithinMiles] = useState('10');
  const [canShip, setCanShip] = useState(false);
  const [buyerPaysShipping, setBuyerPaysShipping] = useState(true);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [newPreferredLocation, setNewPreferredLocation] = useState('');

  // UI state
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [foodTypeMenuVisible, setFoodTypeMenuVisible] = useState(false);

  const isFoodCategory = category === 'Food & Grocery';
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      Alert.alert(
        'Success!',
        'Your product has been listed successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.message || 'Failed to create product. Please try again.'
      );
    },
  });

  const handleImagePicker = async () => {
    if (images.length >= 10) {
      Alert.alert('Limit Reached', 'You can upload maximum 10 images.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const handleCameraCapture = async () => {
    if (images.length >= 10) {
      Alert.alert('Limit Reached', 'You can upload maximum 10 images.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addPreferredItem = () => {
    if (newPreferredItem.trim() && !preferredItems.includes(newPreferredItem.trim())) {
      setPreferredItems(prev => [...prev, newPreferredItem.trim()]);
      setNewPreferredItem('');
    }
  };

  const addNotInterestedItem = () => {
    if (newNotInterestedItem.trim() && !notInterestedIn.includes(newNotInterestedItem.trim())) {
      setNotInterestedIn(prev => [...prev, newNotInterestedItem.trim()]);
      setNewNotInterestedItem('');
    }
  };

  const addPreferredLocation = () => {
    if (newPreferredLocation.trim() && !preferredLocations.includes(newPreferredLocation.trim())) {
      setPreferredLocations(prev => [...prev, newPreferredLocation.trim()]);
      setNewPreferredLocation('');
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCategoryMenuVisible(false);
    
    if (newCategory === 'Food & Grocery') {
      setCondition('');
      setAge('');
      setWarranty('');
      setBoxAccessories('');
      if (!foodType) setFoodType('fresh');
    } else {
      setFoodType('');
      setDietaryInfo({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        containsNuts: false,
        halal: false,
        kosher: false
      });
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your product.');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter your location.');
      return;
    }
    if (isFoodCategory && !foodType) {
      Alert.alert('Error', 'Please select a food type.');
      return;
    }

    const productData: any = {
      title: title.trim(),
      description: description.trim(),
      category: isFoodCategory ? 'food' : category,
      images,
      location: location.trim(),
      latitude: 0, // Would be set by location service
      longitude: 0, // Would be set by location service
      shippingOptions: {
        inPerson,
        withinMiles: parseInt(withinMiles) || 10,
        canShip,
        buyerPaysShipping,
        preferredLocations,
      },
      exchangePreferences: {
        preferredItems,
        notInterestedIn,
        cashOption: isFree ? false : cashOption,
        estimatedValue: isFree ? 0 : (price ? parseFloat(price) : 0),
        price: isFree ? 0 : (price ? parseFloat(price) : undefined),
        minPrice: isFree ? 0 : (minPrice ? parseFloat(minPrice) : undefined),
        maxPrice: isFree ? 0 : (maxPrice ? parseFloat(maxPrice) : undefined),
        notes: exchangeNotes.trim(),
      },
      isFree,
    };

    if (isFoodCategory) {
      productData.foodType = foodType;
      productData.dietaryInfo = dietaryInfo;
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);
      productData.expiryDate = expiryDate.toISOString();
    } else {
      productData.condition = condition.trim();
      productData.age = age.trim();
      productData.warranty = warranty.trim();
      productData.boxAccessories = boxAccessories.trim();
      productData.screenCondition = screenCondition.trim();
      productData.bodyCondition = bodyCondition.trim();
    }

    createProductMutation.mutate(productData);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return title.trim() && category && location.trim();
      case 1: // Condition/Details
        return isFoodCategory ? foodType : true;
      case 2: // Exchange
        return true;
      case 3: // Shipping
        return true;
      default:
        return false;
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#0ea5e9', '#1e40af']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>List New Item</Text>
          <Text style={styles.headerSubtitle}>
            {isFree ? 'Creating free listing' : 'Create your listing'}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress / 100} color="#f59e0b" style={styles.progressBar} />
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {STEPS.length} • {Math.round(progress)}% Complete
        </Text>
      </View>
    </LinearGradient>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <View key={step.id} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            index <= currentStep && styles.stepCircleActive,
            index === currentStep && styles.stepCircleCurrent
          ]}>
            <Ionicons 
              name={step.icon as any} 
              size={16} 
              color={index <= currentStep ? '#fff' : theme.colors.outline} 
            />
          </View>
          <Text style={[
            styles.stepText,
            index <= currentStep && styles.stepTextActive
          ]}>
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Title *</Text>
        <TextInput
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          placeholder={isFoodCategory ? "e.g., Fresh Homemade Pizza" : "Enter a descriptive title"}
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          placeholder={isFoodCategory ? "Describe your food item, ingredients..." : "Describe your item in detail"}
          multiline
          numberOfLines={4}
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Category *</Text>
        <Menu
          visible={categoryMenuVisible}
          onDismiss={() => setCategoryMenuVisible(false)}
          anchor={
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setCategoryMenuVisible(true)}
            >
              <Text style={[styles.menuButtonText, !category && styles.placeholder]}>
                {category || 'Select a category'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={theme.colors.onSurface} />
            </TouchableOpacity>
          }
        >
          {CATEGORIES.map((cat) => (
            <Menu.Item
              key={cat}
              onPress={() => handleCategoryChange(cat)}
              title={cat}
            />
          ))}
        </Menu>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location *</Text>
        <TextInput
          mode="outlined"
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your city or area"
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Images ({images.length}/10)</Text>
        <View style={styles.imageSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageItem}>
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {images.length < 10 && (
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.imageActionButton}
                    onPress={handleImagePicker}
                  >
                    <Ionicons name="images" size={24} color={theme.colors.primary} />
                    <Text style={styles.imageActionText}>Gallery</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.imageActionButton}
                    onPress={handleCameraCapture}
                  >
                    <Ionicons name="camera" size={24} color={theme.colors.primary} />
                    <Text style={styles.imageActionText}>Camera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );

  const renderConditionDetails = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        {isFoodCategory ? 'Food Details' : 'Condition & Details'}
      </Text>
      
      {isFoodCategory ? (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Food Type *</Text>
            <Menu
              visible={foodTypeMenuVisible}
              onDismiss={() => setFoodTypeMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setFoodTypeMenuVisible(true)}
                >
                  <Text style={[styles.menuButtonText, !foodType && styles.placeholder]}>
                    {FOOD_TYPES.find(t => t.value === foodType)?.label || 'Select food type'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={theme.colors.onSurface} />
                </TouchableOpacity>
              }
            >
              {FOOD_TYPES.map((type) => (
                <Menu.Item
                  key={type.value}
                  onPress={() => {
                    setFoodType(type.value);
                    setFoodTypeMenuVisible(false);
                  }}
                  title={type.label}
                />
              ))}
            </Menu>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dietary Information</Text>
            <View style={styles.dietaryGrid}>
              {Object.entries(dietaryInfo).map(([key, value]) => (
                <View key={key} style={styles.dietaryItem}>
                  <Text style={styles.dietaryLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={(newValue) => 
                      setDietaryInfo(prev => ({ ...prev, [key]: newValue }))
                    }
                  />
                </View>
              ))}
            </View>
          </View>

          <Card style={styles.warningCard}>
            <View style={styles.warningContent}>
              <Ionicons name="warning" size={20} color="#f59e0b" />
              <View style={styles.warningText}>
                <Text style={styles.warningTitle}>Food Safety Notice</Text>
                <Text style={styles.warningDescription}>
                  • Ensure food is prepared in hygienic conditions{'\n'}
                  • Food listings expire automatically after 24 hours{'\n'}
                  • Exchange should happen as soon as possible for freshness
                </Text>
              </View>
            </View>
          </Card>
        </>
      ) : (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Condition</Text>
            <TextInput
              mode="outlined"
              value={condition}
              onChangeText={setCondition}
              placeholder="e.g., Like New, Good, Fair"
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              mode="outlined"
              value={age}
              onChangeText={setAge}
              placeholder="e.g., 2 years old"
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Warranty</Text>
            <TextInput
              mode="outlined"
              value={warranty}
              onChangeText={setWarranty}
              placeholder="e.g., 1 year manufacturer warranty"
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Box & Accessories</Text>
            <TextInput
              mode="outlined"
              value={boxAccessories}
              onChangeText={setBoxAccessories}
              placeholder="e.g., Original box, charger, manual"
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Screen Condition</Text>
            <TextInput
              mode="outlined"
              value={screenCondition}
              onChangeText={setScreenCondition}
              placeholder="e.g., No scratches, minor wear"
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Body Condition</Text>
            <TextInput
              mode="outlined"
              value={bodyCondition}
              onChangeText={setBodyCondition}
              placeholder="e.g., Minor scratches, dents"
              style={styles.textInput}
            />
          </View>
        </>
      )}
    </View>
  );

  const renderExchangePreferences = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Exchange Preferences</Text>
      
      <Card style={[styles.freeOptionCard, { backgroundColor: isFree ? '#dcfce7' : theme.colors.surface }]}>
        <View style={styles.freeOptionContent}>
          <View style={styles.freeOptionText}>
            <Text style={styles.freeOptionTitle}>List as Free Item</Text>
            <Text style={styles.freeOptionDescription}>
              Mark this item as free for others to claim
            </Text>
          </View>
          <Switch
            value={isFree}
            onValueChange={setIsFree}
          />
        </View>
      </Card>

      {!isFree && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Items</Text>
            <View style={styles.addItemContainer}>
              <TextInput
                mode="outlined"
                value={newPreferredItem}
                onChangeText={setNewPreferredItem}
                placeholder={isFoodCategory ? "e.g., Other food items, Kitchen appliances" : "Add preferred item"}
                style={[styles.textInput, styles.addItemInput]}
              />
              <Button
                mode="contained"
                onPress={addPreferredItem}
                style={styles.addButton}
                compact
              >
                Add
              </Button>
            </View>
            <View style={styles.chipContainer}>
              {preferredItems.map((item, index) => (
                <Chip
                  key={index}
                  onClose={() => setPreferredItems(prev => prev.filter((_, i) => i !== index))}
                  style={styles.chip}
                >
                  {item}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Not Interested In</Text>
            <View style={styles.addItemContainer}>
              <TextInput
                mode="outlined"
                value={newNotInterestedItem}
                onChangeText={setNewNotInterestedItem}
                placeholder={isFoodCategory ? "e.g., Electronics, Clothing" : "Add item you're not interested in"}
                style={[styles.textInput, styles.addItemInput]}
              />
              <Button
                mode="contained"
                onPress={addNotInterestedItem}
                style={styles.addButton}
                compact
              >
                Add
              </Button>
            </View>
            <View style={styles.chipContainer}>
              {notInterestedIn.map((item, index) => (
                <Chip
                  key={index}
                  onClose={() => setNotInterestedIn(prev => prev.filter((_, i) => i !== index))}
                  style={styles.chip}
                >
                  {item}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.switchGroup}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Accept Cash Offers</Text>
              <Switch
                value={cashOption}
                onValueChange={setCashOption}
              />
            </View>
          </View>

          {cashOption && (
            <Card style={styles.pricingCard}>
              <Text style={styles.pricingTitle}>Pricing Information</Text>
              
              <View style={styles.priceRow}>
                <View style={styles.priceInput}>
                  <Text style={styles.priceLabel}>Min Price (PKR)</Text>
                  <TextInput
                    mode="outlined"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholder="0"
                    keyboardType="numeric"
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.priceInput}>
                  <Text style={styles.priceLabel}>Max Price (PKR)</Text>
                  <TextInput
                    mode="outlined"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    placeholder="0"
                    keyboardType="numeric"
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fixed Price (PKR)</Text>
                <TextInput
                  mode="outlined"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Leave empty for negotiable pricing"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </View>
            </Card>
          )}
        </>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          {isFree ? 'Additional Notes' : 'Exchange Notes'}
        </Text>
        <TextInput
          mode="outlined"
          value={exchangeNotes}
          onChangeText={setExchangeNotes}
          placeholder={
            isFree 
              ? "e.g., First come first served, pickup instructions..."
              : isFoodCategory 
                ? "e.g., Looking for healthy food exchanges..."
                : "Any additional notes about exchange preferences"
          }
          multiline
          numberOfLines={3}
          style={styles.textInput}
        />
      </View>
    </View>
  );

  const renderShippingOptions = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Shipping & Location</Text>
      
      {isFoodCategory && (
        <Card style={styles.warningCard}>
          <View style={styles.warningContent}>
            <Ionicons name="restaurant" size={20} color="#f59e0b" />
            <View style={styles.warningText}>
              <Text style={styles.warningTitle}>Food Delivery Considerations</Text>
              <Text style={styles.warningDescription}>
                • In-person pickup is recommended for food safety{'\n'}
                • Keep delivery distance short to maintain freshness{'\n'}
                • Consider temperature-sensitive items
              </Text>
            </View>
          </View>
        </Card>
      )}

      <View style={styles.switchGroup}>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>In-Person Exchange</Text>
          <Switch
            value={inPerson}
            onValueChange={setInPerson}
          />
        </View>
      </View>

      {inPerson && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Within Miles</Text>
          <TextInput
            mode="outlined"
            value={withinMiles}
            onChangeText={setWithinMiles}
            placeholder="10"
            keyboardType="numeric"
            style={styles.textInput}
          />
          {isFoodCategory && (
            <Text style={styles.helperText}>
              Recommended: Keep within 25 miles for food freshness
            </Text>
          )}
        </View>
      )}

      <View style={styles.switchGroup}>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Can Ship</Text>
          <Switch
            value={canShip}
            onValueChange={setCanShip}
          />
        </View>
      </View>

      {canShip && (
        <>
          {isFoodCategory && (
            <Card style={styles.warningCard}>
              <View style={styles.warningContent}>
                <Ionicons name="warning" size={20} color="#f59e0b" />
                <Text style={styles.warningDescription}>
                  Shipping food items requires proper packaging and may affect freshness. Consider local pickup instead.
                </Text>
              </View>
            </Card>
          )}
          
          <View style={styles.switchGroup}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Buyer Pays Shipping</Text>
              <Switch
                value={buyerPaysShipping}
                onValueChange={setBuyerPaysShipping}
              />
            </View>
          </View>
        </>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Preferred Meet-up Locations</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            mode="outlined"
            value={newPreferredLocation}
            onChangeText={setNewPreferredLocation}
            placeholder={isFoodCategory ? "e.g., Central Park, Coffee shops" : "Add preferred location"}
            style={[styles.textInput, styles.addItemInput]}
          />
          <Button
            mode="contained"
            onPress={addPreferredLocation}
            style={styles.addButton}
            compact
          >
            Add
          </Button>
        </View>
        <View style={styles.chipContainer}>
          {preferredLocations.map((location, index) => (
            <Chip
              key={index}
              onClose={() => setPreferredLocations(prev => prev.filter((_, i) => i !== index))}
              style={styles.chip}
            >
              {location}
            </Chip>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderConditionDetails();
      case 2:
        return renderExchangePreferences();
      case 3:
        return renderShippingOptions();
      default:
        return null;
    }
  };

  const renderNavigationButtons = () => (
    <View style={styles.navigationButtons}>
      {currentStep > 0 && (
        <Button
          mode="outlined"
          onPress={() => setCurrentStep(prev => prev - 1)}
          style={styles.navButton}
        >
          Previous
        </Button>
      )}
      
      {currentStep < STEPS.length - 1 ? (
        <Button
          mode="contained"
          onPress={() => setCurrentStep(prev => prev + 1)}
          disabled={!canProceedToNext()}
          style={[styles.navButton, styles.nextButton]}
        >
          Next
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!canProceedToNext() || createProductMutation.isPending}
          style={[styles.navButton, styles.submitButton]}
        >
          {createProductMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            isFree ? 'List Free Item' : 'List Item'
          )}
        </Button>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderHeader()}
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderStepIndicator()}
          {renderStepContent()}
        </ScrollView>
        
        {renderNavigationButtons()}
      </KeyboardAvoidingView>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: '#fff',
    fontWeight: '600',
  },
  headerSubtitle: {
    ...typography.body,
    color: '#fff',
    opacity: 0.9,
  },
  progressContainer: {
    gap: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressText: {
    ...typography.caption,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },

  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: '#0ea5e9',
  },
  stepCircleCurrent: {
    backgroundColor: '#f59e0b',
  },
  stepText: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
  },
  stepTextActive: {
    color: theme.colors.onSurface,
    opacity: 1,
    fontWeight: '600',
  },

  // Step Content
  stepContent: {
    padding: spacing.lg,
  },
  stepTitle: {
    ...typography.h2,
    color: theme.colors.onSurface,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
  },
  menuButtonText: {
    ...typography.body,
    color: theme.colors.onSurface,
  },
  placeholder: {
    color: theme.colors.onSurface,
    opacity: 0.6,
  },

  // Image Section
  imageSection: {
    marginTop: spacing.sm,
  },
  imageContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
  },
  imageActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageActionButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary + '10',
  },
  imageActionText: {
    ...typography.caption,
    color: theme.colors.primary,
    marginTop: spacing.xs,
  },

  // Dietary Info
  dietaryGrid: {
    gap: spacing.sm,
  },
  dietaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dietaryLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
  },

  // Cards
  warningCard: {
    backgroundColor: '#fef3c7',
    marginBottom: spacing.lg,
  },
  warningContent: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  warningText: {
    flex: 1,
  },
  warningTitle: {
    ...typography.body,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: spacing.xs,
  },
  warningDescription: {
    ...typography.caption,
    color: '#92400e',
    lineHeight: 18,
  },

  freeOptionCard: {
    marginBottom: spacing.lg,
  },
  freeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  freeOptionText: {
    flex: 1,
  },
  freeOptionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  freeOptionDescription: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },

  pricingCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: theme.colors.surfaceVariant,
  },
  pricingTitle: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    ...typography.caption,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },

  // Add Items
  addItemContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  addItemInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    alignSelf: 'flex-end',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.primary + '20',
  },

  // Switches
  switchGroup: {
    marginBottom: spacing.lg,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },

  helperText: {
    ...typography.caption,
    color: '#f59e0b',
    marginTop: spacing.xs,
  },

  // Navigation
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#0ea5e9',
  },
  submitButton: {
    backgroundColor: '#f59e0b',
  },
});

export default AddProductScreen; 