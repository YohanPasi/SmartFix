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
      
      // Add basic user info
      formattedFormData.append('firstName', formData.get('firstName') || '');
      formattedFormData.append('lastName', formData.get('lastName') || '');

      // Add profile info
      formattedFormData.append('profile[contactNumber]', formData.get('phone') || '');
      formattedFormData.append('profile[address]', formData.get('address') || '');
      formattedFormData.append('profile[province]', formData.get('province') || '');
      formattedFormData.append('profile[district]', formData.get('district') || '');
      formattedFormData.append('profile[city]', formData.get('city') || '');
      formattedFormData.append('profile[postalCode]', formData.get('postalCode') || '');

      // Add shop details
      formattedFormData.append('shopDetails[shopName]', formData.get('shopName') || '');
      formattedFormData.append('shopDetails[description]', formData.get('description') || '');
      formattedFormData.append('shopDetails[category]', formData.get('category') || '');
      formattedFormData.append('shopDetails[businessRegistrationNumber]', formData.get('businessRegistrationNumber') || '');
      formattedFormData.append('shopDetails[businessType]', formData.get('businessType') || '');

      // Add opening hours
      const openingHours = JSON.parse(formData.get('openingHours') || '{}');
      Object.entries(openingHours).forEach(([day, hours]) => {
        formattedFormData.append(`shopDetails[openingHours][${day}][start]`, hours.start || '');
        formattedFormData.append(`shopDetails[openingHours][${day}][end]`, hours.end || '');
      });

      // Add arrays
      const categories = JSON.parse(formData.get('categories') || '[]');
      categories.forEach((category, index) => {
        formattedFormData.append(`shopDetails[categories][${index}]`, category);
      });

      const paymentMethods = JSON.parse(formData.get('paymentMethods') || '[]');
      paymentMethods.forEach((method, index) => {
        formattedFormData.append(`shopDetails[paymentMethods][${index}]`, method);
      });

      const deliveryOptions = JSON.parse(formData.get('deliveryOptions') || '[]');
      deliveryOptions.forEach((option, index) => {
        formattedFormData.append(`shopDetails[deliveryOptions][${index}]`, option);
      });

      // Add social media
      const socialMedia = JSON.parse(formData.get('socialMedia') || '{}');
      Object.entries(socialMedia).forEach(([platform, url]) => {
        formattedFormData.append(`shopDetails[socialMedia][${platform}]`, url || '');
      });

      // Add numeric fields
      formattedFormData.append('shopDetails[minimumOrderAmount]', formData.get('minimumOrderAmount') || '0');
      formattedFormData.append('shopDetails[deliveryRadius]', formData.get('deliveryRadius') || '0');
      formattedFormData.append('shopDetails[taxRate]', formData.get('taxRate') || '0');

      // Add images if they exist
      if (formData.get('shopLogo')) {
        formattedFormData.append('shopLogo', formData.get('shopLogo'));
      }
      if (formData.get('shopBanner')) {
        formattedFormData.append('shopBanner', formData.get('shopBanner'));
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