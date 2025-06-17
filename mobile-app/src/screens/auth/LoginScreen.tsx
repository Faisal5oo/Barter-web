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
import { TextInput, Button, Card, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, typography } from '../../theme';
import { authService } from '../../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const response = await authService.login({ email, password });
      dispatch(loginSuccess(response));
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Coming Soon', 'Google login will be available soon!');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Coming Soon', 'Facebook login will be available soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="bag-outline" size={48} color={theme.colors.secondary} />
              <Text style={styles.logoText}>
                Barter<Text style={styles.logoAccent}>X</Text>
              </Text>
            </View>
            <Text style={styles.subtitle}>
              Welcome back! Sign in to continue trading.
            </Text>
          </View>

          {/* Login Form */}
          <Card style={styles.formCard}>
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>Sign In</Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoComplete="password"
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                labelStyle={styles.buttonLabel}
              >
                Sign In
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword' as never)}
                style={styles.forgotButton}
                labelStyle={styles.forgotButtonLabel}
              >
                Forgot Password?
              </Button>

              <Divider style={styles.divider} />

              {/* Social Login */}
              <View style={styles.socialSection}>
                <Text style={styles.socialTitle}>Or continue with</Text>
                
                <View style={styles.socialButtons}>
                  <Button
                    mode="outlined"
                    onPress={handleGoogleLogin}
                    style={styles.socialButton}
                    icon="google"
                    labelStyle={styles.socialButtonLabel}
                  >
                    Google
                  </Button>
                  
                  <Button
                    mode="outlined"
                    onPress={handleFacebookLogin}
                    style={styles.socialButton}
                    icon="facebook"
                    labelStyle={styles.socialButtonLabel}
                  >
                    Facebook
                  </Button>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Sign Up Link */}
              <View style={styles.signupSection}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Register' as never)}
                  labelStyle={styles.signupButtonLabel}
                  compact
                >
                  Sign Up
                </Button>
              </View>
            </View>
          </Card>

          {/* Demo Account Info */}
          <Card style={styles.demoCard}>
            <View style={styles.demoContent}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.info} />
              <View style={styles.demoText}>
                <Text style={styles.demoTitle}>Demo Account</Text>
                <Text style={styles.demoDescription}>
                  Use any email and password to try the app
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
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    ...typography.h1,
    marginLeft: spacing.md,
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
  loginButton: {
    backgroundColor: theme.colors.primary,
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotButton: {
    marginTop: spacing.sm,
  },
  forgotButtonLabel: {
    color: theme.colors.primary,
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
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signupText: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  signupButtonLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  demoCard: {
    backgroundColor: theme.colors.info + '10',
    borderColor: theme.colors.info,
    borderWidth: 1,
  },
  demoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  demoText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  demoTitle: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.info,
    marginBottom: spacing.xs,
  },
  demoDescription: {
    ...typography.caption,
    color: theme.colors.info,
    opacity: 0.8,
  },
});

export default LoginScreen; 