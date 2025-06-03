import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
  getProducts,
  getProduct,
  getProductsByCategory,
  getNearbyProducts,
  getMyListings,
  getFavorites,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFavorite,
  incrementViews
} from '../services/useProduct';
import { useState, useCallback } from 'react';

// Query Keys
export const PRODUCT_QUERY_KEYS = {
  all: ['products'],
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'],
  list: (filters) => [...PRODUCT_QUERY_KEYS.lists(), filters],
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...PRODUCT_QUERY_KEYS.details(), id],
  myListings: () => [...PRODUCT_QUERY_KEYS.all, 'myListings'],
  favorites: () => [...PRODUCT_QUERY_KEYS.all, 'favorites'],
  category: (categoryName) => [...PRODUCT_QUERY_KEYS.all, 'category', categoryName],
  nearby: (location, options) => [...PRODUCT_QUERY_KEYS.all, 'nearby', location, options],
};

// Get All Products with filtering & search
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Single Product
export const useProduct = (productId) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(productId),
    queryFn: () => getProduct(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Products by Category
export const useProductsByCategory = (categoryName, options = {}) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.category(categoryName),
    queryFn: () => getProductsByCategory(categoryName, options),
    enabled: !!categoryName,
    staleTime: 5 * 60 * 1000,
  });
};

// Enhanced Nearby Products Hook
export const useNearbyProducts = (location, options = {}) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.nearby(location, options),
    queryFn: () => {
      if (!location?.latitude || !location?.longitude) {
        throw new Error('Location coordinates are required');
      }
      return getNearbyProducts({ 
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 10, // Default 10 miles
        sortBy: 'distance', // Default sort by distance
        ...options 
      });
    },
    enabled: !!(location?.latitude && location?.longitude),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      toast({
        title: 'Location Error',
        description: error.message || 'Failed to fetch nearby products',
        variant: 'destructive',
      });
    },
  });
};

// Location Detection Hook
export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser';
      setError(error);
      toast({
        title: 'Location Error',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(newLocation);
        setIsLoading(false);
        
        toast({
          title: 'Location Found',
          description: 'Ready to find nearby products',
        });
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        
        toast({
          title: 'Location Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, [toast]);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    clearLocation,
    hasLocation: !!location,
  };
};

// Hook for nearby products with automatic location detection
export const useNearbyProductsWithLocation = (options = {}) => {
  const { location, isLoading: isLocationLoading, getCurrentLocation, hasLocation } = useLocation();
  
  const nearbyQuery = useNearbyProducts(location, options);

  return {
    ...nearbyQuery,
    location,
    isLocationLoading,
    getCurrentLocation,
    hasLocation,
    // Combined loading state
    isLoading: isLocationLoading || nearbyQuery.isLoading,
  };
};

// Simplified nearby products utility
export const useSimpleNearbyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchNearbyProducts = useCallback(async (latitude, longitude, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const {
        radius = 10,
        page = 1,
        limit = 20,
        category = '',
        condition = '',
        search = '',
        sortBy = 'distance'
      } = options;

      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sortBy
      });

      if (category) params.append('category', category);
      if (condition) params.append('condition', condition);
      if (search) params.append('search', search);

      const response = await fetch(`/api/product/nearby?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch nearby products');
      }

      const data = await response.json();
      setProducts(data.products || []);
      setLoading(false);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch nearby products';
      setError(errorMessage);
      setLoading(false);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [toast]);

  return {
    products,
    loading,
    error,
    fetchNearbyProducts
  };
};

// Distance calculation utility (same as backend)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Hook for searching nearby products with advanced filters
export const useNearbyProductSearch = (location, searchOptions = {}) => {
  const { 
    search = '', 
    category = '', 
    condition = '', 
    radius = 10, 
    sortBy = 'distance',
    page = 1,
    limit = 20 
  } = searchOptions;

  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.nearby(location, { 
      search, 
      category, 
      condition, 
      radius, 
      sortBy,
      page,
      limit 
    }),
    queryFn: () => getNearbyProducts({
      latitude: location.latitude,
      longitude: location.longitude,
      radius,
      category,
      condition,
      sortBy,
      page,
      limit,
      ...(search && { search })
    }),
    enabled: !!(location?.latitude && location?.longitude),
    staleTime: 3 * 60 * 1000, // 3 minutes for search results
  });
};

// Get User's Listings
export const useMyListings = (options = {}) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.myListings(),
    queryFn: () => getMyListings(options),
    staleTime: 2 * 60 * 1000, // 2 minutes for user's own data
  });
};

// Get Favorite Products
export const useFavorites = (options = {}) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.favorites(),
    queryFn: () => getFavorites(options),
    staleTime: 2 * 60 * 1000,
  });
};

// Create Product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productData) => createProduct(productData),
    onSuccess: (data) => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      
      toast({
        title: 'Success',
        description: 'Product listed successfully!',
      });
      // Backend returns product with _id (MongoDB) or id
      navigate(`/product/${data._id || data.id}`);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create product';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Update Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId, productData }) => updateProduct(productId, productData),
    onSuccess: (data, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        PRODUCT_QUERY_KEYS.detail(variables.productId),
        data
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      
      toast({
        title: 'Success',
        description: 'Product updated successfully!',
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update product';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Delete Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId) => deleteProduct(productId),
    onSuccess: (data, productId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(productId) });
      
      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      
      toast({
        title: 'Success',
        description: 'Product deleted successfully!',
      });
      navigate('/my-listings');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete product';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Toggle Favorite
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId) => toggleFavorite(productId),
    onSuccess: (data, productId) => {
      // Update the product in cache to reflect favorite status
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.favorites() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
      
      toast({
        title: 'Success',
        description: data.message,
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to toggle favorite';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Increment Views
export const useIncrementViews = () => {
  return useMutation({
    mutationFn: (productId) => incrementViews(productId),
    // Don't show success/error messages for view tracking
    onError: () => {
      // Silently fail for view tracking
    },
  });
};

// Helper hook for search functionality
export const useProductSearch = () => {
  const queryClient = useQueryClient();

  const searchProducts = async (searchTerm, filters = {}) => {
    const searchFilters = {
      ...filters,
      search: searchTerm,
    };

    return queryClient.fetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.list(searchFilters),
      queryFn: () => getProducts(searchFilters),
      staleTime: 1 * 60 * 1000, // 1 minute for search results
    });
  };

  return { searchProducts };
};

// Helper hook to prefetch product details
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();

  const prefetchProduct = (productId) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.detail(productId),
      queryFn: () => getProduct(productId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchProduct };
}; 