// useProduct.js - Product API service
import { axiosInstanceWeb } from '../lib/axiosInstance';

// Get All Products with filtering & search
const getAllProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add all filter parameters exactly as backend expects
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/product?${params.toString()}`);
    // Backend returns { products: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

// Get Single Product
const getProductById = async (productId) => {
  try {
    const response = await axiosInstanceWeb.get(`/product/${productId}`);
    // Backend returns the product object directly (not wrapped)
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

// Get Products by Category
const getProductsByCategory = async (categoryName, options = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/product/category/${categoryName}?${params.toString()}`);
    // Backend returns { products: [...], category: string, pagination: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
  }
};

// Get Nearby Products
const getNearbyProducts = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Required coordinates - use latitude/longitude as per simplified backend
    if (options.latitude && options.longitude) {
      params.append('latitude', options.latitude);
      params.append('longitude', options.longitude);
    } else if (options.lat && options.lng) {
      // Backward compatibility - convert lat/lng to latitude/longitude
      params.append('latitude', options.lat);
      params.append('longitude', options.lng);
    }
    
    // Optional parameters with defaults
    if (options.radius !== undefined) {
      params.append('radius', options.radius);
    }
    if (options.page !== undefined) {
      params.append('page', options.page);
    }
    if (options.limit !== undefined) {
      params.append('limit', options.limit);
    }
    if (options.category) {
      params.append('category', options.category);
    }
    if (options.condition) {
      params.append('condition', options.condition);
    }
    if (options.sortBy) {
      params.append('sortBy', options.sortBy);
    }
    if (options.search) {
      params.append('search', options.search);
    }

    const response = await axiosInstanceWeb.get(`/product/nearby?${params.toString()}`);
    // Backend returns { products: [...], userLocation: {...}, searchRadius: number, pagination: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch nearby products');
  }
};

// Get User's Listings
const getMyListings = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/product/user/my-listings?${params.toString()}`);
    // Backend returns { products: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch your listings');
  }
};

// Get Favorite Products
const getFavoriteProducts = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/product/user/favorites?${params.toString()}`);
    // Backend returns { products: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
  }
};

// Create Product
const createProduct = async (productData) => {
  try {
    const response = await axiosInstanceWeb.post('/product', productData);
    // Backend returns the created product object with populated listedBy
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

// Update Product
const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstanceWeb.put(`/product/${productId}`, productData);
    // Backend returns the updated product object with populated listedBy
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

// Delete Product
const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstanceWeb.delete(`/product/${productId}`);
    // Backend returns { message: "Product deleted successfully" }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

// Toggle Favorite
const toggleFavorite = async (productId) => {
  try {
    const response = await axiosInstanceWeb.post(`/product/${productId}/favorite`);
    // Backend returns { message: "Added/Removed from favorites", isFavorited: boolean }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle favorite');
  }
};

// Increment Views
const incrementViews = async (productId) => {
  try {
    const response = await axiosInstanceWeb.post(`/product/${productId}/view`);
    // Backend returns { message: "View count updated" }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update views');
  }
};

export {
  getAllProducts as getProducts,
  getProductById as getProduct,
  getProductsByCategory,
  getNearbyProducts,
  getMyListings,
  getFavoriteProducts as getFavorites,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFavorite,
  incrementViews
}; 