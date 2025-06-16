import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Package, Handshake, Mail, Clock, CheckCircle2, XCircle, AlertCircle, Filter, Loader2, Smartphone, Monitor, Car, Sofa, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  useSentOffers, 
  useReceivedOffers, 
  useAcceptOffer, 
  useRejectOffer, 
  useCancelOffer,
  useOfferStats 
} from '@/hooks/useOffers';

const OffersPage = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const sentOffers = useSentOffers({ 
    page: currentPage, 
    limit: 10,
    ...(selectedStatus !== 'all' && { status: selectedStatus })
  });
  
  const receivedOffers = useReceivedOffers({ 
    page: currentPage, 
    limit: 10,
    ...(selectedStatus !== 'all' && { status: selectedStatus })
  });

  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();
  const cancelOffer = useCancelOffer();
  const stats = useOfferStats();

  const handleAcceptOffer = async (offerId: string, productId?: string, productTitle?: string) => {
    try {
      await acceptOffer.mutateAsync({ 
        offerId, 
        productId: productId || undefined 
      });
      
      // Send notification about accepted offer
      if (productTitle) {
        const { aiNotificationService } = await import('@/services/notificationService');
        aiNotificationService.sendOfferAcceptedNotification(productTitle, 'barter');
        aiNotificationService.sendProductTradedNotification(productTitle, true);
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      await rejectOffer.mutateAsync(offerId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleCancelOffer = async (offerId: string) => {
    try {
      await cancelOffer.mutateAsync(offerId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'accepted':
        return 'bg-green-500/10 text-green-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category?.toLowerCase() || '';
    if (categoryLower.includes('electronics') || categoryLower.includes('phone') || categoryLower.includes('mobile')) {
      return <Smartphone className="h-6 w-6" />;
    }
    if (categoryLower.includes('computer') || categoryLower.includes('laptop') || categoryLower.includes('monitor')) {
      return <Monitor className="h-6 w-6" />;
    }
    if (categoryLower.includes('vehicle') || categoryLower.includes('car') || categoryLower.includes('bike')) {
      return <Car className="h-6 w-6" />;
    }
    if (categoryLower.includes('furniture') || categoryLower.includes('chair') || categoryLower.includes('table')) {
      return <Sofa className="h-6 w-6" />;
    }
    return <ShoppingBag className="h-6 w-6" />;
  };

  const ProductImage = ({ product, size = 'large' }: { product: any, size?: 'small' | 'large' }) => {
    const [imageError, setImageError] = useState(false);
    const imageUrl = product?.images?.[0];
    const dimensions = size === 'small' ? 'w-16 h-16' : 'w-full h-48';
    
    if (!imageUrl || imageError) {
      return (
        <div className={`${dimensions} rounded-lg bg-muted flex items-center justify-center`}>
          {getCategoryIcon(product?.category)}
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={product?.title || 'Product'}
        className={`${dimensions} rounded-lg object-cover`}
        onError={() => setImageError(true)}
      />
    );
  };

  const renderOfferCard = (offer: any, type: 'sent' | 'received') => (
    <Card key={offer._id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="relative w-full md:w-48">
            <ProductImage product={offer.requestedProduct} size="large" />
            <Badge
              variant="secondary"
              className={`absolute top-2 right-2 ${getStatusColor(offer.status)}`}
            >
              <div className="flex items-center gap-1">
                {getStatusIcon(offer.status)}
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
              </div>
            </Badge>
          </div>

          {/* Offer Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {type === 'sent' ? 'Your offer for: ' : 'Offer for: '}{offer.requestedProduct?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(offer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/product/${offer.requestedProduct?._id}`)}
              >
                View Product
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {type === 'sent' 
                      ? (offer.offeredTo?.name?.charAt(0) || 'U')
                      : (offer.offeredBy?.name?.charAt(0) || 'U')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {type === 'sent' ? offer.offeredTo?.name : offer.offeredBy?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {type === 'sent' ? offer.offeredTo?.email : offer.offeredBy?.email}
                  </p>
                </div>
              </div>

              {/* Offer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">
                    {type === 'sent' ? 'Your Offered Product:' : 'Offered Product:'}
                  </p>
                  {offer.offeredProduct ? (
                    <div className="flex items-center gap-3">
                      <ProductImage product={offer.offeredProduct} size="small" />
                      <div>
                        <p className="text-sm font-medium">{offer.offeredProduct?.title}</p>
                        <p className="text-xs text-muted-foreground">{offer.offeredProduct?.category}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                        <span className="text-xl">💰</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cash Only Offer</p>
                        {offer.cashAmount && (
                          <p className="text-xs text-muted-foreground">PKR {offer.cashAmount.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Exchange Type */}
                  {offer.exchangeType && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {offer.exchangeType === 'barter' && 'Product Exchange'}
                        {offer.exchangeType === 'barter_plus_cash' && 'Product + Cash'}
                        {offer.exchangeType === 'cash_only' && 'Cash Only'}
                      </Badge>
                      {offer.cashAmount && offer.exchangeType !== 'cash_only' && (
                        <span className="text-xs text-muted-foreground ml-2">
                          + PKR {offer.cashAmount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Message:</p>
                  <p className="text-sm text-muted-foreground">
                    {offer.message || 'No message provided'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {offer.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  {type === 'received' ? (
                    <>
                      <Button 
                        className="flex-1"
                        onClick={() => handleAcceptOffer(offer._id, offer.offeredProduct?._id, offer.offeredProduct?.title)}
                        disabled={acceptOffer.isPending}
                      >
                        {acceptOffer.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Accept Offer
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => handleRejectOffer(offer._id)}
                        disabled={rejectOffer.isPending}
                      >
                        {rejectOffer.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Decline
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleCancelOffer(offer._id)}
                      disabled={cancelOffer.isPending}
                    >
                      {cancelOffer.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Cancel Offer
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Offers</h1>
            <p className="text-muted-foreground mt-2">
              Manage your barter offers and negotiations
            </p>
          </div>

          {/* Navigation Links */}
          <div className="mb-8">
            <Tabs defaultValue="offers" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </TabsTrigger>
                <TabsTrigger value="listings" onClick={() => navigate('/my-listings')}>
                  <Package className="h-4 w-4 mr-2" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="offers">
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
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search offers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Offers Tabs */}
              <Tabs defaultValue="received" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="received">
                    Received Offers ({receivedOffers.data?.pagination?.totalOffers || 0})
                  </TabsTrigger>
                  <TabsTrigger value="sent">
                    Sent Offers ({sentOffers.data?.pagination?.totalOffers || 0})
                  </TabsTrigger>
                </TabsList>

                {/* Received Offers */}
                <TabsContent value="received" className="space-y-4">
                  {receivedOffers.isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                  ) : receivedOffers.error ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-red-500">Error loading received offers</p>
                      </CardContent>
                    </Card>
                  ) : receivedOffers.data?.offers?.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No received offers found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    receivedOffers.data?.offers?.map((offer) => renderOfferCard(offer, 'received'))
                  )}
                </TabsContent>

                {/* Sent Offers */}
                <TabsContent value="sent" className="space-y-4">
                  {sentOffers.isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                  ) : sentOffers.error ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-red-500">Error loading sent offers</p>
                      </CardContent>
                    </Card>
                  ) : sentOffers.data?.offers?.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No sent offers found</p>
                    </CardContent>
                  </Card>
                  ) : (
                    sentOffers.data?.offers?.map((offer) => renderOfferCard(offer, 'sent'))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Offer Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Sent</span>
                          <span className="font-medium">{stats.totalSent}</span>
                        </div>
                        <Progress value={stats.totalSent > 0 ? 100 : 0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Received</span>
                          <span className="font-medium">{stats.totalReceived}</span>
                        </div>
                        <Progress value={stats.totalReceived > 0 ? 100 : 0} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending</span>
                          <span className="font-medium">{stats.pendingSent + stats.pendingReceived}</span>
                    </div>
                        <Progress 
                          value={
                            (stats.totalSent + stats.totalReceived) > 0 
                              ? ((stats.pendingSent + stats.pendingReceived) / (stats.totalSent + stats.totalReceived)) * 100 
                              : 0
                          } 
                          className="h-2" 
                        />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Accepted</span>
                          <span className="font-medium">{stats.acceptedSent + stats.acceptedReceived}</span>
                    </div>
                        <Progress 
                          value={
                            (stats.totalSent + stats.totalReceived) > 0 
                              ? ((stats.acceptedSent + stats.acceptedReceived) / (stats.totalSent + stats.totalReceived)) * 100 
                              : 0
                          } 
                          className="h-2" 
                        />
                  </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => navigate('/my-listings')}>
                    <Package className="h-4 w-4 mr-2" />
                    View My Listings
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
    </div>
  );
};

export default OffersPage; 