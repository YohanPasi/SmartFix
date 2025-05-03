const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
        enum: [
            'electronics',
            'fashion',
            'home',
            'beauty',
            'sports',
            'toys',
            'books',
            'food',
            'health',
            'automotive'
        ]
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    images: [{
        type: String,
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ shopId: 1, category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 