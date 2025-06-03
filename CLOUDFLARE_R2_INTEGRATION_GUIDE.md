# Cloudflare R2 Image Upload Integration Guide

## 🎯 Overview

This guide covers the complete integration of Cloudflare R2 image upload functionality for your BarterX application. The implementation includes both product image uploads (multiple files) and profile image uploads (single file) with seamless cloud storage integration.

## 🚀 Features Implemented

### ✅ Product Image Upload
- **Multi-file upload** (up to 10 images)
- **Drag & drop interface** with visual feedback
- **Real-time validation** (file type, size, count)
- **Upload progress tracking** with retry functionality
- **Image preview grid** with delete options
- **Cloud storage integration** via Cloudflare R2

### ✅ Profile Image Upload
- **Single image upload** with instant preview
- **Automatic profile update** via backend API
- **Real-time UI updates** using React Query
- **Camera overlay** for intuitive UX
- **Fallback avatar** for users without profile pictures

### ✅ Technical Features
- **File validation** (JPEG, PNG, GIF, WebP, max 50MB)
- **Error handling** with user-friendly messages
- **Memory management** (automatic URL cleanup)
- **Authentication** via JWT tokens
- **React Query integration** for cache management

## 🛠 Components Created

### 1. Core Services

#### `src/services/imageUpload.js`
```javascript
// Main functions:
- uploadImages(files)        // Multi-file upload
- uploadSingleImage(file)    // Single file upload
- updateProfileImage(url)    // Update user profile
- validateImageFile(file)    // Client-side validation
- formatFileSize(bytes)      // Human-readable file sizes
```

### 2. React Query Hooks

#### `src/hooks/useImageUpload.js`
```javascript
// Available hooks:
- useUploadImages()                    // Product image uploads
- useUploadSingleImage()               // Single image upload
- useUpdateProfileImage()              // Profile image update
- useUploadAndUpdateProfileImage()     // Combined upload + update
```

### 3. UI Components

#### `src/components/ui/ImagePreview.tsx`
Reusable image preview component with:
- Loading states and error handling
- Delete and view actions
- Primary image badge
- Configurable sizes (sm, md, lg)

#### `src/components/upload/ProductImageUpload.tsx`
Full-featured product image upload with:
- Drag & drop functionality
- Multiple file selection
- Upload progress tracking
- Image preview grid
- File validation and error handling

#### `src/components/upload/ProfileImageUpload.tsx`
Profile picture upload component with:
- Avatar display with camera overlay
- Single file selection
- Real-time preview
- Automatic profile update

## 📁 File Structure

```
src/
├── services/
│   └── imageUpload.js              # Core upload service
├── hooks/
│   └── useImageUpload.js           # React Query hooks
├── components/
│   ├── ui/
│   │   └── ImagePreview.tsx        # Reusable image preview
│   └── upload/
│       ├── ProductImageUpload.tsx  # Product image upload
│       └── ProfileImageUpload.tsx  # Profile image upload
└── pages/
    ├── AddProductPage.tsx          # Updated with new component
    └── ImageUploadDemoPage.tsx     # Demo/testing page
```

## 🔌 Backend API Integration

### Required Endpoints

#### 1. Image Upload
```http
POST /api/images/upload
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

Request Body:
- FormData with 'images' field containing File objects

Response:
{
  "success": true,
  "imageUrls": [
    "https://r2-bucket.domain.com/image1.jpg",
    "https://r2-bucket.domain.com/image2.jpg"
  ]
}
```

#### 2. Profile Image Update
```http
PUT /api/users/profile-image/update
Content-Type: application/json
Authorization: Bearer {jwt_token}

Request Body:
{
  "profileImage": "https://r2-bucket.domain.com/profile.jpg"
}

Response:
{
  "success": true,
  "user": { /* updated user object */ }
}
```

#### 3. Product Creation (Updated)
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer {jwt_token}

Request Body:
{
  "title": "Product Title",
  "description": "Product description",
  "category": "Electronics",
  "images": [
    "https://r2-bucket.domain.com/product1.jpg",
    "https://r2-bucket.domain.com/product2.jpg"
  ],
  // ... other product fields
}
```

## 🎨 Usage Examples

### 1. Product Image Upload (in AddProductPage)

```tsx
import ProductImageUpload from '@/components/upload/ProductImageUpload';

