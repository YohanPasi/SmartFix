const Product = require('../models/Product');
const { upload } = require('../config/cloudinary');
const { validateProduct } = require('../utils/validators');

// Get all products for a shop
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ shopId: req.user._id });
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
};

// Get a single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            shopId: req.user._id
        });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        // Validate product data
        const { error } = validateProduct(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        // Create new product
        const product = new Product({
            shopId: req.user._id,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            images: req.files ? req.files.map(file => file.path) : []
        });

        await product.save();
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, error: 'Failed to create product' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        // Validate product data
        const { error } = validateProduct(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        // Find the product
        const product = await Product.findOne({
            _id: req.params.id,
            shopId: req.user._id
        });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Update product
        product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;
        product.category = req.body.category;
        product.stock = req.body.stock;
        
        // Add new images if any
        if (req.files && req.files.length > 0) {
            product.images = [...product.images, ...req.files.map(file => file.path)];
        }

        await product.save();
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, error: 'Failed to update product' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        // First find the product to ensure it exists and belongs to the shop
        const product = await Product.findOne({
            _id: req.params.id,
            shopId: req.user._id
        });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Delete the product
        await Product.deleteOne({ _id: req.params.id });

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        // Send more detailed error message
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to delete product',
            details: error.stack
        });
    }
}; 