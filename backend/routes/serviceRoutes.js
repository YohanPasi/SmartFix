const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { 
    getServices, 
    getService, 
    createService, 
    updateService, 
    deleteService 
} = require('../controllers/serviceController');
const multer = require('multer');
const path = require('path');

// Debug logging
console.log('Service Routes - Initializing...');
console.log('Service Controller Methods:', {
    getServices: typeof getServices,
    getService: typeof getService,
    createService: typeof createService,
    updateService: typeof updateService,
    deleteService: typeof deleteService
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

// Service routes with authentication middleware
console.log('Setting up service routes...');
try {
    console.log('Setting up GET / route...');
    router.get('/', authenticate, getServices);
    
    console.log('Setting up GET /:id route...');
    router.get('/:id', authenticate, getService);
    
    console.log('Setting up POST / route...');
    router.post('/', authenticate, upload.array('images', 5), createService);
    
    console.log('Setting up PUT /:id route...');
    router.put('/:id', authenticate, upload.array('images', 5), updateService);
    
    console.log('Setting up DELETE /:id route...');
    router.delete('/:id', authenticate, deleteService);
    
    console.log('All service routes set up successfully');
} catch (error) {
    console.error('Error setting up service routes:', error);
    throw error;
}

module.exports = router; 