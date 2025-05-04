const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const { cloudinary } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'service-provider-profiles',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload to Cloudinary');
    }
};

// Get service provider profile
exports.getProfile = async (req, res) => {
    try {
        console.log('=== Get Service Provider Profile ===');
        console.log('User ID:', req.user._id);
        console.log('User Role:', req.user.role);
        
        // Check if user is a service provider
        if (req.user.role !== 'service_provider') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. User is not a service provider.'
            });
        }
        
        // Find service provider profile with populated user data
        let serviceProvider = await ServiceProvider.findOne({ user: req.user._id })
            .populate('user', 'firstName lastName email role')
            .populate('ratings.reviews.user', 'firstName lastName');
        
        // If profile doesn't exist, create a new one
        if (!serviceProvider) {
            console.log('Creating new service provider profile for user:', req.user._id);
            
            // Create session data
            const sessionData = {
                token: req.token,
                deviceInfo: req.headers['user-agent'],
                ipAddress: req.ip,
                lastActivity: Date.now(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
            };
            
            serviceProvider = new ServiceProvider({
                user: req.user._id,
                businessHours: {
                    open: '09:00',
                    close: '18:00',
                    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                },
                ratings: {
                    average: 0,
                    count: 0,
                    reviews: []
                },
                sessions: [sessionData]
            });

            try {
                await serviceProvider.save();
                console.log('New service provider profile created:', serviceProvider._id);
            } catch (saveError) {
                console.error('Error saving new service provider profile:', saveError);
                // Don't fail the request, just log the error
            }
        }

        // Always update session activity
        try {
            await serviceProvider.updateSessionActivity(req.token);
        } catch (sessionError) {
            console.error('Error updating session activity:', sessionError);
            // Don't fail the request if session update fails
        }

        // Populate user data
        serviceProvider = await ServiceProvider.findById(serviceProvider._id)
            .populate('user', 'firstName lastName email role')
            .populate('ratings.reviews.user', 'firstName lastName');

        if (!serviceProvider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider profile not found'
            });
        }

        res.json({
            success: true,
            data: serviceProvider
        });
    } catch (error) {
        console.error('Error getting service provider profile:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get service provider profile'
        });
    }
};

// Update service provider profile
exports.updateProfile = async (req, res) => {
    try {
        console.log('=== Service Provider Update Profile ===');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const userId = req.user._id;
        
        // Find or create service provider profile
        let serviceProvider = await ServiceProvider.findOne({ user: userId });
        
        if (!serviceProvider) {
            serviceProvider = new ServiceProvider({ 
                user: userId,
                businessHours: {
                    open: '09:00',
                    close: '18:00',
                    days: []
                },
                ratings: {
                    average: 0,
                    count: 0,
                    reviews: []
                }
            });
        }

        // Update profile information
        if (req.body.profile) {
            const profile = req.body.profile;
            if (typeof profile === 'string') {
                try {
                    profile = JSON.parse(profile);
                } catch (error) {
                    console.error('Error parsing profile:', error);
                }
            }

            // Update basic profile info
            if (profile.contactNumber) serviceProvider.contactNumber = profile.contactNumber;
            if (profile.address) serviceProvider.address = profile.address;
            if (profile.province) serviceProvider.province = profile.province;
            if (profile.district) serviceProvider.district = profile.district;
            if (profile.city) serviceProvider.city = profile.city;
            if (profile.postalCode) serviceProvider.postalCode = profile.postalCode;
            if (profile.category) serviceProvider.category = profile.category;
            if (profile.bio) serviceProvider.bio = profile.bio;

            // Update business hours
            if (profile.businessHours) {
                if (profile.businessHours.open) serviceProvider.businessHours.open = profile.businessHours.open;
                if (profile.businessHours.close) serviceProvider.businessHours.close = profile.businessHours.close;
                
                if (profile.businessHours.days) {
                    try {
                        const days = typeof profile.businessHours.days === 'string' ? 
                            JSON.parse(profile.businessHours.days) : 
                            profile.businessHours.days;
                        serviceProvider.businessHours.days = Array.isArray(days) ? days : [];
                    } catch (error) {
                        console.error('Error parsing days:', error);
                        serviceProvider.businessHours.days = [];
                    }
                }
            }
        }

        // Update services
        if (req.body.providerDetails) {
            const providerDetails = req.body.providerDetails;
            if (typeof providerDetails === 'string') {
                try {
                    providerDetails = JSON.parse(providerDetails);
                } catch (error) {
                    console.error('Error parsing provider details:', error);
                }
            }

            if (providerDetails.services) {
                try {
                    const services = typeof providerDetails.services === 'string' ? 
                        JSON.parse(providerDetails.services) : 
                        providerDetails.services;
                    
                    // Validate and format services
                    serviceProvider.services = services.map(service => ({
                        name: service.name || '',
                        description: service.description || '',
                        price: parseFloat(service.price) || 0,
                        duration: service.duration || ''
                    })).filter(service => service.name && service.price > 0);
                } catch (error) {
                    console.error('Error parsing services:', error);
                    serviceProvider.services = [];
                }
            }
        }

        // Handle profile picture upload
        if (req.files && req.files[0]) {
            // Delete old profile picture if exists
            if (serviceProvider.profilePicturePublicId) {
                try {
                    await cloudinary.uploader.destroy(serviceProvider.profilePicturePublicId);
                } catch (error) {
                    console.error('Error deleting old profile picture:', error);
                }
            }

            // Upload new profile picture
            const result = await cloudinary.uploader.upload(req.files[0].path, {
                folder: 'service-providers',
                resource_type: 'auto',
                transformation: [
                    { width: 500, height: 500, crop: 'limit' },
                    { quality: 'auto' }
                ]
            });
            
            serviceProvider.profilePicture = result.secure_url;
            serviceProvider.profilePicturePublicId = result.public_id;
        }

        // Update session activity
        await serviceProvider.updateSessionActivity(req.token);

        // Save the service provider profile
        const savedServiceProvider = await serviceProvider.save();
        console.log('Service provider profile saved successfully:', savedServiceProvider);

        // Populate user data for response
        const populatedServiceProvider = await ServiceProvider.findById(savedServiceProvider._id)
            .populate('user', 'firstName lastName email role')
            .populate('ratings.reviews.user', 'firstName lastName');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: populatedServiceProvider
        });
    } catch (error) {
        console.error('Service provider profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// Logout service provider
exports.logout = async (req, res) => {
    try {
        const serviceProvider = await ServiceProvider.findOne({ user: req.user._id });
        
        if (serviceProvider) {
            await serviceProvider.removeSession(req.token);
        }
        
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, error: 'Failed to logout' });
    }
}; 