import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImages, uploadSingleImage, updateProfileImage } from '../services/imageUpload';
import { useToast } from '@/components/ui/use-toast';

// Hook for uploading multiple images (for products)
export const useUploadImages = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (files) => uploadImages(files),
    onSuccess: (imageUrls) => {
      toast({
        title: 'Success',
        description: `${imageUrls.length} image(s) uploaded successfully!`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook for uploading a single image (for profile pictures)
export const useUploadSingleImage = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (file) => uploadSingleImage(file),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Image uploaded successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook for updating profile image
export const useUpdateProfileImage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (imageUrl) => updateProfileImage(imageUrl),
    onSuccess: () => {
      // Invalidate user queries to refresh profile data
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast({
        title: 'Success',
        description: 'Profile image updated successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Combined hook for profile image upload and update
export const useUploadAndUpdateProfileImage = () => {
  const uploadMutation = useUploadSingleImage();
  const updateMutation = useUpdateProfileImage();
  const { toast } = useToast();
  
  const uploadAndUpdate = async (file) => {
    try {
      // First upload the image
      const imageUrl = await uploadMutation.mutateAsync(file);
      
      // Then update the profile
      await updateMutation.mutateAsync(imageUrl);
      
      return imageUrl;
    } catch (error) {
      // Error handling is done in individual mutations
      throw error;
    }
  };
  
  return {
    mutateAsync: uploadAndUpdate,
    isPending: uploadMutation.isPending || updateMutation.isPending,
    isError: uploadMutation.isError || updateMutation.isError,
    error: uploadMutation.error || updateMutation.error,
  };
}; 