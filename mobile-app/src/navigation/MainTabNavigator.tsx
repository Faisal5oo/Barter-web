import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import { HomeStackNavigator } from './HomeStackNavigator';
import { BrowseStackNavigator } from './BrowseStackNavigator';
import { ChatsStackNavigator } from './ChatsStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import AddProductScreen from '../screens/product/AddProductScreen';

export type MainTabParamList = {
  HomeStack: undefined;
  BrowseStack: undefined;
  AddProduct: undefined;
  ChatsStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          if (route.name === 'HomeStack') {
            iconName = 'home';
          } else if (route.name === 'BrowseStack') {
            iconName = 'search';
          } else if (route.name === 'AddProduct') {
            iconName = 'add-circle';
          } else if (route.name === 'ChatsStack') {
            iconName = 'chat';
          } else if (route.name === 'ProfileStack') {
            iconName = 'person';
          } else {
            iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="BrowseStack" 
        component={BrowseStackNavigator}
        options={{ title: 'Browse' }}
      />
      <Tab.Screen 
        name="AddProduct" 
        component={AddProductScreen}
        options={{ 
          title: 'Add Item',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? 'add-circle' : 'add-circle-outline'} 
              size={32} 
              color={color} 
              style={{ marginBottom: -3 }}
            />
          )
        }}
      />
      <Tab.Screen 
        name="ChatsStack" 
        component={ChatsStackNavigator}
        options={{ title: 'Chats' }}
      />
      <Tab.Screen 
        name="ProfileStack" 
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}; 