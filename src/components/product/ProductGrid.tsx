import { useState, useEffect } from "react";
import ProductCard from "../ui/ProductCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useToggleFavorite, useCheckFavorite } from "@/hooks/useFavorites";
import { useProducts, useFreeProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductGridProps {
  category?: string | null;
  searchQuery?: string;
  exchangeType?: "all" | "barter" | "cash" | "both";
  itemsPerPage?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  category, 
  searchQuery,
  exchangeType = "all",
  itemsPerPage = 8
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters for the API call
  const filters: any = {
    page: currentPage,
    limit: itemsPerPage,
    ...(category && category !== "Free Stuff" && { category }),
    ...(searchQuery && { search: searchQuery }),
    sortBy: 'newest',
  };

  // Add exchange type filters (not applicable for free products)
  if (category !== "Free Stuff") {
    if (exchangeType === "barter") {
      filters.cashOption = false;
    } else if (exchangeType === "cash") {
      filters.cashOption = true;
    } else if (exchangeType === "both") {
      filters.cashOption = true;
    }
  }

  // Use different hooks based on whether we're fetching free products or regular products
  const regularProductsQuery = useProducts(filters);
  const freeProductsQuery = useFreeProducts({
    page: currentPage,
    limit: itemsPerPage,
    ...(searchQuery && { search: searchQuery }),
    sortBy: 'newest',
  });

  // Choose which query to use based on category
  const { data, isLoading, error, isError } = category === "Free Stuff" 
    ? freeProductsQuery 
    : regularProductsQuery;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchQuery, exchangeType]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { user } = useSelector((state: RootState) => state.auth);
  const toggleFavoriteMutation = useToggleFavorite();

  // Handle favorite toggle
  const handleToggleFavorite = (productId: string) => {
    if (!user) return;
    
    // Find the current favorite status
    const product = products.find((p: any) => p._id === productId);
    const isFavorite = product?.isFavorited || false;
    
    toggleFavoriteMutation.mutate({
      productId,
      isFavorite
    });
  };

  // Transform backend data to match ProductCard props
  const transformProduct = (product: any) => ({
    _id: product._id || product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    condition: product.condition,
    images: product.images || [],
    location: product.location,
    views: product.views,
    createdAt: product.createdAt,
    isFavorited: product.isFavorited,
    isFree: product.isFree || false,
    distance: product.distance,
    listedBy: {
      _id: product.listedBy?._id,
      name: product.listedBy?.name || "Unknown User",
      rating: product.listedBy?.rating || 4.5,
    },
    exchangePreferences: {
      barter: product.isFree ? false : true,
      cash: product.isFree ? false : (product.exchangePreferences?.cashOption || false),
      cashOption: product.isFree ? false : (product.exchangePreferences?.cashOption || false),
      estimatedValue: product.exchangePreferences?.estimatedValue,
      minPrice: product.exchangePreferences?.minPrice,
      maxPrice: product.exchangePreferences?.maxPrice,
      price: product.exchangePreferences?.price,
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading products...</span>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2 text-destructive">Error loading products</h3>
        <p className="text-muted-foreground">
          {error?.message || "Something went wrong. Please try again later."}
        </p>
      </div>
    );
  }

  const products = data?.products || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
    }
    
    // Filter out duplicates and consecutive ellipses
    return pageNumbers
      .filter((num, i, arr) => i === 0 || num !== arr[i - 1])
      .filter((num, i, arr) => !(num === -1 && arr[i + 1] === -1));
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="space-y-8">
      {/* Results count */}
      {pagination.totalProducts !== undefined && (
        <div className="text-sm text-muted-foreground">
          Showing {products.length} of {pagination.totalProducts} items
          {category && ` in ${category}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard 
            key={product._id || product.id} 
            product={transformProduct(product)}
            currentUserId={user?.id}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {searchQuery || category 
                ? "Try adjusting your search or filter criteria"
                : "No products available at the moment"
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {products.length > 0 && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {pageNumbers.map((number, index) => 
              number === -1 ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                </PaginationItem>
              ) : (
                <PaginationItem key={number}>
                  <PaginationLink 
                    isActive={currentPage === number}
                    onClick={() => handlePageChange(number)}
                    className="cursor-pointer"
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductGrid;
