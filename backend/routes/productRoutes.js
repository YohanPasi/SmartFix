const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all products for the authenticated shop
router.get('/', getProducts);

// Get a single product
router.get('/:id', getProduct);

// Create a new product
router.post('/', 
    upload.array('images', 5), // Allow up to 5 images
    createProduct
);

// Update a product
router.put('/:id',
    upload.array('images', 5),
    updateProduct
);

// Delete a product
router.delete('/:id', deleteProduct);

module.exports = router; 