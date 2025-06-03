import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X, ArrowLeft, Trash2, Save, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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

const EditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // React Query hooks
  const { data: product, isLoading, error } = useProduct(productId!);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [condition, setCondition] = useState('');
  const [age, setAge] = useState('');
  const [warranty, setWarranty] = useState('');
  const [boxAccessories, setBoxAccessories] = useState('');
  const [screenCondition, setScreenCondition] = useState('');
  const [bodyCondition, setBodyCondition] = useState('');
  const [preferredItems, setPreferredItems] = useState<string[]>([]);
  const [newPreferredItem, setNewPreferredItem] = useState('');
  const [notInterestedIn, setNotInterestedIn] = useState<string[]>([]);
  const [newNotInterestedItem, setNewNotInterestedItem] = useState('');
  const [cashOption, setCashOption] = useState(false);
  const [willingToAddCash, setWillingToAddCash] = useState(false);
  const [exchangeNotes, setExchangeNotes] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [inPerson, setInPerson] = useState(true);
  const [withinMiles, setWithinMiles] = useState(10);
  const [canShip, setCanShip] = useState(false);
  const [buyerPaysShipping, setBuyerPaysShipping] = useState(true);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [newPreferredLocation, setNewPreferredLocation] = useState('');

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Populate form with existing product data
  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setCategory(product.category || '');
      setImages(product.images || []);
      setCondition(product.condition || '');
      setAge(product.age || '');
      setWarranty(product.warranty || '');
      setBoxAccessories(product.boxAccessories || '');
      setScreenCondition(product.screenCondition || '');
      setBodyCondition(product.bodyCondition || '');
      setPreferredItems(product.exchangePreferences?.preferredItems || []);
      setNotInterestedIn(product.exchangePreferences?.notInterestedIn || []);
      setCashOption(product.exchangePreferences?.cashOption || false);
      setWillingToAddCash(product.exchangePreferences?.willingToAddCash || false);
      setExchangeNotes(product.exchangePreferences?.notes || '');
      setLocation(product.location || '');
      setLatitude(product.latitude || null);
      setLongitude(product.longitude || null);
      setInPerson(product.shippingOptions?.inPerson ?? true);
      setWithinMiles(product.shippingOptions?.withinMiles || 10);
      setCanShip(product.shippingOptions?.canShip || false);
      setBuyerPaysShipping(product.shippingOptions?.buyerPaysShipping ?? true);
      setPreferredLocations(product.shippingOptions?.preferredLocations || []);
    }
  }, [product]);

  // Check if user is the owner
  const isOwner = user && product && (
    user.id === product.listedBy?._id || 
    user.id === product.listedBy?.id ||
    user.id === product.listedBy
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading product...</p>
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
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/my-listings')}>
              Back to My Listings
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">You can only edit products that you have listed.</p>
            <Button onClick={() => navigate(`/product/${productId}`)}>
              View Product
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handlers for form interactions
  const handleAddPreferredItem = () => {
    if (newPreferredItem && !preferredItems.includes(newPreferredItem)) {
      setPreferredItems([...preferredItems, newPreferredItem]);
      setNewPreferredItem('');
      setHasChanges(true);
    }
  };

  const handleAddNotInterestedItem = () => {
    if (newNotInterestedItem && !notInterestedIn.includes(newNotInterestedItem)) {
      setNotInterestedIn([...notInterestedIn, newNotInterestedItem]);
      setNewNotInterestedItem('');
      setHasChanges(true);
    }
  };

  const handleAddPreferredLocation = () => {
    if (newPreferredLocation && !preferredLocations.includes(newPreferredLocation)) {
      setPreferredLocations([...preferredLocations, newPreferredLocation]);
      setNewPreferredLocation('');
      setHasChanges(true);
    }
  };

  // Track form changes
  const handleFormChange = () => {
    setHasChanges(true);
  };

  // Handle form submission
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
        description: 'Please provide location coordinates',
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
        estimatedValue: product?.exchangePreferences?.estimatedValue || 0,
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
      await updateProduct.mutateAsync({
        productId: productId!,
        productData
      });
      setHasChanges(false);
      navigate(`/product/${productId}`);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct.mutateAsync(productId!);
      // Navigation is handled in the hook
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsDeleting(false);
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
              onClick={() => navigate(`/product/${productId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                <p className="text-muted-foreground mt-2">
                  Update your listing details and manage images
                </p>
              </div>
              
              {/* Delete Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Product
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Delete Product
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{product?.title}"? This action cannot be undone.
                      All offers and messages related to this product will also be removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Product'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Changes indicator */}
          {hasChanges && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes. Don't forget to save your updates!
              </AlertDescription>
            </Alert>
          )}

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
                Modify the details below to update your listing. Fields marked with * are required.
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
                        onChange={(e) => {
                          setTitle(e.target.value);
                          handleFormChange();
                        }}
                        placeholder="Enter a descriptive title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          handleFormChange();
                        }}
                        placeholder="Describe your item in detail"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={category} 
                        onValueChange={(value) => {
                          setCategory(value);
                          handleFormChange();
                        }}
                        required
                      >
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
                      onImagesChange={(urls) => {
                        setImages(urls);
                        handleFormChange();
                      }}
                      maxImages={10}
                    />
                  </TabsContent>

                  <TabsContent value="condition" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Input
                        id="condition"
                        value={condition}
                        onChange={(e) => {
                          setCondition(e.target.value);
                          handleFormChange();
                        }}
                        placeholder="e.g., Like New, Good, Fair"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={age}
                        onChange={(e) => {
                          setAge(e.target.value);
                          handleFormChange();
                        }}
                        placeholder="e.g., 2 years old"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warranty">Warranty</Label>
                      <Input
                        id="warranty"
                        value={warranty}
                        onChange={(e) => {
                          setWarranty(e.target.value);
                          handleFormChange();
                        }}
                        placeholder="e.g., 1 year manufacturer warranty"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="boxAccessories">Box & Accessories</Label>
                      <Input
                        id="boxAccessories"
                        value={boxAccessories}
                        onChange={(e) => {
                          setBoxAccessories(e.target.value);
                          handleFormChange();
                        }}
                        placeholder="e.g., Original box, charger, manual"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="screenCondition">Screen Condition</Label>
                      <Input
                        id="screenCondition"
                        value={screenCondition}
                        onChange={(e) => {
                          setScreenCondition(e.target.value);
                          handleFormChange();
                        }}
                        placeholder="e.g., No scratches, minor wear"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bodyCondition">Body Condition</Label>
                      <Input
                        id="bodyCondition"
                        value={bodyCondition}
                        onChange={(e) => {
                          setBodyCondition(e.target.value);
                          handleFormChange();
                        }}
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
                              onClick={() => {
                                setPreferredItems(preferredItems.filter(i => i !== item));
                                handleFormChange();
                              }}
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
                              onClick={() => {
                                setNotInterestedIn(notInterestedIn.filter(i => i !== item));
                                handleFormChange();
                              }}
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
                          onCheckedChange={(checked) => {
                            setCashOption(checked);
                            handleFormChange();
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="willingToAddCash">Willing to Add Cash</Label>
                        <Switch
                          id="willingToAddCash"
                          checked={willingToAddCash}
                          onCheckedChange={(checked) => {
                            setWillingToAddCash(checked);
                            handleFormChange();
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="exchangeNotes">Exchange Notes</Label>
                        <Textarea
                          id="exchangeNotes"
                          value={exchangeNotes}
                          onChange={(e) => {
                            setExchangeNotes(e.target.value);
                            handleFormChange();
                          }}
                          placeholder="Any additional notes about exchange preferences"
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="shipping" className="space-y-6">
                    <ProductLocation
                      location={location}
                      setLocation={(loc) => {
                        setLocation(loc);
                        handleFormChange();
                      }}
                      latitude={latitude}
                      setLatitude={(lat) => {
                        setLatitude(lat);
                        handleFormChange();
                      }}
                      longitude={longitude}
                      setLongitude={(lng) => {
                        setLongitude(lng);
                        handleFormChange();
                      }}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="inPerson">In-Person Exchange</Label>
                        <Switch
                          id="inPerson"
                          checked={inPerson}
                          onCheckedChange={(checked) => {
                            setInPerson(checked);
                            handleFormChange();
                          }}
                        />
                      </div>

                      {inPerson && (
                        <div className="space-y-2">
                          <Label htmlFor="withinMiles">Within Miles</Label>
                          <Input
                            id="withinMiles"
                            type="number"
                            value={withinMiles}
                            onChange={(e) => {
                              setWithinMiles(Number(e.target.value));
                              handleFormChange();
                            }}
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
                          onCheckedChange={(checked) => {
                            setCanShip(checked);
                            handleFormChange();
                          }}
                        />
                      </div>

                      {canShip && (
                        <div className="flex items-center justify-between">
                          <Label htmlFor="buyerPaysShipping">Buyer Pays Shipping</Label>
                          <Switch
                            id="buyerPaysShipping"
                            checked={buyerPaysShipping}
                            onCheckedChange={(checked) => {
                              setBuyerPaysShipping(checked);
                              handleFormChange();
                            }}
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
                                onClick={() => {
                                  setPreferredLocations(preferredLocations.filter(l => l !== loc));
                                  handleFormChange();
                                }}
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

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/product/${productId}`)}
                  >
                    Cancel
                  </Button>
                  
                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={updateProduct.isPending || !hasChanges}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {updateProduct.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
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