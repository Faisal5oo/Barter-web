import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0ea5e9', // marketplace-blue
    secondary: '#f59e0b', // marketplace-amber
    tertiary: '#14b8a6', // marketplace-teal
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#ffffff',
    onBackground: '#0f172a',
    onSurface: '#334155',
    outline: '#e2e8f0',
    outlineVariant: '#f1f5f9',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0ea5e9',
    secondary: '#f59e0b',
    tertiary: '#14b8a6',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    background: '#0f172a',
    onBackground: '#f8fafc',
    onSurface: '#e2e8f0',
    outline: '#475569',
    outlineVariant: '#334155',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
};

export const theme = lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  padding: {
    padding: 16,
  },
  marginVertical: {
    marginVertical: 8,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  borderRadius: {
    borderRadius: 8,
  },
}; 