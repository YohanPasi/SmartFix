import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import toast from 'react-hot-toast';
import { User, Upload } from 'lucide-react';
import { serviceProviderService } from '../services/serviceProviderService';

const ServiceProviderProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    address: '',
    province: '',
    district: '',
    city: '',
    postalCode: '',
    businessHours: {
      open: '',
      close: '',
      days: []
    },
    services: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const categories = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Cleaning',
    'Gardening',
    'Painting',
    'Moving',
    'Repair',
    'Installation',
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

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user) {
          const response = await serviceProviderService.getProfile();
          if (response.success) {
            const userData = response.data;
            setFormData({
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              category: userData.category || '',
              description: userData.description || '',
              address: userData.address || '',
              province: userData.province || '',
              district: userData.district || '',
              city: userData.city || '',
              postalCode: userData.postalCode || '',
              businessHours: userData.businessHours || {
                open: '',
                close: '',
                days: []
              },
              services: userData.services || []
            });
            setPreviewUrl(userData.profilePicture || '');
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleBusinessHoursChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [id]: value
      }
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        days: prev.businessHours.days.includes(day)
          ? prev.businessHours.days.filter(d => d !== day)
          : [...prev.businessHours.days, day]
      }
    }));
  };

  const handleServiceAdd = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', price: '', description: '' }]
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const handleServiceRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
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
      
      // Add basic info
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('province', formData.province);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('postalCode', formData.postalCode);
      
      // Add business hours
      formDataToSend.append('businessHours[open]', formData.businessHours.open);
      formDataToSend.append('businessHours[close]', formData.businessHours.close);
      formData.businessHours.days.forEach(day => {
        formDataToSend.append('businessHours[days][]', day);
      });
      
      // Add services
      formData.services.forEach((service, index) => {
        formDataToSend.append(`services[${index}][name]`, service.name);
        formDataToSend.append(`services[${index}][price]`, service.price);
        formDataToSend.append(`services[${index}][description]`, service.description);
      });
      
      // Add profile picture if selected
      if (selectedImage) {
        formDataToSend.append('profilePicture', selectedImage);
      }

      const response = await serviceProviderService.updateProfile(formDataToSend);
      
      if (response.success) {
        // Update the user state with the new data
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          description: formData.description,
          address: formData.address,
          province: formData.province,
          district: formData.district,
          city: formData.city,
          postalCode: formData.postalCode,
          businessHours: formData.businessHours,
          services: formData.services,
          profilePicture: response.data.profilePicture || user.profilePicture
        };
        
        updateUser(updatedUser);
        setIsEditing(false);
        setSelectedImage(null);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
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
                  <Label htmlFor="category">Service Category</Label>
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

            {/* Business Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="open">Opening Time</Label>
                  <Input
                    id="open"
                    type="time"
                    value={formData.businessHours.open}
                    onChange={handleBusinessHoursChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="close">Closing Time</Label>
                  <Input
                    id="close"
                    type="time"
                    value={formData.businessHours.close}
                    onChange={handleBusinessHoursChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label>Business Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {days.map(day => (
                    <Button
                      key={day}
                      type="button"
                      variant={formData.businessHours.days.includes(day) ? "default" : "outline"}
                      onClick={() => handleDayToggle(day)}
                      disabled={!isEditing}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Services</h3>
                {isEditing && (
                  <Button type="button" onClick={handleServiceAdd}>
                    Add Service
                  </Button>
                )}
              </div>
              {formData.services.map((service, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Service Name</Label>
                    <Input
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Price (Rs.)</Label>
                    <Input
                      type="number"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="destructive"
                      className="col-span-full"
                      onClick={() => handleServiceRemove(index)}
                    >
                      Remove Service
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Service Provider Description</Label>
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

export default ServiceProviderProfile; 