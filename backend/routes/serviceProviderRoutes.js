const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { updateProfile, getProfile, logout } = require('../controllers/serviceProviderController');
const { upload } = require('../config/cloudinary');

// Debug middleware
router.use((req, res, next) => {
    console.log('=== Service Provider Route Debug ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user);
    next();
});

// Apply authentication middleware to all routes
router.use(authenticate);

// Get service provider profile
router.get('/profile', getProfile);

// Update service provider profile
router.put('/profile', upload.array('profilePicture', 1), (req, res, next) => {
    console.log('=== Service Provider Update Profile Route ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request files:', req.files);
    
    // Parse nested form data
    if (req.body.profile) {
        try {
            req.body.profile = JSON.parse(req.body.profile);
        } catch (error) {
            console.error('Error parsing profile data:', error);
        }
    }
    
    if (req.body.providerDetails) {
        try {
            req.body.providerDetails = JSON.parse(req.body.providerDetails);
        } catch (error) {
            console.error('Error parsing provider details:', error);
        }
    }
    
    next();
}, updateProfile);

// Logout route
router.post('/logout', logout);

module.exports = router; 