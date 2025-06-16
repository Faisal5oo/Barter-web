// useOffer.js - Offer API service
import { axiosInstanceWeb } from '../lib/axiosInstance';

// Create new barter offer
const createOffer = async (offerData) => {
  try {
    // Transform frontend exchangeType to backend offerType and structure
    const backendOfferData = {
      offeredTo: offerData.offeredTo,
      requestedProduct: offerData.requestedProduct,
      message: offerData.message,
      offerType: offerData.exchangeType, // 'barter', 'barter-plus-cash', 'cash-only'
      ...(offerData.exchangeType !== 'cash_only' && offerData.offeredProduct && {
        offeredProduct: offerData.offeredProduct
      }),
      ...(offerData.cashAmount && {
        cashAmount: offerData.cashAmount,
        currency: 'PKR' // Default currency
      })
    };

    const response = await axiosInstanceWeb.post('/offers', backendOfferData);
    // Backend returns the created offer object with populated fields
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create offer');
  }
};

// Get user's sent offers
const getSentOffers = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/offers/sent?${params.toString()}`);
    // Backend returns { offers: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sent offers');
  }
};

// Get user's received offers
const getReceivedOffers = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosInstanceWeb.get(`/offers/received?${params.toString()}`);
    // Backend returns { offers: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch received offers');
  }
};

// Accept offer
const acceptOffer = async (offerId) => {
  try {
    const response = await axiosInstanceWeb.put(`/offers/${offerId}/accept`);
    // Backend returns { message: "Offer accepted successfully", offer: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to accept offer');
  }
};

// Mark product as sold
const markProductAsSold = async (productId) => {
  try {
    const response = await axiosInstanceWeb.put(`/products/${productId}/mark-as-sold`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark product as sold');
  }
};

// Mark product as available
const markProductAsAvailable = async (productId) => {
  try {
    const response = await axiosInstanceWeb.put(`/products/${productId}/mark-as-available`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark product as available');
  }
};

// Reject offer
const rejectOffer = async (offerId) => {
  try {
    const response = await axiosInstanceWeb.put(`/offers/${offerId}/reject`);
    // Backend returns { message: "Offer rejected successfully", offer: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reject offer');
  }
};

// Cancel offer
const cancelOffer = async (offerId) => {
  try {
    const response = await axiosInstanceWeb.put(`/offers/${offerId}/cancel`);
    // Backend returns { message: "Offer cancelled successfully", offer: {...} }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel offer');
  }
};

export {
  createOffer,
  getSentOffers,
  getReceivedOffers,
  acceptOffer,
  rejectOffer,
  cancelOffer,
  markProductAsSold,
  markProductAsAvailable
}; 