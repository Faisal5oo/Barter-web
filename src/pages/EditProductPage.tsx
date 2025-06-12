import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import ProductLocation from '@/components/product-form/ProductLocation';
import ProductImageUpload from '@/components/upload/ProductImageUpload';

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

const EditProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: product, isLoading, error } = useProduct(productId);
  const updateProduct = useUpdateProduct();

  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
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

  // Condition & Details (not applicable for food)
  const [condition, setCondition] = useState('');
  const [age, setAge] = useState('');
  const [warranty, setWarranty] = useState('');
  const [boxAccessories, setBoxAccessories] = useState('');
  const [screenCondition, setScreenCondition] = useState('');
  const [bodyCondition, setBodyCondition] = useState('');

  // Exchange Preferences
  const [preferredItems, setPreferredItems] = useState<string[]>([]);
  const [newPreferredItem, setNewPreferredItem] = useState('');
  const [notInterestedIn, setNotInterestedIn] = useState<string[]>([]);
  const [newNotInterestedItem, setNewNotInterestedItem] = useState('');
  const [cashOption, setCashOption] = useState(false);
  const [exchangeNotes, setExchangeNotes] = useState('');
  
  // Pricing
  const [price, setPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Location & Shipping
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [inPerson, setInPerson] = useState(true);
  const [withinMiles, setWithinMiles] = useState(10);
  const [canShip, setCanShip] = useState(false);
  const [buyerPaysShipping, setBuyerPaysShipping] = useState(true);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [newPreferredLocation, setNewPreferredLocation] = useState('');

  // Progress tracking
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Check if current category is food
  const isFoodCategory = category === 'Food & Grocery' || category === 'food';

  // Populate form with existing product data
  useEffect(() => {
    if (product) {
      // Check authorization
      if (product.listedBy?._id !== user?.id && product.listedBy !== user?.id) {
        toast({
          title: 'Unauthorized',
          description: 'You can only edit your own listings',
          variant: 'destructive',
        });
        navigate('/my-listings');
        return;
      }

      // Basic info
      setTitle(product.title || '');
      setDescription(product.description || '');
      setCategory(product.category === 'food' ? 'Food & Grocery' : product.category || '');
      setImages(product.images || []);

      // Food-specific fields
      if (product.category === 'food') {
        setFoodType(product.foodType || '');
        setDietaryInfo(product.dietaryInfo || {
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          containsNuts: false,
          halal: false,
          kosher: false
        });
      }

      // Condition & Details
      setCondition(product.condition || '');
      setAge(product.age || '');
      setWarranty(product.warranty || '');
      setBoxAccessories(product.boxAccessories || '');
      setScreenCondition(product.screenCondition || '');
      setBodyCondition(product.bodyCondition || '');

      // Exchange Preferences
      const exchangePrefs = product.exchangePreferences || {};
      setPreferredItems(exchangePrefs.preferredItems || []);
      setNotInterestedIn(exchangePrefs.notInterestedIn || []);
      setCashOption(exchangePrefs.cashOption || false);
      setExchangeNotes(exchangePrefs.notes || '');

      // Pricing
      setPrice(exchangePrefs.price ? exchangePrefs.price.toString() : '');
      setMinPrice(exchangePrefs.minPrice ? exchangePrefs.minPrice.toString() : '');
      setMaxPrice(exchangePrefs.maxPrice ? exchangePrefs.maxPrice.toString() : '');

      // Location & Shipping
      setLocation(product.location || '');
      setLatitude(product.latitude || null);
      setLongitude(product.longitude || null);
      
      const shippingOpts = product.shippingOptions || {};
      setInPerson(shippingOpts.inPerson !== false);
      setWithinMiles(shippingOpts.withinMiles || 10);
      setCanShip(shippingOpts.canShip || false);
      setBuyerPaysShipping(shippingOpts.buyerPaysShipping !== false);
      setPreferredLocations(shippingOpts.preferredLocations || []);
    }
  }, [product, user, navigate, toast]);

  const handleAddPreferredItem = () => {
    if (newPreferredItem && !preferredItems.includes(newPreferredItem)) {
      setPreferredItems([...preferredItems, newPreferredItem]);
      setNewPreferredItem('');
    }
  };

  const handleAddNotInterestedItem = () => {
    if (newNotInterestedItem && !notInterestedIn.includes(newNotInterestedItem)) {
      setNotInterestedIn([...notInterestedIn, newNotInterestedItem]);
      setNewNotInterestedItem('');
    }
  };

  const handleAddPreferredLocation = () => {
    if (newPreferredLocation && !preferredLocations.includes(newPreferredLocation)) {
      setPreferredLocations([...preferredLocations, newPreferredLocation]);
      setNewPreferredLocation('');
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    
    // Reset form fields when switching to/from food category
    if (newCategory === 'Food & Grocery') {
      // Reset non-food fields
      setCondition('');
      setAge('');
      setWarranty('');
      setBoxAccessories('');
      setScreenCondition('');
      setBodyCondition('');
      // Set food-specific defaults
      if (!foodType) setFoodType('fresh');
    } else {
      // Reset food-specific fields
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

  const handleDietaryInfoChange = (key: keyof typeof dietaryInfo, value: boolean) => {
    setDietaryInfo(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !location) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (latitude === null || longitude === null) {
      toast({
        title: 'Location Required',
        description: 'Please provide location coordinates by using "Current Location" or entering them manually',
        variant: 'destructive',
      });
      return;
    }

    // Food-specific validation
    if (isFoodCategory && !foodType) {
      toast({
        title: 'Food Type Required',
        description: 'Please select a food type for food listings',
        variant: 'destructive',
      });
      return;
    }

    let productData: any = {
      title,
      description,
      category: isFoodCategory ? 'food' : category,
      images,
      location,
      latitude,
      longitude,
      shippingOptions: {
        inPerson,
        withinMiles,
        canShip,
        buyerPaysShipping,
        preferredLocations,
      },
      exchangePreferences: {
        preferredItems,
        notInterestedIn,
        cashOption,
        estimatedValue: price ? parseFloat(price) : 0,
        price: price ? parseFloat(price) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        notes: exchangeNotes,
      },
    };

    if (isFoodCategory) {
      // Add food-specific fields
      productData.foodType = foodType;
      productData.dietaryInfo = dietaryInfo;
      
      // Keep existing expiry date for food products (don't update it)
      if (product?.expiryDate) {
        productData.expiryDate = product.expiryDate;
      }
    } else {
      // Add regular product fields
      productData.specs = {};
      productData.condition = condition;
      productData.age = age;
      productData.warranty = warranty;
      productData.boxAccessories = boxAccessories;
      productData.screenCondition = screenCondition;
      productData.bodyCondition = bodyCondition;
    }

    try {
      await updateProduct.mutateAsync({ productId, productData });
      // Success handling is done in the hook
    } catch (error) {
      // Enhanced error handling
      console.error('Product update error:', error);
      
      let errorMessage = 'Failed to update product. Please try again.';
      
      if (error?.message?.includes('validation failed')) {
        if (isFoodCategory) {
          errorMessage = 'Food listing validation failed. Please check all required fields and try again.';
        } else {
          errorMessage = 'Product validation failed. Please check all required fields and try again.';
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: isFoodCategory ? 'Food Listing Update Error' : 'Product Update Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading product details...</span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive mb-2">Product Not Found</h2>
                <p className="text-muted-foreground mb-4">The product you're trying to edit doesn't exist or has been removed.</p>
                <Button onClick={() => navigate('/my-listings')}>Back to My Listings</Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate('/my-listings')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Edit Your Listing</h1>
            <p className="text-muted-foreground mt-2">
              Update your listing details to keep it current and attractive
              {isFoodCategory && product?.expiryDate && (
                <span className="block text-amber-600 font-medium mt-1">
                  ⏰ This food listing expires at {new Date(product.expiryDate).toLocaleString()}
                </span>
              )}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Update Your Listing</CardTitle>
              <CardDescription>
                Make changes to your listing details. Fields marked with * are required.
                {isFoodCategory && (
                  <span className="block text-amber-600 mt-1">
                    Food listings cannot have their expiry date extended.
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <Tabs 
                  defaultValue="basic" 
                  className="w-full"
                  onValueChange={(value) => {
                    switch(value) {
                      case 'basic': setCurrentStep(1); break;
                      case 'condition': setCurrentStep(2); break;
                      case 'exchange': setCurrentStep(3); break;
                      case 'shipping': setCurrentStep(4); break;
                    }
                  }}
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="condition">
                      {isFoodCategory ? 'Food Details' : 'Condition'}
                    </TabsTrigger>
                    <TabsTrigger value="exchange">Exchange</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={isFoodCategory ? "e.g., Fresh Homemade Pizza" : "Enter a descriptive title"}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={isFoodCategory ? "Describe your food item, ingredients, preparation method..." : "Describe your item in detail"}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={handleCategoryChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <ProductImageUpload
                      imageUrls={images}
                      onImagesChange={setImages}
                      maxImages={10}
                    />
                  </TabsContent>

                  <TabsContent value="condition" className="space-y-6">
                    {isFoodCategory ? (
                      // Food-specific fields (same as AddProductPage)
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="foodType">Food Type *</Label>
                          <Select value={foodType} onValueChange={setFoodType} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select food type" />
                            </SelectTrigger>
                            <SelectContent>
                              {FOOD_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-base font-medium">Dietary Information</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="vegetarian" className="text-sm">Vegetarian</Label>
                              <Switch
                                id="vegetarian"
                                checked={dietaryInfo.vegetarian}
                                onCheckedChange={(value) => handleDietaryInfoChange('vegetarian', value)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="vegan" className="text-sm">Vegan</Label>
                              <Switch
                                id="vegan"
                                checked={dietaryInfo.vegan}
                                onCheckedChange={(value) => handleDietaryInfoChange('vegan', value)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="glutenFree" className="text-sm">Gluten Free</Label>
                              <Switch
                                id="glutenFree"
                                checked={dietaryInfo.glutenFree}
                                onCheckedChange={(value) => handleDietaryInfoChange('glutenFree', value)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="containsNuts" className="text-sm">Contains Nuts</Label>
                              <Switch
                                id="containsNuts"
                                checked={dietaryInfo.containsNuts}
                                onCheckedChange={(value) => handleDietaryInfoChange('containsNuts', value)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="halal" className="text-sm">Halal</Label>
                              <Switch
                                id="halal"
                                checked={dietaryInfo.halal}
                                onCheckedChange={(value) => handleDietaryInfoChange('halal', value)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="kosher" className="text-sm">Kosher</Label>
                              <Switch
                                id="kosher"
                                checked={dietaryInfo.kosher}
                                onCheckedChange={(value) => handleDietaryInfoChange('kosher', value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <div className="text-amber-600 mt-0.5">⚠️</div>
                            <div className="text-sm text-amber-700">
                              <p className="font-medium">Food Safety Notice:</p>
                              <ul className="mt-1 space-y-1">
                                <li>• Ensure food is prepared in hygienic conditions</li>
                                <li>• Food listings expire automatically after 24 hours</li>
                                <li>• Exchange should happen as soon as possible for freshness</li>
                              </ul>
                              {product?.expiryDate && (
                                <div className="mt-2 p-2 bg-amber-100 rounded text-xs">
                                  <strong>Current Expiry:</strong> {new Date(product.expiryDate).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Regular product condition fields (same as AddProductPage)
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="condition">Condition</Label>
                          <Input
                            id="condition"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            placeholder="e.g., Like New, Good, Fair"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="e.g., 2 years old"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="warranty">Warranty</Label>
                          <Input
                            id="warranty"
                            value={warranty}
                            onChange={(e) => setWarranty(e.target.value)}
                            placeholder="e.g., 1 year manufacturer warranty"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="boxAccessories">Box & Accessories</Label>
                          <Input
                            id="boxAccessories"
                            value={boxAccessories}
                            onChange={(e) => setBoxAccessories(e.target.value)}
                            placeholder="e.g., Original box, charger, manual"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="screenCondition">Screen Condition</Label>
                          <Input
                            id="screenCondition"
                            value={screenCondition}
                            onChange={(e) => setScreenCondition(e.target.value)}
                            placeholder="e.g., No scratches, minor wear"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bodyCondition">Body Condition</Label>
                          <Input
                            id="bodyCondition"
                            value={bodyCondition}
                            onChange={(e) => setBodyCondition(e.target.value)}
                            placeholder="e.g., Minor scratches, dents"
                          />
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="exchange" className="space-y-6">
                    <div className="space-y-4">
                      <Label>Preferred Items</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newPreferredItem}
                          onChange={(e) => setNewPreferredItem(e.target.value)}
                          placeholder={isFoodCategory ? "e.g., Other food items, Kitchen appliances" : "Add preferred item"}
                        />
                        <Button type="button" onClick={handleAddPreferredItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {preferredItems.map((item) => (
                          <div
                            key={item}
                            className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              onClick={() => setPreferredItems(preferredItems.filter(i => i !== item))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Not Interested In</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newNotInterestedItem}
                          onChange={(e) => setNewNotInterestedItem(e.target.value)}
                          placeholder={isFoodCategory ? "e.g., Electronics, Clothing" : "Add item you're not interested in"}
                        />
                        <Button type="button" onClick={handleAddNotInterestedItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {notInterestedIn.map((item) => (
                          <div
                            key={item}
                            className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              onClick={() => setNotInterestedIn(notInterestedIn.filter(i => i !== item))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cashOption">Accept Cash Offers</Label>
                        <Switch
                          id="cashOption"
                          checked={cashOption}
                          onCheckedChange={setCashOption}
                        />
                      </div>

                      {/* Price Range Section */}
                      {cashOption && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                          <Label className="text-base font-medium">Pricing Information</Label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="min-price">Minimum Price (PKR)</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">PKR</span>
                                <Input
                                  id="min-price"
                                  type="text"
                                  inputMode="decimal"
                                  placeholder="0"
                                  className="pl-12"
                                  value={minPrice}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^(\d*\.?\d{0,2})$/.test(value) || value === '') {
                                      setMinPrice(value);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="max-price">Maximum Price (PKR)</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">PKR</span>
                                <Input
                                  id="max-price"
                                  type="text"
                                  inputMode="decimal"
                                  placeholder="0"
                                  className="pl-12"
                                  value={maxPrice}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^(\d*\.?\d{0,2})$/.test(value) || value === '') {
                                      setMaxPrice(value);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fixed-price">Or set a fixed price (PKR)</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">PKR</span>
                              <Input
                                id="fixed-price"
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
                                className="pl-12"
                                value={price}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^(\d*\.?\d{0,2})$/.test(value) || value === '') {
                                    setPrice(value);
                                  }
                                }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Leave empty if you specified a price range above
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="exchangeNotes">Exchange Notes</Label>
                        <Textarea
                          id="exchangeNotes"
                          value={exchangeNotes}
                          onChange={(e) => setExchangeNotes(e.target.value)}
                          placeholder={isFoodCategory ? "e.g., Looking for healthy food exchanges, prefer organic items..." : "Any additional notes about exchange preferences"}
                          rows={3}
                        />
                      </div>

                      {isFoodCategory && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <div className="text-blue-600 mt-0.5">💡</div>
                            <div className="text-sm text-blue-700">
                              <p className="font-medium">Food Exchange Tips:</p>
                              <ul className="mt-1 space-y-1">
                                <li>• Consider equal portion sizes when exchanging</li>
                                <li>• Specify dietary preferences clearly</li>
                                <li>• Quick exchanges ensure freshness</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="shipping" className="space-y-6">
                    {isFoodCategory && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-6">
                        <div className="flex items-start space-x-2">
                          <div className="text-orange-600 mt-0.5">🍕</div>
                          <div className="text-sm text-orange-700">
                            <p className="font-medium">Food Delivery Considerations:</p>
                            <ul className="mt-1 space-y-1">
                              <li>• In-person pickup is recommended for food safety</li>
                              <li>• Keep delivery distance short to maintain freshness</li>
                              <li>• Consider temperature-sensitive items</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <ProductLocation
                      location={location}
                      setLocation={setLocation}
                      latitude={latitude}
                      setLatitude={setLatitude}
                      longitude={longitude}
                      setLongitude={setLongitude}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="inPerson">In-Person Exchange</Label>
                        <Switch
                          id="inPerson"
                          checked={inPerson}
                          onCheckedChange={setInPerson}
                        />
                      </div>

                      {inPerson && (
                        <div className="space-y-2">
                          <Label htmlFor="withinMiles">Within Miles</Label>
                          <Input
                            id="withinMiles"
                            type="number"
                            value={withinMiles}
                            onChange={(e) => setWithinMiles(Number(e.target.value))}
                            min={1}
                            max={isFoodCategory ? 25 : 100}
                          />
                          {isFoodCategory && (
                            <p className="text-xs text-amber-600">
                              Recommended: Keep within 25 miles for food freshness
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Label htmlFor="canShip">Can Ship</Label>
                        <Switch
                          id="canShip"
                          checked={canShip}
                          onCheckedChange={setCanShip}
                        />
                      </div>

                      {isFoodCategory && canShip && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            ⚠️ <strong>Note:</strong> Shipping food items requires proper packaging and may affect freshness. Consider local pickup instead.
                          </p>
                        </div>
                      )}

                      {canShip && (
                        <div className="flex items-center justify-between">
                          <Label htmlFor="buyerPaysShipping">Buyer Pays Shipping</Label>
                          <Switch
                            id="buyerPaysShipping"
                            checked={buyerPaysShipping}
                            onCheckedChange={setBuyerPaysShipping}
                          />
                        </div>
                      )}

                      <div className="space-y-4">
                        <Label>Preferred Meet-up Locations</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newPreferredLocation}
                            onChange={(e) => setNewPreferredLocation(e.target.value)}
                            placeholder={isFoodCategory ? "e.g., Central Park, Coffee shops, Markets" : "Add preferred location"}
                          />
                          <Button type="button" onClick={handleAddPreferredLocation}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {preferredLocations.map((loc) => (
                            <div
                              key={loc}
                              className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              {loc}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => setPreferredLocations(preferredLocations.filter(l => l !== loc))}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/product/${productId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="lg" disabled={updateProduct.isPending}>
                    {updateProduct.isPending ? 'Updating...' : 'Update Listing'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProductPage; 