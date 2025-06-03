import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUploadAndUpdateProfileImage } from '@/hooks/useImageUpload';
import { validateImageFile, formatFileSize } from '@/services/imageUpload';
import { Upload, Camera, AlertCircle, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  userName?: string;
  onImageUpdate?: (newImageUrl: string) => void;
  className?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  userName = 'User',
  onImageUpdate,
  className,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadAndUpdateProfileImage();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const newImageUrl = await uploadMutation.mutateAsync(selectedFile);
      
      // Clean up
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl('');
      
      // Notify parent component
      if (onImageUpdate) {
        onImageUpdate(newImageUrl);
      }
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  // Cancel selection
  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get display image URL
  const displayImageUrl = previewUrl || currentImageUrl;
  const hasChanges = !!selectedFile;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Upload a new profile picture. JPEG, PNG, GIF, and WebP formats supported. Max 50MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Current/Preview Image */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={displayImageUrl} alt={userName} />
              <AvatarFallback className="text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            {/* Upload overlay button */}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* File input */}
          <Input
            ref={fileInputRef}
            id="profile-image-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload button */}
          <div className="flex flex-col items-center space-y-2">
            <Label htmlFor="profile-image-upload" asChild>
              <Button 
                type="button" 
                variant="outline"
                disabled={uploadMutation.isPending}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose New Picture
              </Button>
            </Label>
            
            {!currentImageUrl && !hasChanges && (
              <p className="text-sm text-muted-foreground">No profile picture set</p>
            )}
          </div>
        </div>

        {/* File info and actions */}
        {selectedFile && (
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Selected File</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium">Name:</span> {selectedFile.name}</p>
                <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
                <p><span className="font-medium">Type:</span> {selectedFile.type}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                size="sm"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Update Profile Picture'
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={uploadMutation.isPending}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Upload status */}
        {uploadMutation.isPending && (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Uploading your new profile picture...</p>
          </div>
        )}

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
          <p className="font-medium mb-2">Tips for a great profile picture:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use a clear, well-lit photo of yourself</li>
            <li>Square images work best (they'll be cropped to a circle)</li>
            <li>Avoid busy backgrounds</li>
            <li>Make sure your face is clearly visible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageUpload; 