const AddProductPage = () => {
  const [images, setImages] = useState<string[]>([]);

  return (
    <ProductImageUpload
      imageUrls={images}
      onImagesChange={setImages}
      maxImages={10}
    />
  );
};
```

### 2. Profile Image Upload (in Profile/Settings page)

```tsx
import ProfileImageUpload from '@/components/upload/ProfileImageUpload';

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const handleImageUpdate = (newImageUrl: string) => {
    // Optional: additional handling after upload
    console.log('Profile image updated:', newImageUrl);
  };

  return (
    <ProfileImageUpload
      currentImageUrl={user?.profileImage}
      userName={user?.name}
      onImageUpdate={handleImageUpdate}
    />
  );
};
```

### 3. Using Image Preview Component

```tsx
import ImagePreview from '@/components/ui/ImagePreview';

const ImageGrid = ({ images, onRemove }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((url, index) => (
        <ImagePreview
          key={url}
          src={url}
          alt={`Image ${index + 1}`}
          isPrimary={index === 0}
          onRemove={() => onRemove(index)}
          size="lg"
        />
      ))}
    </div>
  );
};
```

## 🧪 Testing

### Demo Page
A comprehensive demo page is available at `/image-upload-demo` that showcases:
- Both upload components in action
- Real-time URL display
- Technical implementation details
- Usage instructions

### Manual Testing Checklist

#### Product Image Upload:
- [ ] Drag & drop multiple files
- [ ] Click to select files
- [ ] File validation (type, size, count)
- [ ] Upload progress indication
- [ ] Error handling and retry
- [ ] Image removal functionality
- [ ] Integration with product creation

#### Profile Image Upload:
- [ ] Single file selection
- [ ] Real-time preview
- [ ] Upload and profile update
- [ ] Error handling
- [ ] UI state management

## 🛡 Error Handling

### Client-Side Validation
- **File Type**: Only JPEG, PNG, GIF, WebP allowed
- **File Size**: Maximum 50MB per file
- **File Count**: Maximum 10 images for products
- **Total Limit**: Prevents exceeding maximum images

### Network Error Handling
- **Upload Failures**: Automatic retry buttons
- **Authentication Errors**: Redirects handled by axios interceptors
- **Network Timeouts**: User-friendly error messages
- **Server Errors**: Specific error message display

### User Feedback
- **Toast Notifications**: Success and error messages
- **Loading States**: Visual indicators during uploads
- **Progress Tracking**: Real-time upload status
- **Validation Messages**: Clear error descriptions

## 🔧 Configuration

### File Validation Settings
```javascript
// In src/services/imageUpload.js
const maxSize = 50 * 1024 * 1024; // 50MB
const allowedTypes = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp'
];
```

### Component Customization
```tsx
// ProductImageUpload props
<ProductImageUpload
  imageUrls={[]}           // Current image URLs
  onImagesChange={fn}      // Callback for URL changes
  maxImages={10}           // Maximum image count
  className="custom-class" // Additional styling
/>

// ProfileImageUpload props
<ProfileImageUpload
  currentImageUrl=""       // Current profile image
  userName="User"          // Display name
  onImageUpdate={fn}       // Callback after update
  className="custom-class" // Additional styling
/>
```

## 🚀 Deployment Notes

### Environment Setup
1. Ensure backend Cloudflare R2 integration is configured
2. Set up proper CORS settings for file uploads
3. Configure JWT authentication endpoints
4. Test file upload endpoints in development

### Production Considerations
- **File Size Limits**: Adjust based on hosting requirements
- **Upload Timeouts**: Configure reasonable timeout values
- **Error Monitoring**: Implement proper logging
- **Performance**: Consider image compression/optimization

## 📋 Integration Checklist

### ✅ Completed
- [x] Image upload service implementation
- [x] React Query hooks for state management
- [x] Reusable UI components
- [x] Product creation page integration
- [x] Profile image upload component
- [x] Error handling and validation
- [x] Demo page for testing

### 🔄 Next Steps (Optional)
- [ ] Image compression before upload
- [ ] Drag & drop for profile images
- [ ] Bulk image operations
- [ ] Image editing capabilities
- [ ] Upload progress for large files
- [ ] Image optimization settings

## 🎯 Key Benefits

1. **Seamless UX**: Drag & drop with real-time feedback
2. **Robust Validation**: Client-side validation prevents errors
3. **Error Recovery**: Retry mechanisms for failed uploads
4. **Performance**: React Query caching and state management
5. **Scalability**: Cloud storage with public URLs
6. **Security**: JWT-based authentication
7. **Maintainability**: Modular, reusable components

The image upload system is now fully integrated and ready for production use! 🎉 