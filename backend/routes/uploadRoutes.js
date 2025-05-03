const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { authenticate } = require('../middleware/auth');

// Debug middleware for upload routes
router.use((req, res, next) => {
    console.log('Upload route accessed:', req.method, req.path);
    console.log('Request headers:', req.headers);
    next();
});

// Upload route for Cloudinary
router.post('/cloudinary', authenticate, upload.single('file'), async (req, res) => {
    try {
        console.log('Upload request received');
        console.log('User:', req.user.email);
        console.log('File:', req.file);

        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Log the uploaded file details
        console.log('Uploaded file details:', {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype
        });

        // Return the Cloudinary response
        const response = {
            success: true,
            url: req.file.path,
            public_id: req.file.filename,
            secure_url: req.file.path.replace('http://', 'https://')
        };

        console.log('Upload successful:', response);
        res.json(response);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to upload file'
        });
    }
});

module.exports = router; 