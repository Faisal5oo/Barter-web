import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, typography } from '../../theme';
import { authService } from '../../services/authService';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setEmailSent(true);
      Alert.alert(
        'Email Sent!',
        'We\'ve sent you a password reset link. Please check your email.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      // In development, show success anyway
      if (__DEV__) {
        setEmailSent(true);
        Alert.alert(
          'Demo Mode',
          'In a real app, a password reset email would be sent to your email address.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to send reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={64} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              {emailSent
                ? 'We\'ve sent you a password reset link'
                : 'Enter your email address and we\'ll send you a link to reset your password'}
            </Text>
          </View>

          {/* Form */}
          <Card style={styles.formCard}>
            <View style={styles.formContent}>
              {!emailSent ? (
                <>
                  <TextInput
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    style={styles.input}
                    left={<TextInput.Icon icon="email-outline" />}
                  />

                  <Button
                    mode="contained"
                    onPress={handleResetPassword}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.resetButton}
                    labelStyle={styles.buttonLabel}
                  >
                    Send Reset Link
                  </Button>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
                  <Text style={styles.successTitle}>Email Sent!</Text>
                  <Text style={styles.successDescription}>
                    Check your email for a password reset link. If you don't see it, check your spam folder.
                  </Text>
                  
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    style={styles.resendButton}
                    labelStyle={styles.resendButtonLabel}
                  >
                    Send Another Email
                  </Button>
                </View>
              )}

              <Button
                mode="text"
                onPress={handleBackToLogin}
                style={styles.backButton}
                labelStyle={styles.backButtonLabel}
                icon="arrow-left"
              >
                Back to Sign In
              </Button>
            </View>
          </Card>

          {/* Help Section */}
          <Card style={styles.helpCard}>
            <View style={styles.helpContent}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.info} />
              <View style={styles.helpText}>
                <Text style={styles.helpTitle}>Need Help?</Text>
                <Text style={styles.helpDescription}>
                  If you're having trouble resetting your password, contact our support team for assistance.
                </Text>
              </View>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing.lg,
  },
  formContent: {
    padding: spacing.lg,
  },
  input: {
    marginBottom: spacing.lg,
    backgroundColor: theme.colors.background,
  },
  resetButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successTitle: {
    ...typography.h3,
    color: theme.colors.success,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  successDescription: {
    ...typography.body,
    color: theme.colors.onSurface,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  resendButton: {
    borderColor: theme.colors.primary,
    marginBottom: spacing.lg,
  },
  resendButtonLabel: {
    color: theme.colors.primary,
  },
  backButton: {
    alignSelf: 'center',
  },
  backButtonLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  helpCard: {
    backgroundColor: theme.colors.info + '10',
    borderColor: theme.colors.info,
    borderWidth: 1,
  },
  helpContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  helpText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  helpTitle: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.info,
    marginBottom: spacing.xs,
  },
  helpDescription: {
    ...typography.caption,
    color: theme.colors.info,
    opacity: 0.8,
    lineHeight: 18,
  },
});

export default ForgotPasswordScreen; 