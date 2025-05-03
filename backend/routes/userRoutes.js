const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// Debug middleware
router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Protected routes
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

router.put('/profile', authenticate, async (req, res) => {
    try {
        console.log('Profile update request body:', req.body);
        const { firstName, lastName, profile } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update basic info
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        // Initialize profile if it doesn't exist
        if (!user.profile) {
            user.profile = {};
        }

        // Update profile fields if they exist
        if (profile) {
            // Update each field if it exists in the request
            if (profile.contactNumber !== undefined) {
                user.profile.contactNumber = profile.contactNumber;
            }
            if (profile.address !== undefined) {
                user.profile.address = profile.address;
            }
            if (profile.province !== undefined) {
                user.profile.province = profile.province;
            }
            if (profile.district !== undefined) {
                user.profile.district = profile.district;
            }
            if (profile.bio !== undefined) {
                user.profile.bio = profile.bio;
            }
            
            // Handle profilePicture update
            if (profile.profilePicture === null) {
                // If explicitly set to null, remove the profile picture
                user.profile.profilePicture = null;
            } else if (profile.profilePicture && 
                      typeof profile.profilePicture === 'object' && 
                      profile.profilePicture.url && 
                      profile.profilePicture.public_id) {
                // If valid profile picture object is provided, update it
                user.profile.profilePicture = {
                    url: profile.profilePicture.url,
                    public_id: profile.profilePicture.public_id
                };
            }
            // If profilePicture is undefined, keep the existing value
        }

        // Save the user
        await user.save();

        // Return the updated user without the password
        const updatedUser = await User.findById(user._id).select('-password');
        
        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error('Update profile error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            success: false,
            error: error.message || 'Server error'
        });
    }
});

router.put('/role', authenticate, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        user.role = role;
        user.isRoleSelected = true;
        await user.save();

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// General user routes
router.get('/', authenticate, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: 'User already exists'
            });
        }

        user = new User({
            email,
            password,
            firstName,
            lastName,
            role
        });

        await user.save();
        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            data: user,
            token
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    try {
        const { firstName, lastName, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (role) user.role = role;

        await user.save();

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

module.exports = router; 