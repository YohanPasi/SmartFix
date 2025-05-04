import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Upload } from 'lucide-react';
import { serviceProviderService } from '../services/serviceProviderService';
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import { Textarea } from "../components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select.jsx";

const ServiceProviderProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: '',
    province: '',
    district: '',
    city: '',
    postalCode: '',
    category: '',
    bio: '',
    open: '09:00',
    close: '18:00',
    days: [],
    services: []
  });

  const categories = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Cleaning',
    'Gardening',
    'Painting',
    'Moving',
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
    const loadProfile = async () => {
      try {
        console.log('Loading profile data...');
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login again');
          logout();
          navigate('/login');
          return;
        }
        
        const response = await serviceProviderService.getProfile(token);
        if (response.success) {
          const userData = response.data;
          console.log('Profile data loaded:', userData);
          
          setFormData({
            firstName: userData.user?.firstName || '',
            lastName: userData.user?.lastName || '',
            contactNumber: userData.contactNumber || '',
            address: userData.address || '',
            province: userData.province || '',
            district: userData.district || '',
            city: userData.city || '',
            postalCode: userData.postalCode || '',
            category: userData.category || '',
            bio: userData.bio || '',
            open: userData.businessHours?.open || '09:00',
            close: userData.businessHours?.close || '18:00',
            days: userData.businessHours?.days || [],
            services: userData.services || []
          });
          
          if (userData.profilePicture) {
            setPreviewUrl(userData.profilePicture);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      }
    };

    loadProfile();
  }, [user, logout, navigate]);

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
      formDataToSend.append('firstName', formData.firstName || '');
      formDataToSend.append('lastName', formData.lastName || '');
      
      // Add profile info with proper nesting
      formDataToSend.append('profile[contactNumber]', formData.contactNumber || '');
      formDataToSend.append('profile[address]', formData.address || '');
      formDataToSend.append('profile[province]', formData.province || '');
      formDataToSend.append('profile[district]', formData.district || '');
      formDataToSend.append('profile[city]', formData.city || '');
      formDataToSend.append('profile[postalCode]', formData.postalCode || '');
      formDataToSend.append('profile[category]', formData.category || '');
      formDataToSend.append('profile[bio]', formData.bio || '');
      
      // Add business hours with proper nesting
      formDataToSend.append('profile[businessHours][open]', formData.open || '09:00');
      formDataToSend.append('profile[businessHours][close]', formData.close || '18:00');
      formDataToSend.append('profile[businessHours][days]', JSON.stringify(formData.days || []));
      
      // Add services
      formDataToSend.append('providerDetails[services]', JSON.stringify(formData.services || []));
      
      // Add profile picture if it exists
      if (selectedImage) {
        formDataToSend.append('profilePicture', selectedImage);
      }

      // Log the form data before sending
      console.log('Form data to send:');
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Sending profile update request...');
      const response = await serviceProviderService.updateProfile(formDataToSend, user.token);
      
      if (response.success) {
        console.log('Profile update successful:', response.data);
        // Update the user state with the new data
        const updatedUser = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          profile: {
            ...user.profile,
            contactNumber: formData.contactNumber,
            address: formData.address,
            province: formData.province,
            district: formData.district,
            city: formData.city,
            postalCode: formData.postalCode,
            category: formData.category,
            bio: formData.bio,
            businessHours: {
              open: formData.open,
              close: formData.close,
              days: formData.days
            },
            profilePicture: response.data.profile?.profilePicture || user.profile?.profilePicture
          },
          providerDetails: {
            ...user.providerDetails,
            services: formData.services
          }
        };
        
        updateUser(updatedUser);
        setIsEditing(false);
        setSelectedImage(null);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        logout();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(error.message || 'Failed to update profile. Please try again.');
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
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-indigo-600" />
              )}
            </div>
            <div>
              <CardTitle>Service Provider Profile</CardTitle>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing && (
              <label className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
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
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="contactNumber">Phone Number</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? "bg-gray-100" : ""}>
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
                    className={!isEditing ? "bg-gray-100" : ""}
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
                      <SelectTrigger className={!isEditing ? "bg-gray-100" : ""}>
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
                      <SelectTrigger className={!isEditing ? "bg-gray-100" : ""}>
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
                      className={!isEditing ? "bg-gray-100" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-100" : ""}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-100" : ""}
              />
            </div>

            {/* Business Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="open">Opening Time</Label>
                  <Input
                    id="open"
                    type="time"
                    value={formData.open}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="close">Closing Time</Label>
                  <Input
                    id="close"
                    type="time"
                    value={formData.close}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-100" : ""}
                  />
                </div>
              </div>
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

export default ServiceProviderProfile; 