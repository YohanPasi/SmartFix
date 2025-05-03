const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    businessRegistrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    businessType: {
        type: String,
        required: true,
        enum: ['Retail', 'Wholesale', 'Online Store', 'Boutique', 'Supermarket']
    },
    description: {
        type: String,
        trim: true
    },
    shopBanner: {
        type: String
    },
    shopLogo: {
        type: String
    },
    contact: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        }
    },
    openingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    categories: [{
        type: String
    }],
    paymentMethods: [{
        type: String
    }],
    deliveryOptions: [{
        type: String
    }],
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        website: String
    },
    businessSettings: {
        minimumOrderAmount: {
            type: Number,
            default: 0
        },
        deliveryRadius: {
            type: Number,
            default: 0
        },
        taxRate: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
shopSchema.index({ shopName: 1 });
shopSchema.index({ 'contact.email': 1 });
shopSchema.index({ categories: 1 });
shopSchema.index({ status: 1 });

module.exports = mongoose.model('Shop', shopSchema); 