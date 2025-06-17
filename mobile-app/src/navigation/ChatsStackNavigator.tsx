import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

const ChatsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Chats Screen</Text>
  </View>
);

export type ChatsStackParamList = {
  Chats: undefined;
};

const Stack = createStackNavigator<ChatsStackParamList>();

export const ChatsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={ChatsScreen} />
    </Stack.Navigator>
  );
}; 