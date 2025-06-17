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
import { TextInput, Button, Card, Checkbox, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, typography } from '../../theme';
import { authService } from '../../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      Alert.alert('Error', 'Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      dispatch(loginSuccess(response));
      
      Alert.alert(
        'Welcome to BarterX!',
        'Your account has been created successfully.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert('Coming Soon', 'Google signup will be available soon!');
  };

  const handleFacebookSignup = () => {
    Alert.alert('Coming Soon', 'Facebook signup will be available soon!');
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
            <View style={styles.logoContainer}>
              <Ionicons name="bag-outline" size={40} color={theme.colors.secondary} />
              <Text style={styles.logoText}>
                Barter<Text style={styles.logoAccent}>X</Text>
              </Text>
            </View>
            <Text style={styles.subtitle}>
              Join the community and start trading today!
            </Text>
          </View>

          {/* Registration Form */}
          <Card style={styles.formCard}>
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>Create Account</Text>

              <TextInput
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                mode="outlined"
                autoCapitalize="words"
                autoComplete="name"
                style={styles.input}
                left={<TextInput.Icon icon="account-outline" />}
              />

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" />}
              />

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoComplete="password-new"
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TextInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                autoComplete="password-new"
                style={styles.input}
                left={<TextInput.Icon icon="lock-check-outline" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Checkbox
                  status={agreeToTerms ? 'checked' : 'unchecked'}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                />
                <View style={styles.termsText}>
                  <Text style={styles.termsLabel}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                style={styles.registerButton}
                labelStyle={styles.buttonLabel}
              >
                Create Account
              </Button>

              <Divider style={styles.divider} />

              {/* Social Registration */}
              <View style={styles.socialSection}>
                <Text style={styles.socialTitle}>Or sign up with</Text>
                
                <View style={styles.socialButtons}>
                  <Button
                    mode="outlined"
                    onPress={handleGoogleSignup}
                    style={styles.socialButton}
                    icon="google"
                    labelStyle={styles.socialButtonLabel}
                  >
                    Google
                  </Button>
                  
                  <Button
                    mode="outlined"
                    onPress={handleFacebookSignup}
                    style={styles.socialButton}
                    icon="facebook"
                    labelStyle={styles.socialButtonLabel}
                  >
                    Facebook
                  </Button>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Sign In Link */}
              <View style={styles.signinSection}>
                <Text style={styles.signinText}>Already have an account? </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.goBack()}
                  labelStyle={styles.signinButtonLabel}
                  compact
                >
                  Sign In
                </Button>
              </View>
            </View>
          </Card>

          {/* Benefits */}
          <Card style={styles.benefitsCard}>
            <View style={styles.benefitsContent}>
              <Text style={styles.benefitsTitle}>Why join BarterX?</Text>
              
              <View style={styles.benefitItem}>
                <Ionicons name="swap-horizontal" size={20} color={theme.colors.primary} />
                <Text style={styles.benefitText}>Trade items you don't need for things you want</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <Ionicons name="shield-checkmark" size={20} color={theme.colors.success} />
                <Text style={styles.benefitText}>Safe and secure trading platform</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <Ionicons name="people" size={20} color={theme.colors.tertiary} />
                <Text style={styles.benefitText}>Connect with local traders in your area</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    ...typography.h2,
    marginLeft: spacing.sm,
    color: theme.colors.onSurface,
  },
  logoAccent: {
    color: theme.colors.tertiary,
  },
  subtitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    textAlign: 'center',
    opacity: 0.7,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing.lg,
  },
  formContent: {
    padding: spacing.lg,
  },
  formTitle: {
    ...typography.h2,
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.background,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  termsText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  termsLabel: {
    ...typography.caption,
    color: theme.colors.onSurface,
    lineHeight: 20,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: spacing.xs,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    marginVertical: spacing.lg,
  },
  socialSection: {
    alignItems: 'center',
  },
  socialTitle: {
    ...typography.body,
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  socialButton: {
    flex: 1,
    borderColor: theme.colors.outline,
  },
  socialButtonLabel: {
    color: theme.colors.onSurface,
  },
  signinSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signinText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  signinButtonLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  benefitsCard: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  benefitsContent: {
    padding: spacing.md,
  },
  benefitsTitle: {
    ...typography.h3,
    color: theme.colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefitText: {
    ...typography.body,
    color: theme.colors.onSurface,
    marginLeft: spacing.md,
    flex: 1,
  },
});

export default RegisterScreen; 