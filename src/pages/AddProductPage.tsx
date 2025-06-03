import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCreateProduct } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X, Upload, ArrowLeft } from 'lucide-react';
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

const AddProductPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const createProduct = useCreateProduct();

  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  // Condition & Details
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
  const [willingToAddCash, setWillingToAddCash] = useState(false);
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

    const productData = {
      title,
      description,
      category,
      images,
      specs: {},
      condition,
      age,
      warranty,
      boxAccessories,
      screenCondition,
      bodyCondition,
      exchangePreferences: {
        preferredItems,
        notInterestedIn,
        cashOption,
        willingToAddCash,
        estimatedValue: price ? parseFloat(price) : 0,
        price: price ? parseFloat(price) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        notes: exchangeNotes,
      },
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
    };

    try {
      await createProduct.mutateAsync(productData);
      // Success handling is done in the hook
    } catch (error) {
      // Error handling is done in the hook
    }
  };

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
            <h1 className="text-3xl font-bold tracking-tight">List a New Item</h1>
            <p className="text-muted-foreground mt-2">
              Create a detailed listing to attract potential buyers and traders
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
              <CardTitle>Create Your Listing</CardTitle>
              <CardDescription>
                Fill in the details below to create your listing. Fields marked with * are required.
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
                    <TabsTrigger value="condition">Condition</TabsTrigger>
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
                        placeholder="Enter a descriptive title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your item in detail"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={setCategory} required>
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
                  </TabsContent>

                  <TabsContent value="exchange" className="space-y-6">
                    <div className="space-y-4">
                      <Label>Preferred Items</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newPreferredItem}
                          onChange={(e) => setNewPreferredItem(e.target.value)}
                          placeholder="Add preferred item"
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
                          placeholder="Add item you're not interested in"
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

                      <div className="flex items-center justify-between">
                        <Label htmlFor="willingToAddCash">Willing to Add Cash</Label>
                        <Switch
                          id="willingToAddCash"
                          checked={willingToAddCash}
                          onCheckedChange={setWillingToAddCash}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="exchangeNotes">Exchange Notes</Label>
                        <Textarea
                          id="exchangeNotes"
                          value={exchangeNotes}
                          onChange={(e) => setExchangeNotes(e.target.value)}
                          placeholder="Any additional notes about exchange preferences"
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="shipping" className="space-y-6">
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
                            max={100}
                          />
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
                            placeholder="Add preferred location"
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
                    onClick={() => navigate('/my-listing')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="lg">
                    List Item
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

export default AddProductPage;
