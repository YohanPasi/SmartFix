const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    // Basic user information
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'service_provider', 'shop_owner', 'admin'],
        default: 'user',
        trim: true,
        lowercase: true
    },
    isRoleSelected: {
        type: Boolean,
        default: false,
    },

    // Profile information
    profile: {
        type: {
            contactNumber: { type: String, trim: true, default: '' },
            address: { type: String, trim: true, default: '' },
            province: { type: String, trim: true, default: '' },
            district: { type: String, trim: true, default: '' },
            city: { type: String, trim: true, default: '' },
            postalCode: { type: String, trim: true, default: '' },
            profilePicture: { type: String, default: '' },
            profilePicturePublicId: { type: String, default: '' },
            category: { type: String, trim: true, default: '' },
            bio: { type: String, trim: true, default: '' },
            businessHours: {
                type: {
                    open: { type: String, default: '09:00' },
                    close: { type: String, default: '18:00' },
                    days: [{ type: String }]
                },
                default: {
                    open: '09:00',
                    close: '18:00',
                    days: []
                }
            }
        },
        default: {
            contactNumber: '',
            address: '',
            province: '',
            district: '',
            city: '',
            postalCode: '',
            profilePicture: '',
            profilePicturePublicId: '',
            category: '',
            bio: '',
            businessHours: {
                open: '09:00',
                close: '18:00',
                days: []
            }
        }
    },

    // Shop details for shop_owner role
    shopDetails: {
        type: {
            shopName: { type: String, trim: true, default: '' },
            description: { type: String, trim: true, default: '' },
            category: { type: String, trim: true, default: '' },
            shopLogo: { type: String, trim: true, default: '' },
            shopBanner: { type: String, trim: true, default: '' },
            businessRegistrationNumber: { type: String, trim: true, default: '' },
            businessType: { type: String, trim: true, default: '' },
            openingHours: {
                type: {
                    monday: { type: { start: String, end: String }, default: { start: '09:00', end: '18:00' } },
                    tuesday: { type: { start: String, end: String }, default: { start: '09:00', end: '18:00' } },
                    wednesday: { type: { start: String, end: String }, default: { start: '09:00', end: '18:00' } },
                    thursday: { type: { start: String, end: String }, default: { start: '09:00', end: '18:00' } },
                    friday: { type: { start: String, end: String }, default: { start: '09:00', end: '18:00' } },
                    saturday: { type: { start: String, end: String }, default: { start: '09:00', end: '18:00' } },
                    sunday: { type: { start: String, end: String }, default: { start: '09:00', end: '18:00' } }
                },
                default: {
                    monday: { start: '09:00', end: '18:00' },
                    tuesday: { start: '09:00', end: '18:00' },
                    wednesday: { start: '09:00', end: '18:00' },
                    thursday: { start: '09:00', end: '18:00' },
                    friday: { start: '09:00', end: '18:00' },
                    saturday: { start: '09:00', end: '18:00' },
                    sunday: { start: '09:00', end: '18:00' }
                }
            }
        },
        default: {
            shopName: '',
            description: '',
            category: '',
            shopLogo: '',
            shopBanner: '',
            businessRegistrationNumber: '',
            businessType: '',
            openingHours: {
                monday: { start: '09:00', end: '18:00' },
                tuesday: { start: '09:00', end: '18:00' },
                wednesday: { start: '09:00', end: '18:00' },
                thursday: { start: '09:00', end: '18:00' },
                friday: { start: '09:00', end: '18:00' },
                saturday: { start: '09:00', end: '18:00' },
                sunday: { start: '09:00', end: '18:00' }
            }
        }
    },

    // Provider details for service_provider role
    providerDetails: {
        type: {
            qualifications: [{ type: String, trim: true }],
            services: [{
                name: { type: String, trim: true, default: '' },
                price: { type: Number, default: 0 },
                description: { type: String, trim: true, default: '' }
            }]
        },
        default: {
            qualifications: [],
            services: []
        }
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    try {
        // Only hash the password if it has been modified (or is new)
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        console.error('Password hashing error:', error);
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Generate auth token
userSchema.methods.generateAuthToken = function () {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(
            { 
                id: this._id,
                email: this.email,
                role: this.role,
                isRoleSelected: this.isRoleSelected
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '24h',
                algorithm: 'HS256'
            }
        );
        console.log('Generated token for user:', this.email);
        return token;
    } catch (error) {
        console.error('Token generation error:', error);
        throw error;
    }
};

// Verify token method
userSchema.statics.verifyToken = function (token) {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Token verification error:', error);
        throw error;
    }
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User; 