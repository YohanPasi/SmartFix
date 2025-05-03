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
      lowercase: true, // Ensure emails are stored in lowercase for consistency
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
    },
    isRoleSelected: {
        type: Boolean,
        default: false,
    },

    // Profile information
    profile: {
      contactNumber: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
      province: { type: String, trim: true, default: '' },
      district: { type: String, trim: true, default: '' },
      profilePicture: { type: String, default: '' }
    },

    // Shop details for shop_owner role
    shopDetails: {
      shopName: {
        type: String,
        trim: true,
        default: '',
      },
      description: {
        type: String,
        trim: true,
        default: '',
      },
      category: {
        type: String,
        trim: true,
        default: '',
      },
      shopLogo: {
        type: String,
        trim: true,
        default: '',
      },
      shopBanner: {
        type: String,
        trim: true,
        default: '',
      },
      businessRegistrationNumber: {
        type: String,
        trim: true,
        default: '',
      },
      businessType: {
        type: String,
        trim: true,
        default: '',
      },
      openingHours: {
        monday: {
          start: { type: String, default: '09:00' },
          end: { type: String, default: '18:00' },
        },
        tuesday: {
          start: { type: String, default: '09:00' },
          end: { type: String, default: '18:00' },
        },
        wednesday: {
          start: { type: String, default: '09:00' },
          end: { type: String, default: '18:00' },
        },
        thursday: {
          start: { type: String, default: '09:00' },
          end: { type: String, default: '18:00' },
        },
        friday: {
          start: { type: String, default: '09:00' },
          end: { type: String, default: '18:00' },
        },
        saturday: {
          start: { type: String, default: '10:00' },
          end: { type: String, default: '16:00' },
        },
        sunday: {
          start: { type: String, default: '10:00' },
          end: { type: String, default: '16:00' },
        },
      },
      categories: {
        type: [String],
        default: [],
        trim: true,
      },
      paymentMethods: {
        type: [String],
        default: [],
        trim: true,
      },
      deliveryOptions: {
        type: [String],
        default: [],
        trim: true,
      },
      socialMedia: {
        facebook: {
          type: String,
          trim: true,
          default: '',
        },
        instagram: {
          type: String,
          trim: true,
          default: '',
        },
        twitter: {
          type: String,
          trim: true,
          default: '',
        },
        website: {
          type: String,
          trim: true,
          default: '',
        },
      },
      minimumOrderAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      deliveryRadius: {
        type: Number,
        default: 0,
        min: 0,
      },
      taxRate: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Provider details for provider role
    providerDetails: {
      qualifications: {
        type: [String],
        default: [],
        trim: true,
      },
      services: {
        type: [String],
        default: [],
        trim: true,
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
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
        const token = jwt.sign(
            { 
                id: this._id,
                email: this.email,
                role: this.role,
        isRoleSelected: this.isRoleSelected,
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { 
                expiresIn: '24h',
        algorithm: 'HS256',
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded;
    } catch (error) {
        console.error('Token verification error:', error);
        throw error;
    }
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User; 