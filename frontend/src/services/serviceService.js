import { api } from './api';

export const serviceService = {
    // Get all services for the current service provider
    getServices: async () => {
        try {
            const response = await api.get('/services');
            return response.data;
        } catch (error) {
            console.error('Error getting services:', error);
            throw error.response?.data || error;
        }
    },

    // Get a single service
    getService: async (id) => {
        try {
            const response = await api.get(`/services/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting service:', error);
            throw error.response?.data || error;
        }
    },

    // Create a new service
    createService: async (serviceData) => {
        try {
            const formData = new FormData();
            
            // Append service details
            formData.append('name', serviceData.name);
            formData.append('description', serviceData.description);
            formData.append('price', serviceData.price);
            formData.append('category', serviceData.category);
            formData.append('serviceType', serviceData.serviceType);
            formData.append('requirements', serviceData.requirements.join(','));
            formData.append('equipmentProvided', serviceData.equipmentProvided);
            formData.append('materialsIncluded', serviceData.materialsIncluded);
            formData.append('isActive', serviceData.isActive);
            formData.append('availability', serviceData.availability);
            
            // Append images if any
            if (serviceData.images && serviceData.images.length > 0) {
                serviceData.images.forEach((image, index) => {
                    formData.append('images', image);
                });
            }

            const response = await api.post('/services', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating service:', error);
            throw error.response?.data || error;
        }
    },

    // Update a service
    updateService: async (id, serviceData) => {
        try {
            const formData = new FormData();
            
            // Append service details
            formData.append('name', serviceData.name);
            formData.append('description', serviceData.description);
            formData.append('price', serviceData.price);
            formData.append('category', serviceData.category);
            formData.append('serviceType', serviceData.serviceType);
            formData.append('requirements', serviceData.requirements.join(','));
            formData.append('equipmentProvided', serviceData.equipmentProvided);
            formData.append('materialsIncluded', serviceData.materialsIncluded);
            formData.append('isActive', serviceData.isActive);
            formData.append('availability', serviceData.availability);
            
            // Append images if any
            if (serviceData.images && serviceData.images.length > 0) {
                serviceData.images.forEach((image, index) => {
                    formData.append('images', image);
                });
            }

            const response = await api.put(`/services/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating service:', error);
            throw error.response?.data || error;
        }
    },

    // Delete a service
    deleteService: async (id) => {
        try {
            console.log('Deleting service with ID:', id);
            const response = await api.delete(`/services/${id}`);
            console.log('Delete response:', response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to delete service');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error in deleteService:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            // Create a more detailed error object
            const detailedError = new Error(error.response?.data?.error || error.message);
            detailedError.response = error.response;
            detailedError.status = error.response?.status;
            throw detailedError;
        }
    }
}; 