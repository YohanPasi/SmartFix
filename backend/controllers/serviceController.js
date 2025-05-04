const Service = require('../models/Service');
const ServiceProvider = require('../models/ServiceProvider');
const { cloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');

// Helper function to upload images to Cloudinary
const uploadToCloudinary = async (files) => {
    const uploadPromises = files.map(async (file) => {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'service-images',
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
                transformation: [{ width: 800, height: 600, crop: 'limit' }]
            });
            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error('Failed to upload image to Cloudinary');
        }
    });

    return Promise.all(uploadPromises);
};

// Get all services for a service provider
const getServices = async (req, res) => {
    try {
        const services = await Service.find({ serviceProvider: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error('Error getting services:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get services'
        });
    }
};

// Get a single service
const getService = async (req, res) => {
    try {
        const service = await Service.findOne({
            _id: req.params.id,
            serviceProvider: req.user._id
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error getting service:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get service'
        });
    }
};

// Create a new service
const createService = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        const { 
            name, 
            description, 
            price, 
            category, 
            requirements,
            serviceType,
            equipmentProvided,
            materialsIncluded,
            isActive,
            availability
        } = req.body;
        
        // Upload images if provided
        let images = [];
        if (req.files && req.files.length > 0) {
            images = await uploadToCloudinary(req.files);
        }

        // Convert string values to appropriate types
        const service = new Service({
            serviceProvider: req.user._id,
            name,
            description,
            price: parseFloat(price),
            category,
            serviceType,
            requirements: requirements ? requirements.split(',') : [],
            equipmentProvided,
            materialsIncluded,
            isActive: isActive === 'true',
            availability,
            images
        });

        await service.save();

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create service'
        });
    }
};

// Update a service
const updateService = async (req, res) => {
    try {
        const { name, description, price, duration, category, requirements, isActive, availability } = req.body;
        
        const service = await Service.findOne({
            _id: req.params.id,
            serviceProvider: req.user._id
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        // Update service details
        service.name = name || service.name;
        service.description = description || service.description;
        service.price = price || service.price;
        service.duration = duration || service.duration;
        service.category = category || service.category;
        service.isActive = isActive !== undefined ? isActive : service.isActive;
        service.availability = availability || service.availability;
        
        if (requirements) {
            service.requirements = requirements.split(',').map(req => req.trim());
        }

        // Handle image updates
        if (req.files && req.files.length > 0) {
            // Delete old images from Cloudinary
            for (const image of service.images) {
                try {
                    await cloudinary.uploader.destroy(image.publicId);
                } catch (error) {
                    console.error('Error deleting old image:', error);
                }
            }

            // Upload new images
            service.images = await uploadToCloudinary(req.files);
        }

        await service.save();

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update service'
        });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const serviceProviderId = req.user._id;

        console.log('Delete request details:', {
            serviceId,
            serviceProviderId,
            user: req.user
        });

        // Validate service ID
        if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
            console.log('Invalid service ID:', serviceId);
            return res.status(400).json({
                success: false,
                error: 'Invalid service ID'
            });
        }

        // Validate service provider ID
        if (!serviceProviderId || !mongoose.Types.ObjectId.isValid(serviceProviderId)) {
            console.log('Invalid service provider ID:', serviceProviderId);
            return res.status(400).json({
                success: false,
                error: 'Invalid service provider ID'
            });
        }

        // Find the service first to get image information
        const service = await Service.findOne({
            _id: serviceId,
            serviceProvider: serviceProviderId
        });

        if (!service) {
            console.log('Service not found for ID:', serviceId);
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        console.log('Found service to delete:', {
            id: service._id,
            name: service.name,
            images: service.images
        });

        // Delete images from Cloudinary
        if (service.images && service.images.length > 0) {
            console.log('Deleting images from Cloudinary');
            for (const image of service.images) {
                try {
                    if (image.publicId) {
                        console.log('Deleting image with publicId:', image.publicId);
                        await cloudinary.uploader.destroy(image.publicId);
                    }
                } catch (error) {
                    console.error('Error deleting image from Cloudinary:', error);
                    // Don't fail the entire operation if image deletion fails
                }
            }
        }

        // Delete the service using findByIdAndDelete
        console.log('Deleting service from database');
        const deletedService = await Service.findByIdAndDelete(serviceId);
        
        if (!deletedService) {
            console.log('No service was deleted');
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        console.log('Service deleted successfully:', deletedService);

        res.json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        console.error('Detailed error in deleteService:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });

        // Send a more detailed error response
        res.status(500).json({
            success: false,
            error: 'Failed to delete service',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Export all controller functions
module.exports = {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
}; 