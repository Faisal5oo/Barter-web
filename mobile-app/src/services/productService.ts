import api from './api';

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  location: string;
  views: number;
  createdAt: string;
  isFavorited?: boolean;
  isFree?: boolean;
  distance?: string;
  listedBy: {
    _id: string;
    name: string;
    rating: number;
  };
  exchangePreferences: {
    barter: boolean;
    cash: boolean;
    cashOption: boolean;
    estimatedValue?: number;
    minPrice?: number;
    maxPrice?: number;
    price?: number;
  };
}

export interface ProductFilters {
  category?: string;
  search?: string;
  exchangeType?: 'all' | 'barter' | 'cash' | 'both';
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      // Mock data for development
      if (__DEV__) {
        return this.getMockProducts(filters);
      }
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      // Mock data for development
      if (__DEV__) {
        return this.getMockProduct(id);
      }
      throw error;
    }
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      // Mock response for development
      if (__DEV__) {
        return {
          _id: Date.now().toString(),
          ...productData,
          views: 0,
          createdAt: new Date().toISOString(),
          listedBy: {
            _id: '1',
            name: 'John Doe',
            rating: 4.8,
          },
        } as Product;
      }
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      // Mock response for development
      if (__DEV__) {
        return this.getMockProduct(id);
      }
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      if (!__DEV__) {
        throw error;
      }
    }
  }

  async getFreeProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/products/free?${params.toString()}`);
      return response.data;
    } catch (error) {
      // Mock data for development
      if (__DEV__) {
        return this.getMockFreeProducts(filters);
      }
      throw error;
    }
  }

  private getMockProducts(filters: ProductFilters): ProductsResponse {
    const mockProducts: Product[] = [
      {
        _id: '1',
        title: 'iPhone 13 Pro',
        description: 'Excellent condition iPhone 13 Pro with all accessories',
        category: 'Electronics',
        condition: 'Excellent',
        images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400'],
        location: 'New York, NY',
        views: 45,
        createdAt: new Date().toISOString(),
        isFavorited: false,
        isFree: false,
        listedBy: {
          _id: '1',
          name: 'John Doe',
          rating: 4.8,
        },
        exchangePreferences: {
          barter: true,
          cash: true,
          cashOption: true,
          estimatedValue: 800,
          minPrice: 700,
          maxPrice: 900,
        },
      },
      {
        _id: '2',
        title: 'MacBook Air M2',
        description: 'Like new MacBook Air with M2 chip, perfect for work',
        category: 'Electronics',
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'],
        location: 'San Francisco, CA',
        views: 32,
        createdAt: new Date().toISOString(),
        isFavorited: true,
        isFree: false,
        listedBy: {
          _id: '2',
          name: 'Jane Smith',
          rating: 4.9,
        },
        exchangePreferences: {
          barter: true,
          cash: false,
          cashOption: false,
        },
      },
    ];

    return {
      products: mockProducts,
      pagination: {
        totalProducts: mockProducts.length,
        totalPages: 1,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  private getMockProduct(id: string): Product {
    return {
      _id: id,
      title: 'iPhone 13 Pro',
      description: 'Excellent condition iPhone 13 Pro with all accessories',
      category: 'Electronics',
      condition: 'Excellent',
      images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400'],
      location: 'New York, NY',
      views: 45,
      createdAt: new Date().toISOString(),
      isFavorited: false,
      isFree: false,
      listedBy: {
        _id: '1',
        name: 'John Doe',
        rating: 4.8,
      },
      exchangePreferences: {
        barter: true,
        cash: true,
        cashOption: true,
        estimatedValue: 800,
        minPrice: 700,
        maxPrice: 900,
      },
    };
  }

  private getMockFreeProducts(filters: ProductFilters): ProductsResponse {
    const mockFreeProducts: Product[] = [
      {
        _id: '3',
        title: 'Free Books Collection',
        description: 'Collection of programming books, free to good home',
        category: 'Books',
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
        location: 'Boston, MA',
        views: 12,
        createdAt: new Date().toISOString(),
        isFavorited: false,
        isFree: true,
        listedBy: {
          _id: '3',
          name: 'Mike Johnson',
          rating: 4.7,
        },
        exchangePreferences: {
          barter: false,
          cash: false,
          cashOption: false,
        },
      },
    ];

    return {
      products: mockFreeProducts,
      pagination: {
        totalProducts: mockFreeProducts.length,
        totalPages: 1,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export const productService = new ProductService(); 