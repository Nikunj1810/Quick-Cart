import { getAuthHeaders, handleApiResponse } from '@/utils/api-helpers';

const API_BASE_URL = 'http://localhost:5000/api';

const getCurrentUserId = () => {
  const userData = localStorage.getItem('user');
  if (!userData) throw new Error('User not authenticated');
  
  try {
    const user = JSON.parse(userData);
    if (!user || !user._id) throw new Error('Invalid user data');
    return user._id;
  } catch (error) {
    throw new Error('Failed to parse user data');
  }
};

export const orderApi = {
  // Create a new order
  createOrder: async (orderData) => {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...orderData, userId })
    });
    return handleApiResponse(response);
  },

  // Get all orders for the current user
  getUserOrders: async () => {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  // Get a specific order by ID
  getOrderById: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  }
};