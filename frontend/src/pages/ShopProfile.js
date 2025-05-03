import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Store, Upload } from 'lucide-react';
import { shopService } from '../services/shopService'; // Updated to use shopService
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const ShopProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    address: '',
    province: '',
    district: '',
    city: '',
    postalCode: '',
    businessRegistrationNumber: '',
    businessType: '',
    openingHours: {},
    categories: [],
    paymentMethods: [],
    deliveryOptions: [],
    socialMedia: {},
    minimumOrderAmount: 0,
    deliveryRadius: 0,
    taxRate: 0
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty & Wellness',
    'Food & Beverage',
    'Sports & Outdoors',
    'Books & Stationery',
    'Toys & Games',
    'Health & Pharmacy',
    'Other'
  ];

  const provinces = [
    'Western',
    'Central',
    'Southern',
    'Northern',
    'Eastern',
    'North Western',
    'North Central',
    'Uva',
    'Sabaragamuwa'
  ];

  const districts = {
    'Western': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern': ['Galle', 'Matara', 'Hambantota'],
    'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
    'Eastern': ['Batticaloa', 'Ampara', 'Trincomalee'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Anuradhapura', 'Polonnaruwa'],
    'Uva': ['Badulla', 'Monaragala'],
    'Sabaragamuwa': ['Ratnapura', 'Kegalle']
  };

  useEffect(() => {
    if (user) {
      setFormData({
        shopName: user.shopDetails?.shopName || '',
        email: user.email || '',
        phone: user.shopDetails?.phone || '',
        category: user.shopDetails?.category || '',
        description: user.shopDetails?.description || '',
        address: user.shopDetails?.address || '',
        province: user.shopDetails?.province || '',
        district: user.shopDetails?.district || '',
        city: user.shopDetails?.city || '',
        postalCode: user.shopDetails?.postalCode || '',
        businessRegistrationNumber: user.shopDetails?.businessRegistrationNumber || '',
        businessType: user.shopDetails?.businessType || '',
        openingHours: user.shopDetails?.openingHours || {},
        categories: user.shopDetails?.categories || [],
        paymentMethods: user.shopDetails?.paymentMethods || [],
        deliveryOptions: user.shopDetails?.deliveryOptions || [],
        socialMedia: user.shopDetails?.socialMedia || {},
        minimumOrderAmount: user.shopDetails?.minimumOrderAmount || 0,
        deliveryRadius: user.shopDetails?.deliveryRadius || 0,
        taxRate: user.shopDetails?.taxRate || 0
      });
      setPreviewUrl(user.shopDetails?.shopLogo || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleProvinceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      province: value,
      district: '' // Reset district when province changes
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate image size (max 5MB)
      if (selectedImage && selectedImage.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const formDataToSend = new FormData();
      
      // Add basic user info
      formDataToSend.append('firstName', user.firstName);
      formDataToSend.append('lastName', user.lastName);
      
      // Add profile info
      formDataToSend.append('profile[contactNumber]', formData.phone || '');
      formDataToSend.append('profile[address]', formData.address || '');
      formDataToSend.append('profile[province]', formData.province || '');
      formDataToSend.append('profile[district]', formData.district || '');
      
      // Add shop details
      formDataToSend.append('shopDetails[shopName]', formData.shopName || '');
      formDataToSend.append('shopDetails[description]', formData.description || '');
      formDataToSend.append('shopDetails[category]', formData.category || '');
      formDataToSend.append('shopDetails[businessRegistrationNumber]', formData.businessRegistrationNumber || '');
      formDataToSend.append('shopDetails[businessType]', formData.businessType || '');
      
      // Add opening hours
      if (formData.openingHours) {
        Object.entries(formData.openingHours).forEach(([day, hours]) => {
          formDataToSend.append(`shopDetails[openingHours][${day}][start]`, hours.start);
          formDataToSend.append(`shopDetails[openingHours][${day}][end]`, hours.end);
        });
      }
      
      // Add arrays
      if (formData.categories) {
        formData.categories.forEach(category => {
          formDataToSend.append('shopDetails[categories][]', category);
        });
      }
      
      if (formData.paymentMethods) {
        formData.paymentMethods.forEach(method => {
          formDataToSend.append('shopDetails[paymentMethods][]', method);
        });
      }
      
      if (formData.deliveryOptions) {
        formData.deliveryOptions.forEach(option => {
          formDataToSend.append('shopDetails[deliveryOptions][]', option);
        });
      }
      
      // Add social media
      if (formData.socialMedia) {
        Object.entries(formData.socialMedia).forEach(([platform, url]) => {
          formDataToSend.append(`shopDetails[socialMedia][${platform}]`, url);
        });
      }
      
      // Add numbers
      formDataToSend.append('shopDetails[minimumOrderAmount]', formData.minimumOrderAmount || 0);
      formDataToSend.append('shopDetails[deliveryRadius]', formData.deliveryRadius || 0);
      formDataToSend.append('shopDetails[taxRate]', formData.taxRate || 0);
      
      // Add images if they exist
      if (selectedImage) {
        formDataToSend.append('shopLogo', selectedImage);
      }

      const response = await shopService.updateShopProfile(formDataToSend);
      
      if (response.success) {
        // Update the user state with the new data
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            contactNumber: formData.phone,
            address: formData.address,
            province: formData.province,
            district: formData.district
          },
          shopDetails: {
            ...user.shopDetails,
            ...formData,
            shopLogo: response.data.shopDetails?.shopLogo || user.shopDetails?.shopLogo
          }
        };
        
        updateUser(updatedUser);
        setIsEditing(false);
        setSelectedImage(null);
        toast.success('Shop profile updated successfully!');
      }
    } catch (error) {
      console.error('Shop profile update error:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        logout();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(error.message || 'Failed to update shop profile. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Shop Logo" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <Store className="h-8 w-8 text-indigo-600" />
              )}
            </div>
            <div>
              <CardTitle>Shop Profile</CardTitle>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing && (
              <label className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Change Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="address">Complete Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Select
                      value={formData.province}
                      onValueChange={handleProvinceChange}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map(province => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
                      disabled={!formData.province || !isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.province && districts[formData.province].map(district => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Shop Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {isEditing && (
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopProfile;