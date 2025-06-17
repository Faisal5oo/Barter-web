import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

const BrowseScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Browse Screen</Text>
  </View>
);

export type BrowseStackParamList = {
  Browse: undefined;
};

const Stack = createStackNavigator<BrowseStackParamList>();

export const BrowseStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Browse" component={BrowseScreen} />
    </Stack.Navigator>
  );
}; 