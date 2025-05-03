const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cloudinary, upload } = require('../config/cloudinary');

const authController = {
    signup: async (req, res) => {
        try {
            const { email, firstName, lastName, password, role } = req.body;
            console.log('Signup attempt for email:', email, 'with role:', role);

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('User already exists:', email);
                return res.status(400).json({
                    success: false,
                    error: 'Email already registered'
                });
            }

            // Create new user with role
            const user = new User({
                email,
                firstName,
                lastName,
                password,
                role: role || 'user',  // Use provided role or default to 'user'
                isRoleSelected: !!role  // Set to true if role is provided
            });

            // Validate the user object before saving
            const validationError = user.validateSync();
            if (validationError) {
                console.error('Validation error:', validationError);
                return res.status(400).json({
                    success: false,
                    error: validationError.message
                });
            }

            await user.save();
            console.log('User created successfully:', email);

            // Generate token
            const token = user.generateAuthToken();

            res.status(201).json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isRoleSelected: user.isRoleSelected
                    }
                }
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to create user'
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Login attempt for email:', email);

            if (!email || !password) {
                console.log('Missing email or password');
                return res.status(400).json({
                    success: false,
                    error: 'Please provide both email and password'
                });
            }

            // Find user
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                console.log('User not found for email:', email);
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            console.log('User found:', {
                email: user.email,
                hashedPassword: user.password
            });

            // Check password
            const isMatch = await user.comparePassword(password);
            console.log('Password match result:', isMatch);
            
            if (!isMatch) {
                console.log('Password mismatch for user:', email);
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            // Generate token
            const token = user.generateAuthToken();
            console.log('Login successful for user:', email);

            // Prepare user data without password
            const userData = {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profile: user.profile,
                isRoleSelected: !!user.role
            };

            res.status(200).json({
                success: true,
                data: {
                    token,
                    user: userData
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
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
                error: error.message
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            console.log('Update profile request body:', req.body);
            const userId = req.user.id;
            console.log('Updating profile for user:', userId);

            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // Update basic user fields
            if (req.body.firstName) user.firstName = req.body.firstName;
            if (req.body.lastName) user.lastName = req.body.lastName;
            if (req.body.role) user.role = req.body.role;

            // Update profile fields
            if (req.body.profile) {
                // Initialize profile if it doesn't exist
                if (!user.profile) {
                    user.profile = {};
                }

                // Update each field if it exists in the request
                if (req.body.profile.contactNumber !== undefined) {
                    user.profile.contactNumber = req.body.profile.contactNumber;
                }
                if (req.body.profile.address !== undefined) {
                    user.profile.address = req.body.profile.address;
                }
                if (req.body.profile.province !== undefined) {
                    user.profile.province = req.body.profile.province;
                }
                if (req.body.profile.district !== undefined) {
                    user.profile.district = req.body.profile.district;
                }
                
                // Handle profile picture update
                if (req.body.profile.profilePicture !== undefined) {
                    user.profile.profilePicture = req.body.profile.profilePicture;
                }
            }

            // Validate the user object before saving
            const validationError = user.validateSync();
            if (validationError) {
                console.error('Validation error:', validationError);
                return res.status(400).json({
                    success: false,
                    error: validationError.message
                });
            }

            // Save the user
            await user.save();

            // Return the updated user without the password
            const updatedUser = await User.findById(userId).select('-password');
            
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
    },

    updateRole: async (req, res) => {
        try {
            const { role } = req.body;
            const userId = req.user._id;

            console.log('Updating role for user:', userId, 'to:', role);
            console.log('Request body:', req.body);
            console.log('User from request:', req.user);

            // Validate role
            const validRoles = ['user', 'service_provider', 'shop_owner', 'admin'];
            if (!validRoles.includes(role)) {
                console.log('Invalid role selected:', role);
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
                console.log('User not found:', userId);
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
    }
};

module.exports = authController; 