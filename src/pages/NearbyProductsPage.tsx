import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LeafletMap from '@/components/map/LeafletMap';
import ProductDebugInfo from '@/components/debug/ProductDebugInfo';
import LocationTester from '@/components/debug/LocationTester';
import ApiTester from '@/components/debug/ApiTester';
import DistanceValidator from '@/components/debug/DistanceValidator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Filter, 
  Info, 
  Locate, 
  MapPin, 
  Navigation, 
  Search, 
  Star, 
  Heart,
  Eye,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { 
  useNearbyProductsWithLocation,
  useToggleFavorite,
  useIncrementViews
} from '@/hooks/useProducts';
import ProductCard from '@/components/ui/ProductCard';

const NearbyProductsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    category: '',
    condition: '',
    radius: 10,
    sortBy: 'distance',
    page: 1,
    limit: 20
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [barterOnly, setBarterOnly] = useState<boolean>(false);
  const [manualLocation, setManualLocation] = useState(null); // For testing

  // React Query hooks - use manual location if set, otherwise use detected location
  const {
    data: nearbyData,
    isLoading,
    isLocationLoading,
    getCurrentLocation,
    hasLocation: hasDetectedLocation,
    location: detectedLocation,
    error
  } = useNearbyProductsWithLocation({
    ...searchFilters,
    // Override location if manually set
    ...(manualLocation && {
      latitude: manualLocation.latitude,
      longitude: manualLocation.longitude
    })
  });

  // Use manual location if set, otherwise use detected location
  const location = manualLocation || detectedLocation;
  const hasLocation = !!(manualLocation || hasDetectedLocation);

  const toggleFavoriteMutation = useToggleFavorite();
  const incrementViewsMutation = useIncrementViews();

  const handleFilterChange = (key: string, value: any) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }));
  };

  const handleToggleFavorite = (productId: string) => {
    toggleFavoriteMutation.mutate(productId);
  };

  const handleViewProduct = (productId: string) => {
    incrementViewsMutation.mutate(productId);
  };

  const applyFilters = () => {
    const categoryFilter = selectedCategories.length > 0 ? selectedCategories[0] : '';
    handleFilterChange('category', categoryFilter);
    // Add barter filter logic if needed
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setBarterOnly(false);
    setSearchFilters(prev => ({
      ...prev,
      category: '',
      condition: '',
      search: '',
      radius: 10,
      sortBy: 'distance',
      page: 1
    }));
  };

  // Show location request if no location
  if (!hasLocation && !isLocationLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-8">
          <div className="text-center max-w-md mx-auto mt-20">
            <MapPin className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">Find Products Near You</h1>
            <p className="text-gray-600 mb-6">
              Allow location access to discover items available for barter in your area
            </p>
            <Button onClick={getCurrentLocation} size="lg">
              <Locate className="mr-2 h-5 w-5" />
              Enable Location
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Nearby Products</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        {/* Map Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Nearby Items</h1>
            <p className="text-muted-foreground">
              Find items available for barter in your area
            </p>
            {location && (
              <p className="text-sm text-gray-500 mt-1">
                📍 Searching within {searchFilters.radius} miles of your location
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={getCurrentLocation}
              disabled={isLocationLoading}
            >
              <Locate className="mr-1 h-4 w-4" />
              {isLocationLoading ? 'Finding...' : 'Update Location'}
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/add-product">
                List Your Item
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Map Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search nearby items..."
              className="pl-10"
              value={searchFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="distance" className="whitespace-nowrap">
                Distance: {searchFilters.radius} miles
              </Label>
              <Slider
                id="distance"
                defaultValue={[10]}
                max={50}
                step={5}
                value={[searchFilters.radius]}
                onValueChange={(value) => handleFilterChange('radius', value[0])}
                className="w-32"
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-1 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filter Nearby Items</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6">
                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Electronics', 'Furniture', 'Clothing', 'Gaming', 'Sports', 'Vehicles', 'Books'].map((category) => (
                        <div key={category} className="flex items-center gap-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                              }
                            }}
                          />
                          <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Condition */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Condition</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['New', 'Like New', 'Good', 'Fair'].map((condition) => (
                        <div key={condition} className="flex items-center gap-2">
                          <Checkbox 
                            id={`condition-${condition}`} 
                            checked={searchFilters.condition === condition}
                            onCheckedChange={(checked) => {
                              handleFilterChange('condition', checked ? condition : '');
                            }}
                          />
                          <Label htmlFor={`condition-${condition}`}>{condition}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Exchange Options */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Exchange Options</h3>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="barter-only"
                        checked={barterOnly}
                        onCheckedChange={(checked) => setBarterOnly(!!checked)}
                      />
                      <Label htmlFor="barter-only">Barter only items</Label>
                    </div>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Sort By</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'distance', label: 'Distance' },
                        { value: 'newest', label: 'Newest First' },
                        { value: 'oldest', label: 'Oldest First' },
                        { value: 'views', label: 'Most Viewed' }
                      ].map((option) => (
                        <div key={option.value} className="flex items-center gap-2">
                          <Checkbox 
                            id={`sort-${option.value}`} 
                            checked={searchFilters.sortBy === option.value}
                            onCheckedChange={(checked) => {
                              if (checked) handleFilterChange('sortBy', option.value);
                            }}
                          />
                          <Label htmlFor={`sort-${option.value}`}>{option.label}</Label>
                      </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={resetFilters}>
                      Reset
                    </Button>
                    <Button onClick={applyFilters}>Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Loading State */}
        {(isLoading || isLocationLoading) && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>{isLocationLoading ? 'Getting your location...' : 'Loading nearby products...'}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-8">
            <p className="text-red-600 mb-4">{error.message}</p>
            <Button onClick={getCurrentLocation} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !isLocationLoading && !error && nearbyData && (
          <>
            {/* Location Tester - Remove this in production */}
            <LocationTester 
              userLocation={location}
              onLocationChange={setManualLocation}
            />

            {/* API Tester - Remove this in production */}
            <ApiTester userLocation={location} />

            {/* Distance Validator - Remove this in production */}
            <DistanceValidator 
              userLocation={location} 
              products={nearbyData.products || []} 
            />

            {/* Debug Component - Remove this in production */}
            <ProductDebugInfo 
              products={nearbyData.products || []} 
              userLocation={location}
            />

            {/* Leaflet Map */}
            <div className="mb-8">
              <LeafletMap
                products={nearbyData.products || []}
                userLocation={location}
                searchRadius={searchFilters.radius}
                className="h-[calc(100vh-300px)] rounded-lg overflow-hidden border"
                onProductClick={handleViewProduct}
              />
        </div>
        
        {/* Product Listings */}
        <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Nearby Items ({nearbyData.pagination?.totalProducts || nearbyData.products?.length || 0})
                </h2>
                {nearbyData.searchRadius && (
                  <span className="text-sm text-gray-500">
                    Within {nearbyData.searchRadius} miles
                  </span>
                )}
                  </div>
                  
              {nearbyData.products?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {nearbyData.products.map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        currentUserId={user?.id}
                        onToggleFavorite={handleToggleFavorite}
                        onView={handleViewProduct}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {nearbyData.pagination && nearbyData.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={!nearbyData.pagination.hasPrev}
                        onClick={() => handleFilterChange('page', searchFilters.page - 1)}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {nearbyData.pagination.currentPage} of {nearbyData.pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={!nearbyData.pagination.hasNext}
                        onClick={() => handleFilterChange('page', searchFilters.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No products found nearby</h3>
                  <p className="text-gray-500 mb-4">
                    Try expanding your search radius or adjusting your filters
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleFilterChange('radius', Math.min(searchFilters.radius + 10, 50))}
                  >
                    Expand Search Radius
                  </Button>
                </div>
              )}
              </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default NearbyProductsPage;
