import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import SearchBar from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { 
  ArrowDown, 
  ArrowUp, 
  Filter, 
  Grid3X3, 
  List, 
  PlusCircle, 
  SlidersHorizontal 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Sample condition options
const conditionOptions = [
  { label: "Brand New", value: "new" },
  { label: "Like New", value: "likeNew" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
  { label: "For Parts", value: "forParts" }
];

// Sample exchange options
const exchangeOptions = [
  { label: "Accepts Barter Only", value: "barter" },
  { label: "Accepts Cash Only", value: "cash" },
  { label: "Accepts Both", value: "both" }
];

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>("newest");
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Format category name for display (Electronics to Electronics, mobile-phones to Mobile Phones)
  const formattedCategoryName = categoryName
    ? categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Category: </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{formattedCategoryName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        {/* Category Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{formattedCategoryName}</h1>
            <p className="text-muted-foreground">Find and barter items in this category</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/nearby">
                <span>Nearby</span>
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/add-product">
                <PlusCircle className="mr-1 h-4 w-4" />
                <span>List Item</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="w-full lg:w-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="mr-1 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>
                    Apply filters to narrow down your search results.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="condition">
                      <AccordionTrigger>Condition</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {conditionOptions.map((option) => (
                            <div key={option.value} className="flex items-center gap-2">
                              <Checkbox id={`mobile-condition-${option.value}`} />
                              <Label htmlFor={`mobile-condition-${option.value}`}>{option.label}</Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="exchange">
                      <AccordionTrigger>Exchange Options</AccordionTrigger>
                      <AccordionContent>
                        <RadioGroup defaultValue="both">
                          {exchangeOptions.map((option) => (
                            <div key={option.value} className="flex items-center gap-2">
                              <RadioGroupItem id={`mobile-exchange-${option.value}`} value={option.value} />
                              <Label htmlFor={`mobile-exchange-${option.value}`}>{option.label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="distance">
                      <AccordionTrigger>Distance</AccordionTrigger>
                      <AccordionContent>
                        <RadioGroup defaultValue="10">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id="mobile-distance-5" value="5" />
                            <Label htmlFor="mobile-distance-5">Within 5 miles</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id="mobile-distance-10" value="10" />
                            <Label htmlFor="mobile-distance-10">Within 10 miles</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id="mobile-distance-25" value="25" />
                            <Label htmlFor="mobile-distance-25">Within 25 miles</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id="mobile-distance-50" value="50" />
                            <Label htmlFor="mobile-distance-50">Within 50 miles</Label>
                          </div>
                        </RadioGroup>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex justify-between pt-4 border-t">
                    <Button variant="outline">Reset</Button>
                    <Button>Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Desktop Filters Button */}
            <Button variant="outline" size="sm" className="hidden lg:flex">
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              Advanced Filters
            </Button>
            
            {/* Sort dropdown */}
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating_high">Highest Rated</SelectItem>
                <SelectItem value="rating_low">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View toggles */}
            <div className="bg-muted p-1 rounded-md flex">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Desktop layout with sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar (desktop only) */}
          <div className="hidden lg:block">
            <div className="bg-card border rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Filters</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Condition</h4>
                    <div className="space-y-2">
                      {conditionOptions.map((option) => (
                        <div key={option.value} className="flex items-center gap-2">
                          <Checkbox id={`condition-${option.value}`} />
                          <Label htmlFor={`condition-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Exchange Options</h4>
                    <RadioGroup defaultValue="both">
                      {exchangeOptions.map((option) => (
                        <div key={option.value} className="flex items-center gap-2">
                          <RadioGroupItem id={`exchange-${option.value}`} value={option.value} />
                          <Label htmlFor={`exchange-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Distance</h4>
                    <RadioGroup defaultValue="10">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="distance-5" value="5" />
                        <Label htmlFor="distance-5">Within 5 miles</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="distance-10" value="10" />
                        <Label htmlFor="distance-10">Within 10 miles</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="distance-25" value="25" />
                        <Label htmlFor="distance-25">Within 25 miles</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="distance-50" value="50" />
                        <Label htmlFor="distance-50">Within 50 miles</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 mt-6 border-t">
                  <Button variant="outline">Reset</Button>
                  <Button>Apply</Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="lg:col-span-3">
            <ProductGrid 
              category={categoryName || ''}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
