import { authService } from './api';

export const serviceProviderService = {
    updateProfile: async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // First, upload the image if it exists
            const imageFile = formData.get('profilePicture');
            if (imageFile && imageFile.size > 0) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageFile);
                
                try {
                    const uploadResponse = await authService.uploadProfilePicture(imageFormData);
                    if (uploadResponse.success) {
                        formData.set('profilePicture', uploadResponse.url);
                    }
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                    throw new Error(uploadError.response?.data?.error || 'Failed to upload image');
                }
            }

            // Update the profile
            const response = await authService.updateProfile(formData);
            return response;
        } catch (error) {
            console.error('Service provider profile update error:', error);
            throw error;
        }
    },

    getProfile: async () => {
        try {
            const response = await authService.getCurrentUser();
            return response;
        } catch (error) {
            console.error('Get service provider profile error:', error);
            throw error;
        }
    }
}; 