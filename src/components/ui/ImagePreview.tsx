import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eye, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove?: () => void;
  onView?: () => void;
  isLoading?: boolean;
  isPrimary?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showActions?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  onRemove,
  onView,
  isLoading = false,
  isPrimary = false,
  className,
  size = 'md',
  showActions = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const sizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  const handleImageError = () => {
    if (!imageError && imageSrc !== '/placeholder.svg') {
      setImageError(true);
      setImageSrc('/placeholder.svg');
    }
  };

  // Update image source when src prop changes
  React.useEffect(() => {
    setImageSrc(src);
    setImageError(false);
  }, [src]);

  return (
    <div className={cn(
      'relative group rounded-lg overflow-hidden border bg-muted',
      sizeClasses[size],
      className
    )}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}

      {/* Image */}
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />

      {/* Primary badge */}
      {isPrimary && (
        <Badge 
          variant="default" 
          className="absolute top-1 left-1 text-xs px-1.5 py-0.5"
        >
          Cover
        </Badge>
      )}

      {/* Action buttons */}
      {showActions && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
          {onView && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onView}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePreview; 