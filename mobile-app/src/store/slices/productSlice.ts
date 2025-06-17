import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ShippingOptions {
  delivery: boolean;
  pickup: boolean;
  meetup: boolean;
  shipping: boolean;
}

export interface ExchangePreferences {
  preferredItems: string[];
  notInterestedIn: string[];
  cashOption: boolean;
  willingToAddCash: boolean;
  notes?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Gaming' | 'Sports' | 'Vehicles' | 'Food & Grocery' | 'Free Stuff';
  images: string[];
  specs: Record<string, any>;
  condition?: string;
  age?: string;
  warranty?: string;
  boxAccessories?: string;
  screenCondition?: string;
  bodyCondition?: string;
  listedBy: string;
  exchangePreferences: ExchangePreferences;
  location: string;
  shippingOptions: ShippingOptions;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  userProducts: Product[];
  categories: string[];
  filters: {
    category?: string;
    location?: string;
    priceRange?: [number, number];
    condition?: string;
  };
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  userProducts: [],
  categories: ['Electronics', 'Furniture', 'Clothing', 'Gaming', 'Sports', 'Vehicles', 'Food & Grocery', 'Free Stuff'],
  filters: {},
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      state.userProducts.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      const userIndex = state.userProducts.findIndex(p => p.id === action.payload.id);
      if (userIndex !== -1) {
        state.userProducts[userIndex] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      state.userProducts = state.userProducts.filter(p => p.id !== action.payload);
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setUserProducts: (state, action: PayloadAction<Product[]>) => {
      state.userProducts = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setUserProducts,
  setFilters,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer; 