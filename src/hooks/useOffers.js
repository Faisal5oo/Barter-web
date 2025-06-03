import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  createOffer,
  getSentOffers,
  getReceivedOffers,
  acceptOffer,
  rejectOffer,
  cancelOffer
} from '../services/useOffer';

export const OFFER_QUERY_KEYS = {
  all: ['offers'],
  sent: (filters) => [...OFFER_QUERY_KEYS.all, 'sent', filters],
  received: (filters) => [...OFFER_QUERY_KEYS.all, 'received', filters],
};

// Get Sent Offers
export const useSentOffers = (options = {}) => {
  return useQuery({
    queryKey: OFFER_QUERY_KEYS.sent(options),
    queryFn: () => getSentOffers(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Received Offers
export const useReceivedOffers = (options = {}) => {
  return useQuery({
    queryKey: OFFER_QUERY_KEYS.received(options),
    queryFn: () => getReceivedOffers(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Offer
export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFER_QUERY_KEYS.all });
      
      toast({
        title: 'Success',
        description: 'Offer sent successfully!',
      });
    },
    onError: (error) => {
      const message = error.message || 'Failed to send offer';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Accept Offer
export const useAcceptOffer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: acceptOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFER_QUERY_KEYS.all });
      
      toast({
        title: 'Success',
        description: 'Offer accepted successfully!',
      });
    },
    onError: (error) => {
      const message = error.message || 'Failed to accept offer';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Reject Offer
export const useRejectOffer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: rejectOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFER_QUERY_KEYS.all });
      
      toast({
        title: 'Success',
        description: 'Offer rejected successfully!',
      });
    },
    onError: (error) => {
      const message = error.message || 'Failed to reject offer';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Cancel Offer
export const useCancelOffer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: cancelOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFER_QUERY_KEYS.all });
      
      toast({
        title: 'Success',
        description: 'Offer cancelled successfully!',
      });
    },
    onError: (error) => {
      const message = error.message || 'Failed to cancel offer';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Helper hook to get offer statistics
export const useOfferStats = () => {
  const { data: sentData } = useSentOffers({ limit: 100 });
  const { data: receivedData } = useReceivedOffers({ limit: 100 });

  const sentOffers = sentData?.offers || [];
  const receivedOffers = receivedData?.offers || [];

  return {
    totalSent: sentOffers.length,
    totalReceived: receivedOffers.length,
    pendingSent: sentOffers.filter(offer => offer.status === 'pending').length,
    pendingReceived: receivedOffers.filter(offer => offer.status === 'pending').length,
    acceptedSent: sentOffers.filter(offer => offer.status === 'accepted').length,
    acceptedReceived: receivedOffers.filter(offer => offer.status === 'accepted').length,
    rejectedSent: sentOffers.filter(offer => offer.status === 'rejected').length,
    rejectedReceived: receivedOffers.filter(offer => offer.status === 'rejected').length,
    isLoading: !sentData || !receivedData,
  };
}; 