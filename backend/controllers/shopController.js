// controllers/shopController.js
const { cloudinary } = require('../config/cloudinary');
const User = require('../models/User');

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'shop-profiles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [{ width: 1000, height: 300, crop: 'limit' }],
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload to Cloudinary');
  }
};

// Get shop profile
exports.getShopProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error getting shop profile:', error);
    res.status(500).json({ success: false, error: 'Error getting shop profile' });
  }
};

// Update shop profile
exports.updateShopProfile = async (req, res) => {
  try {
    console.log('Update shop profile request received');
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.shopLogo) {
        const logoResult = await uploadToCloudinary(req.files.shopLogo[0]);
        user.shopDetails.shopLogo = logoResult.secure_url;
      }
      if (req.files.shopBanner) {
        const bannerResult = await uploadToCloudinary(req.files.shopBanner[0]);
        user.shopDetails.shopBanner = bannerResult.secure_url;
      }
    }

    // Update basic user info
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;

    // Update profile info
    if (req.body.profile) {
      user.profile = {
        ...user.profile,
        contactNumber: req.body.profile.contactNumber || user.profile.contactNumber,
        address: req.body.profile.address || user.profile.address,
        province: req.body.profile.province || user.profile.province,
        district: req.body.profile.district || user.profile.district
      };
    }

    // Update shop details
    if (req.body.shopDetails) {
      user.shopDetails = {
        ...user.shopDetails,
        shopName: req.body.shopDetails.shopName || user.shopDetails.shopName,
        description: req.body.shopDetails.description || user.shopDetails.description,
        category: req.body.shopDetails.category || user.shopDetails.category,
        businessRegistrationNumber: req.body.shopDetails.businessRegistrationNumber || user.shopDetails.businessRegistrationNumber,
        businessType: req.body.shopDetails.businessType || user.shopDetails.businessType,
        openingHours: req.body.shopDetails.openingHours || user.shopDetails.openingHours,
        categories: req.body.shopDetails.categories || user.shopDetails.categories,
        paymentMethods: req.body.shopDetails.paymentMethods || user.shopDetails.paymentMethods,
        deliveryOptions: req.body.shopDetails.deliveryOptions || user.shopDetails.deliveryOptions,
        socialMedia: req.body.shopDetails.socialMedia || user.shopDetails.socialMedia,
        minimumOrderAmount: Number(req.body.shopDetails.minimumOrderAmount) || user.shopDetails.minimumOrderAmount,
        deliveryRadius: Number(req.body.shopDetails.deliveryRadius) || user.shopDetails.deliveryRadius,
        taxRate: Number(req.body.shopDetails.taxRate) || user.shopDetails.taxRate
      };
    }

    // Save the user
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    
    res.json({
      success: true,
      message: 'Shop profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update shop profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating shop profile'
    });
  }
};

// Upload banner
exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file);
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.shopDetails.shopBanner = result.secure_url;
    await user.save();

    res.json({ 
      success: true,
      message: 'Banner uploaded successfully',
      bannerUrl: result.secure_url
    });
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ success: false, error: 'Error uploading banner' });
  }
};

// Upload logo
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file);
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.shopDetails.shopLogo = result.secure_url;
    await user.save();

    res.json({ 
      success: true,
      message: 'Logo uploaded successfully',
      logoUrl: result.secure_url
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ success: false, error: 'Error uploading logo' });
  }
};