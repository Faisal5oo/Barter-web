import { useState } from 'react';
import { Smartphone, Monitor, Car, Sofa, ShoppingBag } from 'lucide-react';

interface ProductImageInMessageProps {
  product: any;
}

const getCategoryIcon = (category: string, size = 'small') => {
  const categoryLower = category?.toLowerCase() || '';
  const iconSize = size === 'small' ? 'h-4 w-4' : 'h-6 w-6';
  
  if (categoryLower.includes('electronics') || categoryLower.includes('phone') || categoryLower.includes('mobile')) {
    return <Smartphone className={`${iconSize} text-muted-foreground`} />;
  }
  if (categoryLower.includes('computer') || categoryLower.includes('laptop') || categoryLower.includes('monitor')) {
    return <Monitor className={`${iconSize} text-muted-foreground`} />;
  }
  if (categoryLower.includes('vehicle') || categoryLower.includes('car') || categoryLower.includes('bike')) {
    return <Car className={`${iconSize} text-muted-foreground`} />;
  }
  if (categoryLower.includes('furniture') || categoryLower.includes('chair') || categoryLower.includes('table')) {
    return <Sofa className={`${iconSize} text-muted-foreground`} />;
  }
  return <ShoppingBag className={`${iconSize} text-muted-foreground`} />;
};

export const ProductImageInMessage = ({ product }: ProductImageInMessageProps) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = product?.images?.[0] || product?.image;
  
  if (!imageUrl || imageError) {
    return (
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
        {getCategoryIcon(product?.category)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={product?.title || 'Product'}
      className="w-16 h-16 rounded-lg object-cover"
      onError={() => setImageError(true)}
    />
  );
}; 