import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useProduct, useIncrementViews, useDeleteProduct, useProductPricing } from '@/hooks/useProducts';
import { useCreateOffer } from '@/hooks/useOffers';
import { useMyListings } from '@/hooks/useProducts';
import AuthModal from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Tag, MessageSquare, ArrowLeft, Plus, Loader2, Edit, Trash2, Smartphone, Monitor, Car, Sofa, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showBarterModal, setShowBarterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [exchangeType, setExchangeType] = useState<'barter' | 'barter_plus_cash' | 'cash_only'>('barter');
  const [cashAmount, setCashAmount] = useState<string>('');
  const [mainImageError, setMainImageError] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Fetch product data using React Query
  const { data: product, isLoading, error, isError } = useProduct(id);
  const { data: pricingInfo } = useProductPricing(id);
  const incrementViews = useIncrementViews();
  const createOffer = useCreateOffer();
  const deleteProduct = useDeleteProduct();
  
  // Get user's products for offering
  const { data: myListingsData } = useMyListings({ limit: 50 });

  // Check if current user is the owner
  const isOwner = user && product && product.listedBy && (
    (user.id && product.listedBy._id && user.id === product.listedBy._id) || 
    (user.id && product.listedBy.id && user.id === product.listedBy.id) ||
    ((user as any)._id && product.listedBy._id && (user as any)._id === product.listedBy._id) ||
    ((user as any)._id && product.listedBy.id && (user as any)._id === product.listedBy.id)
  );
  
  const getCategoryIcon = (size = 'large') => {
    if (!product?.category) return <ShoppingBag className={size === 'large' ? 'h-24 w-24' : 'h-12 w-12'} />;
    
    const category = product.category.toLowerCase();
    const iconSize = size === 'large' ? 'h-24 w-24' : 'h-12 w-12';
    
    if (category.includes('electronics') || category.includes('phone') || category.includes('mobile')) {
      return <Smartphone className={iconSize} />;
    }
    if (category.includes('computer') || category.includes('laptop') || category.includes('monitor')) {
      return <Monitor className={iconSize} />;
    }
    if (category.includes('vehicle') || category.includes('car') || category.includes('bike')) {
      return <Car className={iconSize} />;
    }
    if (category.includes('furniture') || category.includes('chair') || category.includes('table')) {
      return <Sofa className={iconSize} />;
    }
    return <ShoppingBag className={iconSize} />;
  };
  
  // Increment views when product loads
  useEffect(() => {
    if (product && id) {
      incrementViews.mutate(id);
    }
  }, [product, id]);

  const handleBarter = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setShowBarterModal(true);
  };

  const handleEdit = () => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: "Product Deleted",
        description: "Your listing has been successfully deleted.",
      });
      navigate('/my-listings');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBarterSubmit = async () => {
    if (exchangeType !== 'cash_only' && !selectedProduct) {
      toast({
        title: 'Selection Required',
        description: 'Please select a product to offer.',
        variant: 'destructive',
      });
      return;
    }

    if ((exchangeType === 'barter_plus_cash' || exchangeType === 'cash_only') && !cashAmount) {
      toast({
        title: 'Cash Amount Required',
        description: 'Please enter the cash amount for this offer.',
        variant: 'destructive',
      });
      return;
    }

    if (!product?.listedBy?._id && !product?.listedBy) {
      toast({
        title: 'Error',
        description: 'Unable to identify the product owner.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const offerData = {
        offeredTo: product.listedBy._id || product.listedBy,
        offeredProduct: exchangeType === 'cash_only' ? undefined : selectedProduct,
        requestedProduct: id,
        message: offerMessage || 'I would like to trade my product for yours.',
        exchangeType: exchangeType,
        cashAmount: (exchangeType === 'barter_plus_cash' || exchangeType === 'cash_only') ? parseFloat(cashAmount) : undefined
      };

      await createOffer.mutateAsync(offerData);
      setShowBarterModal(false);
      setSelectedProduct('');
      setOfferMessage('');
      setExchangeType('barter');
      setCashAmount('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading product details...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-medium mb-2 text-destructive">Product not found</h3>
                <p className="text-muted-foreground mb-4">
                  {error?.message || "The product you're looking for doesn't exist or has been removed."}
                </p>
                <Button onClick={() => navigate('/browse')}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
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
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                {product.images?.[0] && !mainImageError ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="object-cover w-full h-full"
                    onError={() => setMainImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    {getCategoryIcon('large')}
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.title} - Image ${index + 2}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant="outline">{product.condition}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {product.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Listed {new Date(product.createdAt).toLocaleDateString()}
                </div>
                {product.views && (
                  <div className="flex items-center gap-1">
                    <span>{product.views} views</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* Condition Details */}
                <div>
                  <h3 className="font-semibold mb-2">Condition Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.age && (
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p>{product.age}</p>
                      </div>
                    )}
                    {product.warranty && (
                      <div>
                        <p className="text-sm text-muted-foreground">Warranty</p>
                        <p>{product.warranty}</p>
                      </div>
                    )}
                    {product.boxAccessories && (
                      <div>
                        <p className="text-sm text-muted-foreground">Box & Accessories</p>
                        <p>{product.boxAccessories}</p>
                      </div>
                    )}
                    {product.screenCondition && (
                      <div>
                        <p className="text-sm text-muted-foreground">Screen Condition</p>
                        <p>{product.screenCondition}</p>
                      </div>
                    )}
                    {product.bodyCondition && (
                      <div>
                        <p className="text-sm text-muted-foreground">Body Condition</p>
                        <p>{product.bodyCondition}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm text-muted-foreground capitalize">{key}</p>
                          <p>{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exchange Preferences */}
                {product.exchangePreferences && (
                  <div>
                    <h3 className="font-semibold mb-2">Exchange Preferences</h3>
                    <div className="space-y-4">
                      {product.exchangePreferences.preferredItems && product.exchangePreferences.preferredItems.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Items</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.exchangePreferences.preferredItems.map((item, index) => (
                              <Badge key={index} variant="secondary">{item}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.exchangePreferences.notInterestedIn && product.exchangePreferences.notInterestedIn.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Not Interested In</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.exchangePreferences.notInterestedIn.map((item, index) => (
                              <Badge key={index} variant="outline">{item}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Cash Option</p>
                          <div className="flex items-center gap-2">
                            <p>{product.exchangePreferences.cashOption ? 'Yes' : 'No'}</p>
                            {!product.exchangePreferences.cashOption && !pricingInfo?.acceptCashOffers && (
                              <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                Barter Only
                              </Badge>
                            )}
                          </div>
                        </div>
                        {product.exchangePreferences.willingToAddCash !== undefined && (
                          <div>
                            <p className="text-sm text-muted-foreground">Willing to Add Cash</p>
                            <p>{product.exchangePreferences.willingToAddCash ? 'Yes' : 'No'}</p>
                          </div>
                        )}
                        
                        {/* Price Range Display */}
                        {(product.exchangePreferences.minPrice || product.exchangePreferences.maxPrice || product.exchangePreferences.estimatedValue || product.exchangePreferences.price) && (
                          <div>
                            <p className="text-sm text-muted-foreground">Price Range</p>
                            {product.exchangePreferences.minPrice && product.exchangePreferences.maxPrice && 
                             product.exchangePreferences.minPrice !== product.exchangePreferences.maxPrice ? (
                              <p className="font-semibold text-green-600">
                                PKR {Number(product.exchangePreferences.minPrice).toLocaleString()} - {Number(product.exchangePreferences.maxPrice).toLocaleString()}
                              </p>
                            ) : product.exchangePreferences.price ? (
                              <p className="font-semibold text-green-600">
                                PKR {Number(product.exchangePreferences.price).toLocaleString()}
                              </p>
                            ) : product.exchangePreferences.estimatedValue ? (
                              <p className="font-semibold text-green-600">
                                PKR {Number(product.exchangePreferences.estimatedValue).toLocaleString()}
                              </p>
                            ) : product.exchangePreferences.minPrice ? (
                              <p className="font-semibold text-green-600">
                                From PKR {Number(product.exchangePreferences.minPrice).toLocaleString()}
                              </p>
                            ) : product.exchangePreferences.maxPrice ? (
                              <p className="font-semibold text-green-600">
                                Up to PKR {Number(product.exchangePreferences.maxPrice).toLocaleString()}
                              </p>
                            ) : null}
                          </div>
                        )}
                      </div>
                      {product.exchangePreferences.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p>{product.exchangePreferences.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipping & Location */}
                {product.shippingOptions && (
                  <div>
                    <h3 className="font-semibold mb-2">Shipping & Location</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">In-Person Exchange</p>
                          <p>{product.shippingOptions.inPerson ? 'Yes' : 'No'}</p>
                        </div>
                        {product.shippingOptions.inPerson && product.shippingOptions.withinMiles && (
                          <div>
                            <p className="text-sm text-muted-foreground">Within Miles</p>
                            <p>{product.shippingOptions.withinMiles} miles</p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Can Ship</p>
                          <p>{product.shippingOptions.canShip ? 'Yes' : 'No'}</p>
                        </div>
                        {product.shippingOptions.canShip && (
                          <div>
                            <p className="text-sm text-muted-foreground">Buyer Pays Shipping</p>
                            <p>{product.shippingOptions.buyerPaysShipping ? 'Yes' : 'No'}</p>
                          </div>
                        )}
                      </div>
                      {product.shippingOptions.preferredLocations && product.shippingOptions.preferredLocations.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Meet-up Locations</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.shippingOptions.preferredLocations.map((location, index) => (
                              <Badge key={index} variant="secondary">{location}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Owner Information */}
                {product.listedBy && (
                  <div>
                    <h3 className="font-semibold mb-2">Listed By</h3>
                    <div className="flex items-center gap-2">
                      <p>{product.listedBy.name || 'Unknown User'}</p>
                      {product.listedBy.email && (
                        <Badge variant="outline">{product.listedBy.email}</Badge>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  {/* Owner Actions */}
                  {isOwner ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        You are the owner of this listing
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleEdit}
                          className="w-full"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Listing
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="lg"
                              className="w-full"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your listing
                                "{product.title}" and remove it from our servers. Any pending offers will also be cancelled.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleteProduct.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                  </>
                                ) : (
                                  'Delete Listing'
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ) : (
                    <>
                      {product?.isSold ? (
                        <div className="text-center p-6 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-red-600 mb-2">SOLD</div>
                          <p className="text-muted-foreground">
                            This item has been sold and is no longer available for trade.
                          </p>
                          {product.soldDate && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Sold on {new Date(product.soldDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <>
                          <Button
                            size="lg"
                            className="w-full"
                            onClick={handleBarter}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {isAuthenticated 
                              ? (product?.exchangePreferences?.cashOption || pricingInfo?.acceptCashOffers) 
                                ? 'Start Barter' 
                                : 'Make Barter Offer'
                              : 'Login to Barter'
                            }
                          </Button>
                          
                          {!isAuthenticated && (
                            <p className="text-sm text-muted-foreground text-center">
                              Please login or register to initiate a barter
                            </p>
                          )}
                          
                          {isAuthenticated && !product?.exchangePreferences?.cashOption && !pricingInfo?.acceptCashOffers && (
                            <p className="text-sm text-muted-foreground text-center">
                              💡 This seller only accepts product exchanges (no cash offers)
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showBarterModal} onOpenChange={setShowBarterModal}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-center">
              {(product?.exchangePreferences?.cashOption || pricingInfo?.acceptCashOffers) 
                ? 'Make a Barter Offer' 
                : 'Make a Product Exchange Offer'
              }
            </DialogTitle>
            <DialogDescription className="text-base text-center">
              {(product?.exchangePreferences?.cashOption || pricingInfo?.acceptCashOffers) 
                ? `Select one of your products to offer in exchange for "${product?.title}"`
                : `This seller only accepts product exchanges. Select one of your products to offer in exchange for "${product?.title}"`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Select Product to Offer */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Select Your Product to Offer</h4>
              {myListingsData?.products?.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      You don't have any products listed yet.
                    </p>
                    <Button onClick={() => navigate('/add-product')}>
                      Add a Product
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                  {myListingsData?.products?.map((userProduct) => (
                    <Card
                      key={userProduct._id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedProduct === userProduct._id
                          ? 'border-primary ring-2 ring-primary/20'
                          : ''
                      }`}
                      onClick={() => setSelectedProduct(userProduct._id)}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
                          <img
                            src={userProduct.images?.[0] || 'https://via.placeholder.com/150'}
                            alt={userProduct.title}
                            className="object-cover w-full h-full"
                          />
                          {selectedProduct === userProduct._id && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <Plus className="h-6 w-6 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                        </div>
                        <h5 className="font-medium truncate">{userProduct.title}</h5>
                        <p className="text-sm text-muted-foreground">{userProduct.category}</p>
                        <p className="text-sm text-muted-foreground">
                          PKR {userProduct.estimatedValue?.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Exchange Type Selection */}
            {(product?.exchangePreferences?.cashOption || pricingInfo?.acceptCashOffers) ? (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Exchange Type</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      exchangeType === 'barter' ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => setExchangeType('barter')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          exchangeType === 'barter' 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                        }`} />
                        <div>
                          <h5 className="font-medium">Product Exchange Only</h5>
                          <p className="text-sm text-muted-foreground">Trade your product for theirs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      exchangeType === 'barter_plus_cash' ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => setExchangeType('barter_plus_cash')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          exchangeType === 'barter_plus_cash' 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                        }`} />
                        <div>
                          <h5 className="font-medium">Product + Cash</h5>
                          <p className="text-sm text-muted-foreground">Trade your product plus additional cash</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      exchangeType === 'cash_only' ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => setExchangeType('cash_only')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          exchangeType === 'cash_only' 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                        }`} />
                        <div>
                          <h5 className="font-medium">Cash Only</h5>
                          <p className="text-sm text-muted-foreground">Make a cash offer without trading items</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cash Amount Input */}
                {(exchangeType === 'barter_plus_cash' || exchangeType === 'cash_only') && (
                  <div className="space-y-2">
                    <Label htmlFor="cash-amount">
                      {exchangeType === 'barter_plus_cash' ? 'Additional Cash Amount' : 'Offer Amount'}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        PKR
                      </span>
                      <Input
                        id="cash-amount"
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="0"
                        className="pl-12"
                        min="0"
                      />
                    </div>
                    {pricingInfo?.pricingInfo && (
                      <div className="text-sm text-muted-foreground">
                        {pricingInfo.pricingInfo.minPrice && pricingInfo.pricingInfo.maxPrice && (
                          <p>Suggested range: PKR {pricingInfo.pricingInfo.minPrice.toLocaleString()} - PKR {pricingInfo.pricingInfo.maxPrice.toLocaleString()}</p>
                        )}
                        {pricingInfo.pricingInfo.fixedPrice && (
                          <p>Fixed price: PKR {pricingInfo.pricingInfo.fixedPrice.toLocaleString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Barter Only Notice */
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Exchange Type</h4>
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100">Product Exchange Only</h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          This seller only accepts product exchanges (barter). Cash offers are not available for this item.
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          💡 You can offer one of your listed items in exchange for this product.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="offer-message">Message (Optional)</Label>
              <textarea
                id="offer-message"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Add a message to your offer..."
                className="w-full p-3 border rounded-md resize-none h-20"
              />
            </div>

            <Separator />

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setShowBarterModal(false)}
                className="px-8 h-12"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBarterSubmit}
                disabled={(exchangeType !== 'cash_only' && !selectedProduct) || createOffer.isPending}
                className="px-8 h-12"
              >
                {createOffer.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Offer'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Login Required"
        description="Please login or create an account to start bartering"
        defaultTab="login"
      />

      <Footer />
    </div>
  );
};

export default ProductPage;
