import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoritesService } from '@/services/favoritesService';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export const useFavorites = () => {
  const { user } = useSelector((state) => state.auth);
  
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => FavoritesService.getUserFavorites(user?.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCheckFavorite = (productId) => {
  const { user } = useSelector((state) => state.auth);
  
  return useQuery({
    queryKey: ['favorite-check', productId, user?.id],
    queryFn: () => FavoritesService.checkIfFavorite(productId, user?.id),
    enabled: !!user?.id && !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  return useMutation({
    mutationFn: async ({ productId, isFavorite }) => {
      if (isFavorite) {
        return FavoritesService.removeFromFavorites(productId, user?.id);
      } else {
        return FavoritesService.addToFavorites(productId, user?.id);
      }
    },
    onSuccess: (data, variables) => {
      // Update the favorite check query
      queryClient.setQueryData(
        ['favorite-check', variables.productId, user?.id],
        !variables.isFavorite
      );
      
      // Invalidate and refetch favorites list
      queryClient.invalidateQueries(['favorites', user?.id]);
      
      // Show success message
      toast.success(
        variables.isFavorite 
          ? 'Removed from favorites' 
          : 'Added to favorites'
      );
    },
    onError: (error, variables) => {
      console.error('Error toggling favorite:', error);
      toast.error(
        variables.isFavorite 
          ? 'Failed to remove from favorites' 
          : 'Failed to add to favorites'
      );
    },
  });
}; 