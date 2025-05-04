const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid token. User not found.' });
        }

        // Add user and token to request first
        req.user = user;
        req.token = token;

        // If user is a service provider, check session
        if (user.role === 'service_provider') {
            try {
                let serviceProvider = await ServiceProvider.findOne({ user: user._id });
                
                if (serviceProvider) {
                    // Check if session is valid
                    if (!serviceProvider.isValidSession(token)) {
                        // Create a new session if the current one is invalid
                        const sessionData = {
                            token: token,
                            deviceInfo: req.headers['user-agent'],
                            ipAddress: req.ip,
                            lastActivity: Date.now(),
                            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
                        };
                        await serviceProvider.addSession(sessionData);
                        console.log('New session created for existing service provider:', user._id);
                    } else {
                        // Update session activity
                        await serviceProvider.updateSessionActivity(token);
                    }
                } else {
                    // Create new service provider profile if it doesn't exist
                    const sessionData = {
                        token: token,
                        deviceInfo: req.headers['user-agent'],
                        ipAddress: req.ip,
                        lastActivity: Date.now(),
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
                    };

                    serviceProvider = new ServiceProvider({
                        user: user._id,
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

                    await serviceProvider.save();
                    console.log('New service provider profile created during authentication:', user._id);
                }
            } catch (error) {
                console.error('Error handling service provider session:', error);
                // Don't fail the authentication if there's an error with the service provider profile
            }
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Token expired. Please login again.' });
        }
        res.status(401).json({ success: false, error: 'Invalid token.' });
    }
};

module.exports = {
    authenticate: authenticateToken
}; 