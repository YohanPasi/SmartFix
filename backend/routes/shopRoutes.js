const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  updateShopProfile,
  getShopProfile,
  uploadBanner,
  uploadLogo,
} = require('../controllers/shopController');
const { upload } = require('../config/cloudinary');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get shop profile
router.get('/profile', getShopProfile);

// Update shop profile
router.put('/profile', upload.fields([
  { name: 'shopLogo', maxCount: 1 },
  { name: 'shopBanner', maxCount: 1 }
]), updateShopProfile);

// Upload routes
router.post('/upload-banner', upload.single('banner'), uploadBanner);
router.post('/upload-logo', upload.single('logo'), uploadLogo);

module.exports = router;