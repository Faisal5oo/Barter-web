import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import BrowseScreen from '../screens/main/BrowseScreen';
import AddProductScreen from '../screens/main/AddProductScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import MessagesScreen from '../screens/main/MessagesScreen';

// Product Screens
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import EditProductScreen from '../screens/product/EditProductScreen';
import FavoritesScreen from '../screens/product/FavoritesScreen';

export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  
  // Main App
  MainTabs: undefined;
  
  // Product
  ProductDetail: { productId: string };
  EditProduct: { productId: string };
  Favorites: undefined;
};

export type TabParamList = {
  Home: undefined;
  Browse: undefined;
  AddProduct: undefined;
  Messages: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Browse') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'AddProduct') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add Item' }} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0ea5e9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Create Account' }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ title: 'Reset Password' }}
          />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen} 
            options={{ title: 'Product Details' }}
          />
          <Stack.Screen 
            name="EditProduct" 
            component={EditProductScreen} 
            options={{ title: 'Edit Product' }}
          />
          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{ title: 'My Favorites' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}; 