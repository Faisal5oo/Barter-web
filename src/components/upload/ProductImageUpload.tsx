import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImagePreview from '@/components/ui/ImagePreview';
import { 
  validateImageFile, 
  formatFileSize, 
  uploadImagesWithSignedUrls,
  deleteImageFromR2 
} from '@/services/imageUpload';
import { Upload, ImageIcon, AlertCircle, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageUploadProps {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

interface UploadState {
  id: string;
  file: File;
  preview: string;
  uploadedUrl?: string;
  isUploading: boolean;
  progress: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  key?: string; // R2 key for deletion
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  imageUrls,
  onImagesChange,
  maxImages = 10,
  className,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStates, setUploadStates] = useState<UploadState[]>([]);
  const [globalError, setGlobalError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Progress callback for uploads
  const onUploadProgress = useCallback((fileId: string, status: 'uploading' | 'completed' | 'error') => {
    setUploadStates(prev => 
      prev.map(state => 
        state.id === fileId 
          ? { ...state, progress: status, isUploading: status === 'uploading' }
          : state
      )
    );
  }, []);

  // Process selected files and start immediate upload
  const handleFiles = async (files: File[]) => {
    setGlobalError('');
    
    // Check total image limit
    const totalImages = imageUrls.length + uploadStates.length + files.length;
    if (totalImages > maxImages) {
      setGlobalError(`Maximum ${maxImages} images allowed. You can add ${maxImages - imageUrls.length - uploadStates.length} more.`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    files.forEach(file => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      setGlobalError(errors.join('; '));
    }

    if (validFiles.length > 0) {
      // Create upload states for valid files with unique IDs
      const newUploadStates: UploadState[] = validFiles.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        isUploading: true,
        progress: 'uploading',
      }));

      setUploadStates(prev => [...prev, ...newUploadStates]);

      // Start upload immediately
      try {
        const uploadedUrls = await uploadImagesWithSignedUrls(
          validFiles,
          (index, status) => {
            const fileId = newUploadStates[index]?.id;
            if (fileId) {
              onUploadProgress(fileId, status);
            }
          }
        );

        // Filter out any failed uploads (null/undefined URLs)
        const successfulUrls = uploadedUrls.filter(url => url);
        
        if (successfulUrls.length > 0) {
          // Add successful uploads to final URLs immediately
          onImagesChange([...imageUrls, ...successfulUrls]);
        }

        // Remove completed uploads from states immediately after success
        // Clean up blob URLs to prevent memory leaks
        newUploadStates.forEach(state => {
          URL.revokeObjectURL(state.preview);
        });

        // Remove all upload states for this batch (both successful and failed)
        setUploadStates(prev => 
          prev.filter(state => !newUploadStates.some(newState => newState.id === state.id))
        );

        // Show success message if some uploads failed
        if (successfulUrls.length < validFiles.length) {
          const failedCount = validFiles.length - successfulUrls.length;
          setGlobalError(`${failedCount} image(s) failed to upload. ${successfulUrls.length} uploaded successfully.`);
        }

      } catch (error) {
        // Mark all uploads as failed and keep them in upload states for retry
        setUploadStates(prev => 
          prev.map(state => 
            newUploadStates.some(newState => newState.id === state.id)
              ? { ...state, isUploading: false, progress: 'error', error: error.message }
              : state
          )
        );
        setGlobalError(`Upload failed: ${error.message}`);
      }
    }
  };

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    onImagesChange(newUrls);
  };

  // Remove pending upload
  const removePendingUpload = (uploadState: UploadState) => {
    setUploadStates(prev => {
      const newStates = prev.filter(state => state.id !== uploadState.id);
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(uploadState.preview);
      return newStates;
    });
  };

  // Retry failed upload
  const retryUpload = async (uploadState: UploadState) => {
    setUploadStates(prev => 
      prev.map(state => 
        state.id === uploadState.id 
          ? { ...state, error: undefined, progress: 'uploading', isUploading: true }
          : state
      )
    );

    try {
      const uploadedUrls = await uploadImagesWithSignedUrls(
        [uploadState.file],
        (index, status) => onUploadProgress(uploadState.id, status)
      );

      if (uploadedUrls[0]) {
        // Add successful upload to final URLs immediately
        onImagesChange([...imageUrls, uploadedUrls[0]]);

        // Clean up blob URL and remove upload state immediately
        URL.revokeObjectURL(uploadState.preview);
        setUploadStates(prev => prev.filter(state => state.id !== uploadState.id));
      }
    } catch (error) {
      setUploadStates(prev => 
        prev.map(state => 
          state.id === uploadState.id 
            ? { ...state, isUploading: false, progress: 'error', error: error.message }
            : state
        )
      );
    }
  };

  const hasUploads = uploadStates.length > 0;
  const canUploadMore = imageUrls.length + uploadStates.length < maxImages;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Upload up to {maxImages} images. Images are uploaded directly to cloud storage.
          Supported formats: JPEG, PNG, GIF, WebP (max 50MB per file)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {canUploadMore && (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Drop images here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  {maxImages - imageUrls.length - uploadStates.length} more images allowed
                </p>
              </div>

              <Button 
                type="button" 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        {/* Global Error */}
        {globalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        {/* Upload Progress States */}
        {hasUploads && (
          <div className="space-y-3">
            <h4 className="font-medium">Uploading Images</h4>
            {uploadStates.map((uploadState) => (
              <div key={uploadState.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={uploadState.preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadState.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadState.file.size)}
                    </p>
                    
                    {/* Progress */}
                    <div className="flex items-center gap-2 mt-2">
                      {uploadState.progress === 'uploading' && (
                        <>
                          <div className="flex-1">
                            <Progress value={undefined} className="h-2" />
                          </div>
                          <span className="text-sm text-muted-foreground">Uploading...</span>
                        </>
                      )}
                      
                      {uploadState.progress === 'completed' && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Upload completed</span>
                        </>
                      )}
                      
                      {uploadState.progress === 'error' && (
                        <>
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">
                            {uploadState.error || 'Upload failed'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {uploadState.progress === 'error' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => retryUpload(uploadState)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {uploadState.progress !== 'completed' && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removePendingUpload(uploadState)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Images */}
        {imageUrls.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Uploaded Images ({imageUrls.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <ImagePreview
                  key={`uploaded-${index}`}
                  src={url}
                  alt={`Product image ${index + 1}`}
                  onRemove={() => removeUploadedImage(index)}
                  className="aspect-square"
                />
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {(imageUrls.length > 0 || hasUploads) && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {imageUrls.length} image(s) ready • {uploadStates.length} uploading
            </div>
            {imageUrls.length > 0 && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Images ready for product creation
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageUpload; 