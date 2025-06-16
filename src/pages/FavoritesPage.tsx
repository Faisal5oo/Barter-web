import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Filter, Package, Loader2, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: favorites = [], isLoading, error } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sign in to view favorites</h3>
                <p className="text-muted-foreground mb-4">
                  Create an account or sign in to save your favorite products.
                </p>
                <Button onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const categories = [...new Set(favorites.map(product => product.category))];

  const handleRemoveFromFavorites = (productId: string) => {
    toggleFavoriteMutation.mutate({
      productId,
      isFavorite: true // We're removing, so current state is favorite
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading favorites...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Heart className="h-6 w-6 text-red-500 fill-current" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
                <p className="text-muted-foreground">
                  {favorites.length} saved {favorites.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
          </div>

          {favorites.length === 0 ? (
            <Card className="animate-scale-in">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start browsing products and click the heart icon to save your favorites.
                </p>
                <Button onClick={() => navigate('/')}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Filters */}
              <div className="mb-6 animate-slide-up animate-delay-200">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Search */}
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search favorites..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {/* Category Filter */}
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Sort */}
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Count */}
              {searchQuery || categoryFilter !== 'all' ? (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredFavorites.length} of {favorites.length} favorites
                  </p>
                </div>
              ) : null}

              {/* Favorites Grid */}
              {filteredFavorites.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up animate-delay-300">
                  {filteredFavorites.map((product, index) => (
                    <div key={product._id} className={`animate-scale-in animate-delay-${Math.min(index * 100, 500)}`}>
                      <div className="relative group">
                        <ProductCard
                          id={product._id}
                          title={product.title}
                          image={product.image}
                          category={product.category}
                          condition={product.condition}
                          description={product.description}
                          ownerName={product.owner?.name || 'Unknown'}
                          ownerRating={product.owner?.rating || 0}
                          createdAt={product.createdAt}
                          allowsBarter={product.allowsBarter}
                          allowsCash={product.allowsCash}
                        />
                        
                        {/* Remove from favorites button */}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFromFavorites(product._id);
                          }}
                          disabled={toggleFavoriteMutation.isPending}
                        >
                          {toggleFavoriteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage; 