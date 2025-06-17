import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export const HomeScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to BarterX!
        </Text>
        
        {user && (
          <Text variant="bodyLarge" style={styles.subtitle}>
            Hello, {user.name}!
          </Text>
        )}
        
        <Text variant="bodyMedium" style={styles.description}>
          Your marketplace for bartering and trading items.
        </Text>

        <Button
          mode="outlined"
          onPress={signOut}
          style={styles.button}
        >
          Sign Out
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  button: {
    marginTop: 16,
  },
}); 