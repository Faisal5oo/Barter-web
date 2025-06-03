import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from './store';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthInit } from './hooks/useAuthInit';

import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import AddProductPage from "./pages/AddProductPage";
import NearbyProductsPage from "./pages/NearbyProductsPage";
import BrowsePage from "./pages/BrowsePage";
import MyListingPage from "./pages/MyListingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ChatsPage from "./pages/ChatsPage";
import OffersPage from "./pages/OffersPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HelpPage from "./pages/HelpPage";
import SafetyPage from "./pages/SafetyPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";

const queryClient = new QueryClient();

// Component to initialize auth state
const AuthInitializer = () => {
  useAuthInit();
  return null;
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthInitializer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            
            {/* Public Routes - Anyone can access */}
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/categories/electronics" element={<CategoryPage />} />
            <Route path="/categories/furniture" element={<CategoryPage />} />
            <Route path="/categories/vehicles" element={<CategoryPage />} />
            <Route path="/nearby" element={<NearbyProductsPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/my-listings" element={
              <ProtectedRoute>
                <MyListingPage />
              </ProtectedRoute>
            } />
            <Route path="/my-listing" element={
              <ProtectedRoute>
                <MyListingPage />
              </ProtectedRoute>
            } />
            <Route path="/listings" element={
              <ProtectedRoute>
                <MyListingPage />
              </ProtectedRoute>
            } />
            <Route path="/my-offers" element={
              <ProtectedRoute>
                <OffersPage />
              </ProtectedRoute>
            } />
            <Route path="/offers" element={
              <ProtectedRoute>
                <OffersPage />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <ChatsPage />
              </ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
