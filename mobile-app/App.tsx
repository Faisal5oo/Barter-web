import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { lightTheme } from './src/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={lightTheme}>
            <SafeAreaProvider>
              <NavigationContainer>
                <AuthProvider>
      <StatusBar style="auto" />
                  <AppNavigator />
                </AuthProvider>
              </NavigationContainer>
            </SafeAreaProvider>
          </PaperProvider>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
