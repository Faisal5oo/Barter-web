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
  Divider,
  useTheme,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { theme, spacing, typography } from '../../theme';
import { RootState } from '../../store';
import * as Location from 'expo-location';

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
  const paperTheme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  // Food-specific fields
  const [foodType, setFoodType] = useState('');
  const [foodTypeMenuVisible, setFoodTypeMenuVisible] = useState(false);
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
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [inPerson, setInPerson] = useState(true);
  const [withinMiles, setWithinMiles] = useState('10');
  const [canShip, setCanShip] = useState(false);
  const [buyerPaysShipping, setBuyerPaysShipping] = useState(true);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [newPreferredLocation, setNewPreferredLocation] = useState('');

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

  const handleSubmit = async () => {
    if (!title.trim() || !category || !location.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
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
      latitude,
      longitude,
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

  const renderHeader = () => (
    <LinearGradient
      colors={[paperTheme.colors.primary, paperTheme.colors.primaryContainer]}
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
        <ProgressBar progress={progress / 100} color={paperTheme.colors.secondary} style={styles.progressBar} />
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {STEPS.length} • {Math.round(progress)}% Complete
        </Text>
      </View>
    </LinearGradient>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <TouchableOpacity 
          key={step.id} 
          style={styles.stepItem}
          onPress={() => setCurrentStep(index)}
        >
          <View style={[
            styles.stepCircle,
            index <= currentStep && styles.stepCircleActive,
            index === currentStep && styles.stepCircleCurrent
          ]}>
            <Ionicons 
              name={step.icon as any} 
              size={16} 
              color={index <= currentStep ? '#fff' : paperTheme.colors.outline} 
            />
          </View>
          <Text style={[
            styles.stepText,
            index <= currentStep && styles.stepTextActive
          ]}>
            {step.title}
          </Text>
        </TouchableOpacity>
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
              <Ionicons name="chevron-down" size={20} color={paperTheme.colors.onSurface} />
            </TouchableOpacity>
          }
        >
          {CATEGORIES.map((cat) => (
            <Menu.Item
              key={cat}
              onPress={() => {
                setCategory(cat);
                setCategoryMenuVisible(false);
              }}
              title={cat}
            />
          ))}
        </Menu>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Images ({images.length}/10)</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollView}
        >
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={paperTheme.colors.error} />
                </TouchableOpacity>
                {index === 0 && (
                  <View style={styles.mainImageBadge}>
                    <Text style={styles.mainImageText}>Main</Text>
                  </View>
                )}
              </View>
            ))}
            
            {images.length < 10 && (
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.imageActionButton}
                  onPress={handleImagePicker}
                >
                  <Ionicons name="images" size={24} color={paperTheme.colors.primary} />
                  <Text style={styles.imageActionText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.imageActionButton}
                  onPress={handleCameraCapture}
                >
                  <Ionicons name="camera" size={24} color={paperTheme.colors.primary} />
                  <Text style={styles.imageActionText}>Camera</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
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
                    {foodType ? FOOD_TYPES.find(t => t.value === foodType)?.label : 'Select food type'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={paperTheme.colors.onSurface} />
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

          <View style={styles.dietarySection}>
            <Text style={styles.sectionSubtitle}>Dietary Information</Text>
            <View style={styles.dietaryGrid}>
              {Object.entries(dietaryInfo).map(([key, value]) => (
                <View key={key} style={styles.dietaryItem}>
                  <Text style={styles.dietaryLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
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
            <Card.Content>
              <View style={styles.warningHeader}>
                <Ionicons name="warning" size={24} color="#f59e0b" />
                <Text style={styles.warningTitle}>Food Safety Notice</Text>
              </View>
              <View style={styles.warningList}>
                <Text style={styles.warningItem}>• Ensure food is prepared in hygienic conditions</Text>
                <Text style={styles.warningItem}>• Food listings expire automatically after 24 hours</Text>
                <Text style={styles.warningItem}>• Exchange should happen as soon as possible for freshness</Text>
                <View style={styles.expiryNotice}>
                  <Text style={styles.expiryTitle}>Expiry Time:</Text>
                  <Text style={styles.expiryTime}>
                    {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}
                  </Text>
                </View>
              </View>
            </Card.Content>
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

      {/* Free Item Option */}
      <View style={styles.freeItemSection}>
        <Card style={styles.freeItemCard}>
          <Card.Content>
            <View style={styles.freeItemHeader}>
              <View>
                <Text style={styles.freeItemTitle}>List as Free Item</Text>
                <Text style={styles.freeItemSubtitle}>
                  Mark this item as free for others to claim
                </Text>
              </View>
              <Switch
                value={isFree}
                onValueChange={setIsFree}
              />
            </View>
          </Card.Content>
        </Card>

        {isFree && (
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <Ionicons name="gift" size={24} color={paperTheme.colors.primary} />
                <Text style={styles.infoTitle}>Free Item Guidelines</Text>
              </View>
              <View style={styles.infoList}>
                <Text style={styles.infoItem}>• First come, first served basis</Text>
                <Text style={styles.infoItem}>• Others will message you to claim the item</Text>
                <Text style={styles.infoItem}>• No bartering or cash exchange allowed</Text>
                <Text style={styles.infoItem}>• Please be respectful of pickup arrangements</Text>
              </View>
            </Card.Content>
          </Card>
        )}
      </View>

      {!isFree && (
        <>
          {/* Preferred Items */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Items</Text>
            <View style={styles.chipInput}>
              <TextInput
                mode="outlined"
                value={newPreferredItem}
                onChangeText={setNewPreferredItem}
                placeholder={isFoodCategory ? "e.g., Other food items, Kitchen appliances" : "Add preferred item"}
                style={[styles.textInput, styles.chipInputField]}
                right={
                  <TextInput.Icon
                    icon="plus"
                    onPress={() => {
                      if (newPreferredItem.trim()) {
                        setPreferredItems([...preferredItems, newPreferredItem.trim()]);
                        setNewPreferredItem('');
                      }
                    }}
                  />
                }
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsContainer}
            >
              {preferredItems.map((item, index) => (
                <Chip
                  key={index}
                  onClose={() => setPreferredItems(preferredItems.filter((_, i) => i !== index))}
                  style={styles.chip}
                >
                  {item}
                </Chip>
              ))}
            </ScrollView>
          </View>

          {/* Not Interested In */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Not Interested In</Text>
            <View style={styles.chipInput}>
              <TextInput
                mode="outlined"
                value={newNotInterestedItem}
                onChangeText={setNewNotInterestedItem}
                placeholder={isFoodCategory ? "e.g., Electronics, Clothing" : "Add item you're not interested in"}
                style={[styles.textInput, styles.chipInputField]}
                right={
                  <TextInput.Icon
                    icon="plus"
                    onPress={() => {
                      if (newNotInterestedItem.trim()) {
                        setNotInterestedIn([...notInterestedIn, newNotInterestedItem.trim()]);
                        setNewNotInterestedItem('');
                      }
                    }}
                  />
                }
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsContainer}
            >
              {notInterestedIn.map((item, index) => (
                <Chip
                  key={index}
                  onClose={() => setNotInterestedIn(notInterestedIn.filter((_, i) => i !== index))}
                  style={styles.chip}
                >
                  {item}
                </Chip>
              ))}
            </ScrollView>
          </View>

          {/* Cash Options */}
          <View style={styles.inputGroup}>
            <Card style={styles.cashOptionsCard}>
              <Card.Content>
                <View style={styles.cashOptionHeader}>
                  <View>
                    <Text style={styles.cashOptionTitle}>Accept Cash Offers</Text>
                    <Text style={styles.cashOptionSubtitle}>
                      Allow buyers to make cash offers
                    </Text>
                  </View>
                  <Switch
                    value={cashOption}
                    onValueChange={setCashOption}
                  />
                </View>

                {cashOption && (
                  <View style={styles.priceInputs}>
                    <View style={styles.priceInputRow}>
                      <View style={styles.priceInputHalf}>
                        <Text style={styles.inputLabel}>Minimum Price (PKR)</Text>
                        <TextInput
                          mode="outlined"
                          value={minPrice}
                          onChangeText={(value) => {
                            if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                              setMinPrice(value);
                            }
                          }}
                          keyboardType="decimal-pad"
                          placeholder="0"
                          style={styles.textInput}
                          left={<TextInput.Affix text="PKR" />}
                        />
                      </View>
                      <View style={styles.priceInputHalf}>
                        <Text style={styles.inputLabel}>Maximum Price (PKR)</Text>
                        <TextInput
                          mode="outlined"
                          value={maxPrice}
                          onChangeText={(value) => {
                            if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                              setMaxPrice(value);
                            }
                          }}
                          keyboardType="decimal-pad"
                          placeholder="0"
                          style={styles.textInput}
                          left={<TextInput.Affix text="PKR" />}
                        />
                      </View>
                    </View>

                    <View style={styles.fixedPriceInput}>
                      <Text style={styles.inputLabel}>Fixed Price (PKR) - Optional</Text>
                      <TextInput
                        mode="outlined"
                        value={price}
                        onChangeText={(value) => {
                          if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                            setPrice(value);
                          }
                        }}
                        keyboardType="decimal-pad"
                        placeholder="Leave empty for negotiable pricing"
                        style={styles.textInput}
                        left={<TextInput.Affix text="PKR" />}
                      />
                      <Text style={styles.helperText}>
                        If set, buyers will see this as your asking price
                      </Text>
                    </View>
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>

          {/* Exchange Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Exchange Notes</Text>
            <TextInput
              mode="outlined"
              value={exchangeNotes}
              onChangeText={setExchangeNotes}
              placeholder={isFoodCategory ? "e.g., Looking for healthy food exchanges, prefer organic items..." : "Any additional notes about exchange preferences"}
              multiline
              numberOfLines={3}
              style={styles.textInput}
            />
          </View>

          {isFoodCategory && (
            <Card style={styles.infoCard}>
              <Card.Content>
                <View style={styles.infoHeader}>
                  <Ionicons name="information-circle" size={24} color={paperTheme.colors.primary} />
                  <Text style={styles.infoTitle}>Food Exchange Tips</Text>
                </View>
                <View style={styles.infoList}>
                  <Text style={styles.infoItem}>• Consider equal portion sizes when exchanging</Text>
                  <Text style={styles.infoItem}>• Specify dietary preferences clearly</Text>
                  <Text style={styles.infoItem}>• Quick exchanges ensure freshness</Text>
                </View>
              </Card.Content>
            </Card>
          )}
        </>
      )}
    </View>
  );

  const renderShipping = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Location & Shipping</Text>

      {isFoodCategory && (
        <Card style={styles.warningCard}>
          <Card.Content>
            <View style={styles.warningHeader}>
              <Ionicons name="fast-food" size={24} color="#f59e0b" />
              <Text style={styles.warningTitle}>Food Delivery Considerations</Text>
            </View>
            <View style={styles.warningList}>
              <Text style={styles.warningItem}>• In-person pickup is recommended for food safety</Text>
              <Text style={styles.warningItem}>• Keep delivery distance short to maintain freshness</Text>
              <Text style={styles.warningItem}>• Consider temperature-sensitive items</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Location Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location *</Text>
        <TextInput
          mode="outlined"
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
          style={styles.textInput}
          right={
            <TextInput.Icon
              icon="map-marker"
              onPress={async () => {
                try {
                  const { status } = await Location.requestForegroundPermissionsAsync();
                  if (status !== 'granted') {
                    Alert.alert(
                      'Permission Required',
                      'Please grant location permissions to use this feature.'
                    );
                    return;
                  }

                  const currentLocation = await Location.getCurrentPositionAsync({});
                  setLatitude(currentLocation.coords.latitude);
                  setLongitude(currentLocation.coords.longitude);

                  // Get address from coordinates
                  const [address] = await Location.reverseGeocodeAsync({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                  });

                  if (address) {
                    const locationString = [
                      address.street,
                      address.district,
                      address.city,
                      address.region,
                    ]
                      .filter(Boolean)
                      .join(', ');
                    setLocation(locationString);
                  }
                } catch (error) {
                  Alert.alert(
                    'Error',
                    'Failed to get your location. Please enter it manually.'
                  );
                }
              }}
            />
          }
        />
      </View>

      {/* In-Person Exchange */}
      <View style={styles.inputGroup}>
        <Card style={styles.optionCard}>
          <Card.Content>
            <View style={styles.optionHeader}>
              <View>
                <Text style={styles.optionTitle}>In-Person Exchange</Text>
                <Text style={styles.optionSubtitle}>
                  Allow local pickup and meetups
                </Text>
              </View>
              <Switch
                value={inPerson}
                onValueChange={setInPerson}
              />
            </View>

            {inPerson && (
              <View style={styles.optionDetails}>
                <Text style={styles.inputLabel}>Within Miles</Text>
                <TextInput
                  mode="outlined"
                  value={withinMiles}
                  onChangeText={setWithinMiles}
                  keyboardType="numeric"
                  placeholder="Enter distance"
                  style={styles.textInput}
                  right={<TextInput.Affix text="miles" />}
                />
                {isFoodCategory && (
                  <Text style={styles.helperText}>
                    Recommended: Keep within 25 miles for food freshness
                  </Text>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      </View>

      {/* Shipping Option */}
      <View style={styles.inputGroup}>
        <Card style={styles.optionCard}>
          <Card.Content>
            <View style={styles.optionHeader}>
              <View>
                <Text style={styles.optionTitle}>Can Ship</Text>
                <Text style={styles.optionSubtitle}>
                  Allow shipping to other locations
                </Text>
              </View>
              <Switch
                value={canShip}
                onValueChange={setCanShip}
              />
            </View>

            {canShip && (
              <View style={styles.optionDetails}>
                <View style={styles.shippingOption}>
                  <Text style={styles.optionTitle}>Buyer Pays Shipping</Text>
                  <Switch
                    value={buyerPaysShipping}
                    onValueChange={setBuyerPaysShipping}
                  />
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {isFoodCategory && canShip && (
          <Card style={[styles.warningCard, styles.shippingWarning]}>
            <Card.Content>
              <Text style={styles.warningItem}>
                ⚠️ Shipping food items requires proper packaging and may affect freshness.
                Consider local pickup instead.
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>

      {/* Preferred Meetup Locations */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Preferred Meet-up Locations</Text>
        <View style={styles.chipInput}>
          <TextInput
            mode="outlined"
            value={newPreferredLocation}
            onChangeText={setNewPreferredLocation}
            placeholder={isFoodCategory ? "e.g., Central Park, Coffee shops" : "Add preferred location"}
            style={[styles.textInput, styles.chipInputField]}
            right={
              <TextInput.Icon
                icon="plus"
                onPress={() => {
                  if (newPreferredLocation.trim()) {
                    setPreferredLocations([...preferredLocations, newPreferredLocation.trim()]);
                    setNewPreferredLocation('');
                  }
                }}
              />
            }
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsContainer}
        >
          {preferredLocations.map((loc, index) => (
            <Chip
              key={index}
              onClose={() => setPreferredLocations(preferredLocations.filter((_, i) => i !== index))}
              style={styles.chip}
            >
              {loc}
            </Chip>
          ))}
        </ScrollView>
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
        return renderShipping();
      default:
        return null;
    }
  };

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
              style={[styles.navButton, styles.nextButton]}
            >
              Next
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={createProductMutation.isPending}
              disabled={createProductMutation.isPending}
              style={[styles.navButton, styles.submitButton]}
            >
              {isFree ? 'List Free Item' : 'List Item'}
            </Button>
          )}
        </View>
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
    backgroundColor: theme.colors.primary,
  },
  stepCircleCurrent: {
    backgroundColor: theme.colors.secondary,
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
  imageScrollView: {
    marginTop: spacing.sm,
  },
  imageContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
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
  imageActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageActionButton: {
    width: 100,
    height: 100,
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  navButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
  },
  dietarySection: {
    marginBottom: spacing.lg,
  },
  sectionSubtitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  dietaryGrid: {
    gap: spacing.md,
  },
  dietaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  dietaryLabel: {
    ...typography.body,
    color: theme.colors.onSurface,
  },
  warningCard: {
    backgroundColor: '#fff8e6',
    marginTop: spacing.lg,
    borderRadius: 12,
    overflow: 'hidden',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  warningTitle: {
    ...typography.h3,
    color: '#f59e0b',
    marginLeft: spacing.sm,
  },
  warningList: {
    gap: spacing.sm,
  },
  warningItem: {
    ...typography.body,
    color: '#92400e',
  },
  expiryNotice: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  expiryTitle: {
    ...typography.caption,
    color: '#92400e',
    fontWeight: 'bold',
  },
  expiryTime: {
    ...typography.body,
    color: '#92400e',
    marginTop: 2,
  },
  freeItemSection: {
    gap: spacing.md,
  },
  freeItemCard: {
    backgroundColor: theme.colors.primaryContainer,
  },
  freeItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freeItemTitle: {
    ...typography.h3,
    color: theme.colors.onPrimaryContainer,
  },
  freeItemSubtitle: {
    ...typography.body,
    color: theme.colors.onPrimaryContainer,
    opacity: 0.8,
  },
  infoCard: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoTitle: {
    ...typography.h3,
    color: theme.colors.onSurfaceVariant,
    marginLeft: spacing.sm,
  },
  infoList: {
    gap: spacing.sm,
  },
  infoItem: {
    ...typography.body,
    color: theme.colors.onSurfaceVariant,
  },
  chipInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chipInputField: {
    flex: 1,
  },
  chipsContainer: {
    marginTop: spacing.sm,
  },
  chip: {
    marginRight: spacing.xs,
  },
  cashOptionsCard: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  cashOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cashOptionTitle: {
    ...typography.h3,
    color: theme.colors.onSurfaceVariant,
  },
  cashOptionSubtitle: {
    ...typography.body,
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
  },
  priceInputs: {
    gap: spacing.md,
  },
  priceInputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priceInputHalf: {
    flex: 1,
  },
  fixedPriceInput: {
    marginTop: spacing.sm,
  },
  helperText: {
    ...typography.caption,
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  optionCard: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    ...typography.h3,
    color: theme.colors.onSurfaceVariant,
  },
  optionSubtitle: {
    ...typography.body,
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
  },
  optionDetails: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  shippingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  shippingWarning: {
    marginTop: spacing.sm,
    backgroundColor: '#fff8e6',
  },
});

export default AddProductScreen; 