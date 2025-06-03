import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, Search } from 'lucide-react';
import { useLocation, useSimpleNearbyProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ui/ProductCard';

const SimpleNearbyExample = () => {
  const [radius, setRadius] = useState([10]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user } = useSelector((state) => state.auth);
  
  // Use location hook
  const { location, isLoading: isLocationLoading, getCurrentLocation, hasLocation } = useLocation();
  
  // Use simplified nearby products
  const { products, loading, fetchNearbyProducts } = useSimpleNearbyProducts();

  // Fetch products when location or filters change
  useEffect(() => {
    if (hasLocation && location) {
      const fetchProducts = async () => {
        try {
          await fetchNearbyProducts(location.latitude, location.longitude, {
            radius: radius[0],
            search: searchTerm,
            category: selectedCategory,
            limit: 20,
            page: 1
          });
        } catch (error) {
          console.error('Error fetching nearby products:', error);
        }
      };

      // Debounce the search
      const timeoutId = setTimeout(fetchProducts, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [location, radius, searchTerm, selectedCategory, hasLocation, fetchNearbyProducts]);

  const handleViewProduct = (productId) => {
    // Navigate to product page or handle view
    console.log('View product:', productId);
  };

  const handleToggleFavorite = (productId) => {
    // Handle favorite toggle
    console.log('Toggle favorite:', productId);
  };

  if (!hasLocation) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Find Products Near You</h3>
            <p className="text-gray-600 mb-4">
              Allow location access to discover items in your area
            </p>
            <Button onClick={getCurrentLocation} disabled={isLocationLoading}>
              {isLocationLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              {isLocationLoading ? 'Finding Location...' : 'Enable Location'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Find Nearby Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Search Radius: {radius[0]} miles</Label>
            <Slider
              id="radius"
              value={radius}
              onValueChange={setRadius}
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            {loading ? 'Searching...' : `Found ${products.length} products nearby`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  currentUserId={user?.id}
                  onToggleFavorite={handleToggleFavorite}
                  onView={handleViewProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found in your area</p>
              <p className="text-sm text-gray-400 mt-1">
                Try expanding your search radius or adjusting filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleNearbyExample; 