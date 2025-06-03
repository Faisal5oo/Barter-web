import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useMyListings, useDeleteProduct } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Package, Handshake, Mail, Plus, Filter, Search, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyListingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const { data, isLoading, error, isError } = useMyListings({
    page: currentPage,
    limit: 10,
    ...(searchQuery && { search: searchQuery }),
  });

  const deleteProduct = useDeleteProduct();

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct.mutateAsync(productToDelete);
      toast({
        title: "Product Deleted",
        description: "Your listing has been successfully deleted.",
      });
      setProductToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = data?.products?.filter(product => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'active') return product.isActive;
    if (selectedStatus === 'inactive') return !product.isActive;
    return true;
  }) || [];

  const products = data?.products || [];
  const pagination = data?.pagination || {};

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your product listings and track their performance
            </p>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </TabsTrigger>
                <TabsTrigger value="listings">
                  <Package className="h-4 w-4 mr-2" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="offers" onClick={() => navigate('/offers')}>
                  <Handshake className="h-4 w-4 mr-2" />
                  My Offers
                </TabsTrigger>
                <TabsTrigger value="messages" onClick={() => navigate('/messages')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search listings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Select value={selectedStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setSelectedStatus(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2 text-muted-foreground">Loading your listings...</span>
                </div>
              )}

              {isError && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2 text-destructive">Error loading listings</h3>
                    <p className="text-muted-foreground">
                      {error?.message || "Something went wrong. Please try again later."}
                    </p>
                  </CardContent>
                </Card>
              )}

              {!isLoading && !isError && filteredProducts.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No listings found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedStatus !== 'all' 
                        ? "Try adjusting your search or filter criteria"
                        : "You haven't created any listings yet. Start by adding your first product!"
                      }
                    </p>
                    <Button onClick={() => navigate('/add-product')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Listing
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!isLoading && !isError && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((listing) => (
                    <ProductCard
                      key={listing._id || listing.id}
                      product={listing}
                      currentUserId={user?.id}
                      showOwnerActions={true}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                      onView={handleViewProduct}
                    />
                  ))}
                </div>
              )}

              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Listing Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Listings</span>
                    <span className="font-medium">{pagination.totalProducts || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Listings</span>
                    <span className="font-medium">
                      {products.filter(p => p.isActive).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span className="font-medium">
                      {products.reduce((sum, p) => sum + (p.views || 0), 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Views per Listing</span>
                    <span className="font-medium">
                      {products.length > 0 
                        ? Math.round(products.reduce((sum, p) => sum + (p.views || 0), 0) / products.length)
                        : 0
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => navigate('/add-product')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Listing
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/messages')}>
                    <Mail className="h-4 w-4 mr-2" />
                    View Messages
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your listing
              and remove it from our servers. Any pending offers will also be cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Listing'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListingPage;
