import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Eye, Clock, MapPin, Star, Edit, Trash2, Smartphone, Monitor, Car, Sofa, ShoppingBag, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    description?: string;
    category: string;
    condition?: string;
    images?: string[];
    location: string;
    views?: number;
    createdAt: string;
    isFavorited?: boolean;
    distance?: string | number;
    listedBy?: {
      _id?: string;
      id?: string;
      name?: string;
      rating?: number;
    };
    exchangePreferences?: {
      barter?: boolean;
      cash?: boolean;
      cashOption?: boolean;
      estimatedValue?: number;
      minPrice?: number;
      maxPrice?: number;
      price?: number;
    };
  };
  currentUserId?: string;
  onToggleFavorite?: (productId: string) => void;
  onView?: (productId: string) => void;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  showOwnerActions?: boolean;
  className?: string;
  imageClassName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentUserId,
  onToggleFavorite,
  onView,
  onEdit,
  onDelete,
  showOwnerActions = false,
  className,
  imageClassName,
}) => {
  const [imageError, setImageError] = useState(false);

  // Check if current user is the owner
  const isOwner = currentUserId && (
    currentUserId === product.listedBy?._id || 
    currentUserId === product.listedBy?.id
  );

  // Get category icon
  const getCategoryIcon = () => {
    const category = product.category?.toLowerCase() || '';
    if (category.includes('electronics') || category.includes('phone') || category.includes('mobile')) {
      return <Smartphone className="h-8 w-8 text-muted-foreground" />;
    }
    if (category.includes('computer') || category.includes('laptop') || category.includes('monitor')) {
      return <Monitor className="h-8 w-8 text-muted-foreground" />;
    }
    if (category.includes('vehicle') || category.includes('car') || category.includes('bike')) {
      return <Car className="h-8 w-8 text-muted-foreground" />;
    }
    if (category.includes('furniture') || category.includes('chair') || category.includes('table')) {
      return <Sofa className="h-8 w-8 text-muted-foreground" />;
    }
    return <ShoppingBag className="h-8 w-8 text-muted-foreground" />;
  };

  // Format price range display
  const formatPriceRange = () => {
    const prefs = product.exchangePreferences;
    if (!prefs) return null;

    // Check if cash is accepted
    if (!prefs.cash && !prefs.cashOption) return null;

    const minPrice = prefs.minPrice;
    const maxPrice = prefs.maxPrice;
    const singlePrice = prefs.price || prefs.estimatedValue;

    if (minPrice && maxPrice && minPrice !== maxPrice) {
      return `PKR ${Number(minPrice).toLocaleString()} - ${Number(maxPrice).toLocaleString()}`;
    } else if (singlePrice) {
      return `PKR ${Number(singlePrice).toLocaleString()}`;
    } else if (minPrice) {
      return `From PKR ${Number(minPrice).toLocaleString()}`;
    } else if (maxPrice) {
      return `Up to PKR ${Number(maxPrice).toLocaleString()}`;
    }
    
    return null;
  };

  // Format location to remove coordinates
  const formatLocation = (location: string) => {
    if (!location) return 'Location not specified';
    
    // Remove coordinates pattern like "Coordinates: 11.4704, 24.4161"
    const cleanLocation = location.replace(/Coordinates:\s*-?\d+\.?\d*,\s*-?\d+\.?\d*/g, '').trim();
    
    // Remove any trailing commas or extra spaces
    return cleanLocation.replace(/,\s*$/, '').trim() || 'Location not specified';
  };

  // Truncate description
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleCardClick = () => {
    if (onView) {
      onView(product._id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product._id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(product._id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(product._id);
    }
  };

  const imageUrl = product.images?.[0];
  const priceRange = formatPriceRange();

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200 overflow-hidden", className)}>
      <Link to={`/product/${product._id}`} onClick={handleCardClick} className="block">
        {/* Image Section */}
        <div className={cn("aspect-[4/3] overflow-hidden relative", imageClassName)}>
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              {getCategoryIcon()}
            </div>
          )}
          
          {/* Distance Badge */}
          {product.distance && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              {typeof product.distance === 'number' ? `${product.distance} mi` : product.distance}
            </Badge>
          )}
          
          {/* Price Badge */}
          {priceRange && (
            <Badge variant="default" className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
              <DollarSign className="h-3 w-3 mr-1" />
              {priceRange}
            </Badge>
          )}
          
          {/* Favorite Button */}
          {onToggleFavorite && !priceRange && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white h-8 w-8 p-0"
              onClick={handleFavoriteClick}
            >
              <Heart className={cn("h-4 w-4", product.isFavorited ? 'fill-red-500 text-red-500' : '')} />
            </Button>
          )}

          {/* Owner Actions */}
          {showOwnerActions && isOwner && (
            <div className="absolute top-2 right-2 flex gap-1">
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/80 hover:bg-white h-8 w-8 p-0"
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/80 hover:bg-white h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </Link>
      
      {/* Content Section */}
      <CardContent className="p-4">
        {/* Category and Condition Badges */}
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs font-normal">
            {product.category}
          </Badge>
          {product.condition && (
            <Badge variant={product.condition === "New" ? "default" : "secondary"} className="text-xs">
              {product.condition}
            </Badge>
          )}
        </div>
        
        {/* Title */}
        <Link to={`/product/${product._id}`} onClick={handleCardClick}>
          <h3 className="font-medium line-clamp-1 mb-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        {/* Price Range Display */}
        {priceRange && (
          <div className="flex items-center gap-1 mb-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">{priceRange}</span>
          </div>
        )}
        
        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {truncateDescription(product.description)}
          </p>
        )}
        
        {/* Location */}
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{formatLocation(product.location)}</span>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{product.views || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Bottom Row - Owner and Exchange Options */}
        <div className="flex items-center justify-between pt-2 border-t">
          {/* Owner Info */}
          <div className="flex items-center gap-1 text-xs min-w-0 flex-1">
            {product.listedBy?.rating && (
              <>
                <Star className="h-3.5 w-3.5 fill-accent text-accent flex-shrink-0" />
                <span className="font-medium">{product.listedBy.rating}</span>
                <span className="text-muted-foreground">•</span>
              </>
            )}
            <span className="text-muted-foreground truncate">
              {product.listedBy?.name || 'Unknown User'}
            </span>
          </div>
          
          {/* Exchange Options */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {product.exchangePreferences?.barter && (
              <Badge variant="outline" className="bg-primary/5 text-xs">
                Barter
              </Badge>
            )}
            {(product.exchangePreferences?.cash || product.exchangePreferences?.cashOption) && (
              <Badge variant="outline" className="bg-secondary/5 text-xs">
                Cash
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 