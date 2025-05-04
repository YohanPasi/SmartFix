const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    // Reference to the ServiceProvider
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true
    },
    // Service details
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['cleaning', 'plumbing', 'electrical', 'carpentry', 'painting', 'gardening', 'moving', 'appliance', 'pest', 'other']
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['one-time', 'recurring', 'emergency'],
        default: 'one-time'
    },
    // Service status
    isActive: {
        type: Boolean,
        default: true
    },
    // Service images
    images: [{
        url: String,
        publicId: String
    }],
    // Service availability
    availability: {
        type: String,
        enum: ['available', 'unavailable', 'limited'],
        default: 'available'
    },
    // Service requirements
    requirements: [{
        type: String,
        trim: true
    }],
    // Service equipment and materials
    equipmentProvided: {
        type: Boolean,
        default: false
    },
    materialsIncluded: {
        type: Boolean,
        default: false
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
serviceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 