
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import SearchBar from '@/components/ui/SearchBar';
import CategoryFilter from '@/components/ui/CategoryFilter';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, MapPin, Grid3X3, List } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('query') || ""
  );
  const [sortOption, setSortOption] = useState<string>(
    searchParams.get('sort') || "newest"
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    updateSearchParams('category', category || '');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateSearchParams('query', query);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    updateSearchParams('sort', value);
  };

  const updateSearchParams = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Browse</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Browse Items</h1>
            <p className="text-muted-foreground">Find items to trade or purchase</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/nearby">
                <MapPin className="mr-1 h-4 w-4" />
                <span>Nearby</span>
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/add-product">
                <span>List Your Item</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <SearchBar onSearch={handleSearch} />
            
            <div className="flex items-center gap-2">
              <Select value={sortOption} onValueChange={handleSortChange}>
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
          
          <CategoryFilter 
            onSelectCategory={handleCategorySelect} 
            selectedCategory={selectedCategory} 
          />
        </div>
        
        {/* Product Filtering Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="barter">Barter Only</TabsTrigger>
            <TabsTrigger value="cash">Cash Only</TabsTrigger>
            <TabsTrigger value="both">Barter & Cash</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ProductGrid 
              category={selectedCategory}
              searchQuery={searchQuery}
              exchangeType="all"
            />
          </TabsContent>
          <TabsContent value="barter">
            <ProductGrid 
              category={selectedCategory}
              searchQuery={searchQuery}
              exchangeType="barter"
            />
          </TabsContent>
          <TabsContent value="cash">
            <ProductGrid 
              category={selectedCategory}
              searchQuery={searchQuery}
              exchangeType="cash"
            />
          </TabsContent>
          <TabsContent value="both">
            <ProductGrid 
              category={selectedCategory}
              searchQuery={searchQuery}
              exchangeType="both"
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrowsePage;
