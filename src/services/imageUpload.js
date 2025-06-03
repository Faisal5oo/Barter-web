import { axiosInstanceWeb } from '../lib/axiosInstance';

// Generate signed URLs for direct R2 upload
export const getSignedUrls = async (fileCount) => {
  try {
    const response = await axiosInstanceWeb.post('/images/signed-urls', {
      count: fileCount
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to generate signed URLs');
    }

    return response.data.signedUrls; // Array of {uploadUrl, publicUrl, fileName, key}
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Failed to generate signed URLs');
  }
};

// Upload file directly to R2 using signed URL
export const uploadToR2 = async (file, signedUrl) => {
  try {
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    return response.ok;
  } catch (error) {
    console.error('R2 upload error:', error);
    return false;
  }
};

// Delete image from R2
export const deleteImageFromR2 = async (imageKey) => {
  try {
    const response = await axiosInstanceWeb.delete('/images/delete', {
      data: { key: imageKey }
    });

    return response.data.success;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete image');
  }
};

// Upload multiple images using signed URLs (new primary method)
export const uploadImagesWithSignedUrls = async (files, onProgress) => {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  // Validate files
  const maxSize = 50 * 1024 * 1024; // 50MB per file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  for (const file of files) {
    if (file.size > maxSize) {
      throw new Error(`File ${file.name} exceeds 50MB size limit`);
    }
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File ${file.name} has unsupported format. Only JPEG, PNG, GIF, and WebP are allowed`);
    }
  }

  try {
    // Step 1: Get signed URLs
    const signedUrls = await getSignedUrls(files.length);
    
    // Step 2: Upload each file to R2
    const uploadPromises = files.map(async (file, index) => {
      const signedUrl = signedUrls[index];
      
      if (onProgress) {
        onProgress(index, 'uploading');
      }
      
      const success = await uploadToR2(file, signedUrl.uploadUrl);
      
      if (onProgress) {
        onProgress(index, success ? 'completed' : 'error');
      }
      
      return {
        success,
        publicUrl: success ? signedUrl.publicUrl : null,
        fileName: signedUrl.fileName,
        key: signedUrl.key,
        originalFile: file
      };
    });

    const results = await Promise.all(uploadPromises);
    
    // Return only successful uploads
    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);
    
    if (failedUploads.length > 0) {
      console.warn(`${failedUploads.length} uploads failed`);
    }
    
    if (successfulUploads.length === 0) {
      throw new Error('All uploads failed');
    }
    
    return successfulUploads.map(upload => upload.publicUrl);
  } catch (error) {
    throw new Error(error.message || 'Failed to upload images');
  }
};

// Legacy method for backward compatibility (now uses signed URLs internally)
export const uploadImages = async (files) => {
  return uploadImagesWithSignedUrls(files);
};

// Upload single image using signed URL
export const uploadSingleImageWithSignedUrl = async (file, onProgress) => {
  const urls = await uploadImagesWithSignedUrls([file], onProgress);
  return urls[0];
};

// Legacy single upload method
export const uploadSingleImage = async (file) => {
  return uploadSingleImageWithSignedUrl(file);
};

// Update user profile image
export const updateProfileImage = async (imageUrl) => {
  try {
    const response = await axiosInstanceWeb.put('/users/profile-image/update', {
      profileImage: imageUrl
    });

    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update profile image');
  }
};

// Validate image file
export const validateImageFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file format. Only JPEG, PNG, GIF, and WebP are allowed' };
  }
  
  return { valid: true };
};

// Get file size in human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 