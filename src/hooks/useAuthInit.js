import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { getUserFromStorage, isAuthenticated } from '../services/useAuth';

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getUserFromStorage();
      if (userData && userData.user) {
        dispatch(login({
          id: userData.user.id,
          name: userData.user.name,
          email: userData.user.email,
          location: userData.user.location || '',
        }));
      }
    }
  }, [dispatch]);
}; 