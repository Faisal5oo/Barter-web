import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { ProductImageInMessage } from './ProductImageInMessage';

interface OfferMessageProps {
  message: any;
  user: any;
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  acceptOfferMutation: any;
  rejectOfferMutation: any;
}

export const OfferMessage = ({ 
  message, 
  user, 
  onAcceptOffer, 
  onRejectOffer, 
  acceptOfferMutation, 
  rejectOfferMutation 
}: OfferMessageProps) => {
  const offer = message.offer;
  const isMyMessage = message.sender._id === user?.id;
  const { data: offeredProduct } = useProduct(offer.offeredProduct);
  const { data: requestedProduct } = useProduct(offer.requestedProduct);

  return (
    <Card className="bg-muted/50 mt-2">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Barter Offer</p>
            <Badge variant={
              offer.status === 'accepted' ? 'default' :
              offer.status === 'rejected' ? 'destructive' :
              offer.status === 'cancelled' ? 'secondary' : 'outline'
            }>
              {offer.status}
            </Badge>
          </div>
          
          {offeredProduct && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">Offered Item:</p>
              <div className="flex items-center gap-4">
                <ProductImageInMessage product={offeredProduct} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{offeredProduct.title || 'Untitled Product'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {offeredProduct.condition || 'Good'} • {offeredProduct.category || 'General'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {requestedProduct && (
            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg mt-3">
              <p className="text-sm font-medium mb-3 text-green-800 dark:text-green-200">Requested Item:</p>
              <div className="flex items-center gap-4">
                <ProductImageInMessage product={requestedProduct} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{requestedProduct.title || 'Untitled Product'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {requestedProduct.condition || 'Good'} • {requestedProduct.category || 'General'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {offer.message && (
            <div>
              <p className="text-sm font-medium mb-1">Message:</p>
              <p className="text-sm text-muted-foreground">{offer.message}</p>
            </div>
          )}

          {!isMyMessage && offer.status === 'pending' && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onAcceptOffer(offer._id)}
                disabled={acceptOfferMutation.isPending}
              >
                {acceptOfferMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept'}
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                className="flex-1"
                onClick={() => onRejectOffer(offer._id)}
                disabled={rejectOfferMutation.isPending}
              >
                {rejectOfferMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 