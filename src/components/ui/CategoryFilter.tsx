
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'Smartphones', name: 'Smartphones' },
  { id: 'Electronics', name: 'Electronics' },
  { id: 'Computers', name: 'Computers' },
  { id: 'Gaming', name: 'Gaming' },
  { id: 'Furniture', name: 'Furniture' },
  { id: 'Sports', name: 'Sports' },
  { id: 'Clothing', name: 'Clothing' },
  { id: 'Vehicles', name: 'Vehicles' },
  { id: 'Books', name: 'Books' },
  { id: 'Collectibles', name: 'Collectibles' },
  { id: 'Music', name: 'Music' },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onSelectCategory, selectedCategory }) => {
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      onSelectCategory(null);
    } else {
      onSelectCategory(categoryId);
    }
  };

  return (
    <div className="w-full mb-6">
      <ScrollArea className="whitespace-nowrap pb-4">
        <div className="flex gap-2 p-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id || (category.id === 'all' && selectedCategory === null) ? "default" : "outline"}
              size="sm"
              className="category-pill rounded-full"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
