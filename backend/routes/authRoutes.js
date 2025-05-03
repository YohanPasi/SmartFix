const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');
const { upload } = require('../config/cloudinary');
const User = require('../models/User');

// Debug middleware for auth routes
router.use((req, res, next) => {
    console.log('Auth route accessed:', req.method, req.path);
    next();
});

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/role', authenticate, async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.user._id;

        console.log('Updating role for user:', userId, 'to:', role);

        // Validate role
        const validRoles = ['user', 'service_provider', 'shop_owner', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid role selected'
            });
        }

        // Update user role
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                role,
                isRoleSelected: true
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        console.log('Role updated successfully:', user);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error updating role'
        });
    }
});

// Debug route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working' });
});

// Log all registered routes
console.log('Registered auth routes:');
router.stack.forEach(r => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router; 