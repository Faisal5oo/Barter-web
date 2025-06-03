import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Package, Handshake, Mail, Star, Shield, Settings, LogOut, Edit, Camera, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useMyListings } from '@/hooks/useProducts';
import { useOfferStats } from '@/hooks/useOffers';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: myListingsData, isLoading: listingsLoading } = useMyListings({ limit: 100 });
  const offerStats = useOfferStats();

  const stats = {
    totalListings: myListingsData?.pagination?.totalProducts || 0,
    activeListings: myListingsData?.products?.filter(p => p.status === 'active').length || 0,
    totalViews: myListingsData?.products?.reduce((sum, product) => sum + (product.views || 0), 0) || 0,
    totalOffers: (offerStats.totalSent || 0) + (offerStats.totalReceived || 0),
    pendingOffers: (offerStats.pendingSent || 0) + (offerStats.pendingReceived || 0),
    acceptedOffers: (offerStats.acceptedSent || 0) + (offerStats.acceptedReceived || 0),
         memberSince: new Date().toISOString(),
    isLoading: listingsLoading || offerStats.isLoading
  };

  if (stats.isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading profile...</span>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile, preferences, and account settings
            </p>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </TabsTrigger>
                <TabsTrigger value="listings" onClick={() => navigate('/my-listing')}>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
                          <p className="text-muted-foreground">
                            Member since {new Date(stats.memberSince).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Active Member
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {stats.acceptedOffers} successful trades
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalListings}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeListings} currently active
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all your listings
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myListingsData?.products?.slice(0, 3).map((product) => (
                      <div key={product._id} className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Listed "{product.title}"</p>
                          <p className="text-sm text-muted-foreground">
                            {product.category} • {product.condition}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent listings
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Listings</span>
                    <span className="font-medium">{stats.activeListings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span className="font-medium">{stats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Offers</span>
                    <span className="font-medium">{stats.totalOffers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending Offers</span>
                    <span className="font-medium">{stats.pendingOffers}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Successful Trades</span>
                    <span className="font-medium">{stats.acceptedOffers}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy & Security
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
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

export default ProfilePage; 