// useOffer.js - Offer API service
import { axiosInstanceWeb } from '../lib/axiosInstance';

// Create new barter offer
const createOffer = async (offerData) => {
  try {
    const response = await axiosInstanceWeb.post('/offers', offerData);
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
  cancelOffer
}; 