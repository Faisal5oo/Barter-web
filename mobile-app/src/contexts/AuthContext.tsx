import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check if user is already logged in on app start
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          dispatch(loginSuccess({ user: currentUser, token: 'existing_token' }));
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 