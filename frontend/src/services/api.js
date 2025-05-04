import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Don't set Content-Type for FormData
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear the token and user data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    signup: async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            console.log('Attempting login with:', credentials.email);
            const response = await api.post('/auth/login', credentials);
            console.log('Login response:', response.data);

            if (response.data.success) {
                const token = response.data.data.token;
                console.log('Token received:', token);
                
                // Store token
                localStorage.setItem('token', token);
                
                // Store user data
                const userData = response.data.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                
                return {
                    success: true,
                    data: {
                        token,
                        user: userData
                    }
                };
            } else {
                throw new Error(response.data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response:', error.response.data);
                throw new Error(error.response.data.error || 'Login failed');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                throw new Error('No response from server. Please try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
                throw new Error('Error setting up login request. Please try again.');
            }
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateProfile: async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Prepare the profile data
            const profileData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                profile: {
                    contactNumber: formData.get('profile[contactNumber]') || '',
                    address: formData.get('profile[address]') || '',
                    province: formData.get('profile[province]') || '',
                    district: formData.get('profile[district]') || '',
                    profilePicture: null
                }
            };

            // First, upload the image if it exists
            const imageFile = formData.get('profilePicture');
            if (imageFile && imageFile.size > 0) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageFile);
                
                try {
                    const uploadResponse = await api.post('/upload/cloudinary', imageFormData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });

                    if (uploadResponse.data.success) {
                        // Store only the URL in the profile data
                        profileData.profile.profilePicture = uploadResponse.data.url || uploadResponse.data.secure_url;
                    }
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                    throw new Error(uploadError.response?.data?.error || 'Failed to upload image');
                }
            }

            console.log('Profile update data:', JSON.stringify(profileData, null, 2));

            // Update the profile - using the correct endpoint
            const response = await api.put('/auth/profile', profileData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            if (data.success) {
                // Update user data in localStorage
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = {
                    ...currentUser,
                    ...data.data
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return data;
            } else {
                throw new Error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    updateRole: async (role) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Updating role to:', role);
            console.log('Using token:', token);

            const response = await api.put('/auth/role', 
                { role },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Role update response:', response.data);

            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to update role');
            }

            return response.data;
        } catch (error) {
            console.error('Update role error:', error);
            console.error('Error response:', error.response?.data);
            throw error;
        }
    },

    uploadLogo: async (formData) => {
        return api.post('/shops/upload-logo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    uploadBanner: async (formData) => {
        return api.post('/shops/upload-banner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}; 