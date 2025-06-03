import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, register, logout } from '../store/slices/authSlice';
import { 
  register as registerUser, 
  login as loginUser, 
  getCurrentUser, 
  getUserFromStorage,
  forgotPassword,
  logout as logoutUser,
  isAuthenticated 
} from '../services/useAuth';

export const authKeys = {
  all: ['auth'],
  user: () => [...authKeys.all, 'user'],
  currentUser: () => [...authKeys.user(), 'current'],
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useUserFromStorage = () => {
  return getUserFromStorage();
};

export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      dispatch(register({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        location: data.user.location || '',
      }));
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      navigate('/');
    },
    onError: (error) => {
      console.error('Registration failed:', error.message);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        location: data.user.location || '',
      }));
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      dispatch(logout());
      queryClient.clear();
      navigate('/');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      console.log('Password reset email sent:', data.message);
    },
    onError: (error) => {
      console.error('Forgot password failed:', error.message);
    },
  });
};

export const useIsAuthenticated = () => {
  return isAuthenticated();
}; 