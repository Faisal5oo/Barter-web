import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Sunrise, RefreshCw, Calendar } from 'lucide-react';
import { useDailyRecommendations } from '@/hooks/useAI';
import ProductCard from '@/components/ui/ProductCard';
import { aiNotificationService } from '@/services/notificationService';
import { cn } from '@/lib/utils';

interface DailyRecommendationsProps {
  className?: string;
  limit?: number;
  showTitle?: boolean;
}

const DailyRecommendations: React.FC<DailyRecommendationsProps> = ({
  className,
  limit = 6,
  showTitle = true,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const {
    data: dailyData,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useDailyRecommendations(user?.id);

  // Send notification when daily recommendations are loaded
  useEffect(() => {
    if (dailyData?.recommendations?.length > 0) {
      aiNotificationService.sendDailyRecommendations(dailyData.recommendations);
    }
  }, [dailyData]);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {showTitle && (
          <div className="flex items-center space-x-2">
            <Sunrise className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Daily Fresh Picks</h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[4/3]">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        {showTitle && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sunrise className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Daily Fresh Picks</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefetching && "animate-spin")} />
              Retry
            </Button>
          </div>
        )}
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Unable to Load Daily Picks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't fetch today's fresh recommendations.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recommendations = dailyData?.recommendations || [];

  if (recommendations.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {showTitle && (
          <div className="flex items-center space-x-2">
            <Sunrise className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Daily Fresh Picks</h2>
          </div>
        )}
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Fresh Items Today</h3>
            <p className="text-sm text-muted-foreground">
              Check back later for new daily recommendations based on recent listings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sunrise className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Daily Fresh Picks</h2>
            <Badge variant="secondary" className="text-xs">
              Last 3 days
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefetching && "animate-spin")} />
            Refresh
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <div 
            key={product._id} 
            className="relative animate-in fade-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <ProductCard
              product={product}
              currentUserId={user?.id}
              className="h-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
            
            {/* Fresh Badge */}
            <div className="absolute top-2 left-2 z-10">
              <Badge
                variant="default"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium animate-shimmer"
              >
                Fresh Today
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {dailyData?.totalCount && dailyData.totalCount > limit && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {recommendations.length} of {dailyData.totalCount} fresh items
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyRecommendations; 