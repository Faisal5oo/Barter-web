import React from 'react';
import StandardProductCard from '@/components/ui/ProductCard';
import { CATEGORIES } from '@/lib/constants';

export interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  condition: string;
  category: typeof CATEGORIES[number];
  ownerName: string;
  ownerRating: number;
  location: string;
  allowsCash: boolean;
  allowsBarter: boolean;
  onChatClick?: () => void;
  description?: string;
  views?: number;
  createdAt?: string;
  isFavorited?: boolean;
  distance?: string | number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  image,
  condition,
  category,
  ownerName,
  ownerRating,
  location,
  allowsCash,
  allowsBarter,
  onChatClick,
  description,
  views,
  createdAt,
  isFavorited,
  distance
}) => {
  // Transform props to match StandardProductCard interface
  const standardProduct = {
    _id: id,
    title,
    description,
    category,
    condition,
    images: [image],
    location,
    views: views || 0,
    createdAt: createdAt || new Date().toISOString(),
    isFavorited,
    distance,
    listedBy: {
      _id: 'unknown',
      name: ownerName,
      rating: ownerRating,
    },
    exchangePreferences: {
      barter: allowsBarter,
      cash: allowsCash,
    },
  };

  return (
    <StandardProductCard
      product={standardProduct}
      onToggleFavorite={() => {}}
      onView={() => {}}
    />
  );
};

export default ProductCard;
