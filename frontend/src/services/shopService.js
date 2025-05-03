// services/shopService.js
import axios from 'axios';
import { authService } from './api';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5001',
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend server might be down');
      // Check if backend is reachable
      try {
        await axios.get('http://localhost:5001/health');
      } catch (e) {
        console.error('Backend server is not running or not accessible');
        throw new Error('Backend server is not running. Please start the server and try again.');
      }
    }
    
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const shopService = {
  updateShopProfile: async (formData) => {
    try {
      // Log the form data for debugging
      console.log('Sending form data:', formData);
      
      // Create a new FormData instance to ensure proper formatting
      const formattedFormData = new FormData();
      
      // Add all fields from the original formData
      for (const [key, value] of formData.entries()) {
        formattedFormData.append(key, value);
      }
      
      const response = await api.put('/api/shops/profile', formattedFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Response from server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Shop profile update error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error.response?.data || error;
    }
  },

  uploadLogo: async (formData) => {
    try {
      const response = await axios.post('/api/shops/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Logo upload error:', error);
      throw error.response?.data || error;
    }
  },

  uploadBanner: async (formData) => {
    try {
      const response = await axios.post('/api/shops/upload-banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Banner upload error:', error);
      throw error.response?.data || error;
    }
  },

  addProduct: async (formData) => {
    try {
      const response = await api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (productId, formData) => {
    try {
      const response = await api.put(`/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};