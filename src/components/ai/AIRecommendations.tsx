import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Sparkles, RefreshCw, TrendingUp } from 'lucide-react';
import { useAIRecommendations, useTrackInteraction } from '@/hooks/useAI';
import ProductCard from '@/components/ui/ProductCard';
import { aiNotificationService } from '@/services/notificationService';
import { cn } from '@/lib/utils';

interface AIRecommendationsProps {
  className?: string;
  limit?: number;
  showTitle?: boolean;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  className,
  limit = 6,
  showTitle = true,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const trackInteraction = useTrackInteraction();
  
  const {
    data: recommendationsData,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useAIRecommendations({
    userId: user?.id,
    limit
  });

  // Send notification when recommendations are loaded
  useEffect(() => {
    if (recommendationsData?.recommendations?.length > 0) {
      aiNotificationService.sendRecommendationNotification(recommendationsData.recommendations);
    }
  }, [recommendationsData]);

  const handleProductClick = (productId) => {
    // Track interaction
    trackInteraction.mutate({
      productId,
      userId: user?.id,
      sessionId: Date.now().toString()
    });

    // Send interest notification
    aiNotificationService.sendInterestNotification(productId, []);
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {showTitle && (
          <div className="flex items-center space-x-2 animate-pulse">
            <Sparkles className="h-5 w-5 text-primary animate-spin" />
            <h2 className="text-xl font-semibold">AI Recommendations</h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
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
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">AI Recommendations</h2>
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
            <h3 className="font-medium mb-2">Unable to Load Recommendations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't fetch your personalized recommendations right now.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recommendations = recommendationsData?.recommendations || [];

  if (recommendations.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {showTitle && (
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Recommendations</h2>
          </div>
        )}
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Recommendations Yet</h3>
            <p className="text-sm text-muted-foreground">
              Start browsing and searching to get personalized recommendations based on your interests.
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
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Recommendations</h2>
            <Badge variant="secondary" className="text-xs">
              Powered by AI
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
            className="relative animate-in fade-in slide-in-from-bottom-4 duration-500" 
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleProductClick(product._id)}
          >
            <ProductCard
              product={product}
              currentUserId={user?.id}
              className="h-full cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
            
            {/* AI Insights Overlay */}
            {product.aiInsights && (
              <div className="absolute top-2 left-2 z-10">
                <Badge
                  variant="default"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium animate-shimmer"
                >
                  {product.aiInsights.matchPercentage}% match
                </Badge>
              </div>
            )}
            
            {/* AI Reason Tooltip */}
            {product.aiInsights?.reason && (
              <div className="absolute bottom-2 left-2 right-2 z-10">
                <div className="bg-black/80 text-white text-xs p-2 rounded-md backdrop-blur-sm">
                  <div className="flex items-start space-x-1">
                    <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{product.aiInsights.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {recommendationsData?.totalCount && recommendationsData.totalCount > limit && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {recommendations.length} of {recommendationsData.totalCount} recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations; 