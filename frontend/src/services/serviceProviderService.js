import axios from 'axios';
import { api } from './api';

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend server might be down');
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
      
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const serviceProviderService = {
  updateProfile: async (formData, token) => {
    try {
      console.log('=== Service Provider Update Profile ===');
      console.log('FormData object:', formData);
      
      // Log all form data entries
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Create a new FormData object with properly structured data
      const structuredFormData = new FormData();
      
      // Basic user info
      structuredFormData.append('firstName', formData.get('firstName') || '');
      structuredFormData.append('lastName', formData.get('lastName') || '');
      
      // Profile info
      structuredFormData.append('profile[contactNumber]', formData.get('contactNumber') || '');
      structuredFormData.append('profile[address]', formData.get('address') || '');
      structuredFormData.append('profile[province]', formData.get('province') || '');
      structuredFormData.append('profile[district]', formData.get('district') || '');
      structuredFormData.append('profile[city]', formData.get('city') || '');
      structuredFormData.append('profile[postalCode]', formData.get('postalCode') || '');
      structuredFormData.append('profile[category]', formData.get('category') || '');
      structuredFormData.append('profile[bio]', formData.get('bio') || '');
      
      // Business hours
      structuredFormData.append('profile[businessHours][open]', formData.get('open') || '09:00');
      structuredFormData.append('profile[businessHours][close]', formData.get('close') || '18:00');
      structuredFormData.append('profile[businessHours][days]', JSON.stringify(formData.get('days') || []));
      
      // Services
      structuredFormData.append('providerDetails[services]', JSON.stringify(formData.get('services') || []));
      
      // Profile picture
      if (formData.get('profilePicture')) {
        structuredFormData.append('profilePicture', formData.get('profilePicture'));
      }

      const response = await api.put('/service-providers/profile', structuredFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response from server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Service provider profile update error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
      throw error.response?.data || error;
    }
  },

  getProfile: async (token) => {
    try {
      console.log('=== Getting Service Provider Profile ===');
      console.log('Using token:', token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get('/service-providers/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Profile data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting service provider profile:', error);
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw error.response?.data || error;
    }
  }
}; 