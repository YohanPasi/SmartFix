const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No token or invalid format in header:', authHeader);
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('No token found in Bearer format');
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            console.log('Token verified successfully for user:', decoded.id);

            // Find user
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                console.log('User not found for ID:', decoded.id);
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Attach user to request
            req.user = user;
            console.log('User authenticated successfully:', user.email);
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expired'
                });
            }
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error during authentication'
        });
    }
};

module.exports = { authenticate }; 