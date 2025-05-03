const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with hardcoded values
cloudinary.config({
    cloud_name: 'dyxpeyv1n',
    api_key: '638285539433682',
    api_secret: '1Bi_AO9_t0TGYimIWs7QxB5Jg8k'
});

console.log('Cloudinary config:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? '***' : undefined,
    api_secret: cloudinary.config().api_secret ? '***' : undefined
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
        resource_type: 'auto'
    }
});

// Configure multer upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            console.log('File accepted:', file.originalname);
            cb(null, true);
        } else {
            console.log('File rejected:', file.originalname, 'Mime type:', file.mimetype);
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

module.exports = { cloudinary, upload }; 