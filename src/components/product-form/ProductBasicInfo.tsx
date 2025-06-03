
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample categories to choose from
const categories = [
  { value: "Smartphones", label: "Smartphones" },
  { value: "Electronics", label: "Electronics" },
  { value: "Computers", label: "Computers" },
  { value: "Gaming", label: "Gaming" },
  { value: "Furniture", label: "Furniture" },
  { value: "Sports", label: "Sports" },
  { value: "Clothing", label: "Clothing" },
  { value: "Vehicles", label: "Vehicles" },
  { value: "Books", label: "Books" },
  { value: "Collectibles", label: "Collectibles" },
  { value: "Music", label: "Music" },
];

// Sample condition options
const conditionOptions = [
  { label: "Brand New", value: "Brand New" },
  { label: "Like New", value: "Like New" },
  { label: "Excellent", value: "Excellent" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
  { label: "For Parts", value: "For Parts" },
];

interface ProductBasicInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
}

const ProductBasicInfo = ({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  condition,
  setCondition,
}: ProductBasicInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide essential details about your item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. iPhone 13 Pro Max - Excellent Condition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail, including any defects or features"
              className="min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Minimum 50 characters, be specific and honest about the condition
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">
                Condition <span className="text-destructive">*</span>
              </Label>
              <Select value={condition} onValueChange={setCondition} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductBasicInfo;
