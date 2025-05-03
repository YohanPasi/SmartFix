const User = require('../models/User');

const userController = {
    // Get all users
    getUsers: async (req, res) => {
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
    },

    // Get single user
    getUser: async (req, res) => {
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
    },

    // Create user
    createUser: async (req, res) => {
        try {
            const { email, password, firstName, lastName, role } = req.body;

            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    success: false,
                    error: 'User already exists'
                });
            }

            // Create new user
            user = new User({
                email,
                password,
                firstName,
                lastName,
                role
            });

            await user.save();

            // Generate token
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
    },

    // Update user
    updateUser: async (req, res) => {
        try {
            const { firstName, lastName, role } = req.body;
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Update user fields
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
    },

    // Delete user
    deleteUser: async (req, res) => {
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
    }
};

module.exports = userController; 