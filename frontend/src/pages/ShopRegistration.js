import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import toast from 'react-hot-toast';

const ShopRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
    services: [],
    images: [],
    documents: []
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

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const handleProvinceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      province: value,
      district: '' // Reset district when province changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate location fields
    if (!formData.address.trim()) {
      toast.error('Please enter your complete address');
      return;
    }

    if (!formData.province) {
      toast.error('Please select your province');
      return;
    }

    if (!formData.district) {
      toast.error('Please select your district');
      return;
    }

    if (!formData.city.trim()) {
      toast.error('Please enter your city');
      return;
    }

    if (!formData.postalCode.trim()) {
      toast.error('Please enter your postal code');
      return;
    }

    // Validate business hours
    if (formData.businessHours.days.length === 0) {
      toast.error('Please select at least one business day');
      return;
    }

    if (!formData.businessHours.open || !formData.businessHours.close) {
      toast.error('Please set your business hours');
      return;
    }

    // Validate services
    if (formData.services.length === 0) {
      toast.error('Please add at least one service');
      return;
    }

    // Validate all services have required fields
    const invalidService = formData.services.find(service => 
      !service.name.trim() || !service.price || !service.description.trim()
    );
    if (invalidService) {
      toast.error('Please fill in all service details');
      return;
    }

    // Get existing shops from localStorage
    const existingShops = JSON.parse(localStorage.getItem('shops') || '[]');
    
    // Check if email already exists
    if (existingShops.some(shop => shop.email === formData.email)) {
      toast.error('Email already registered');
      return;
    }
    
    // Create new shop object
    const newShop = {
      id: `SHOP${Date.now()}`,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      rating: 0,
      reviews: []
    };
    
    // Add new shop to the list
    const updatedShops = [...existingShops, newShop];
    
    // Save back to localStorage
    localStorage.setItem('shops', JSON.stringify(updatedShops));
    
    toast.success('Shop registration submitted successfully!');
    navigate('/login');
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Shop Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Shop Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter shop name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
              <h3 className="text-lg font-semibold">Location Information *</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    required
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Select
                      value={formData.province}
                      onValueChange={handleProvinceChange}
                      required
                    >
                      <SelectTrigger className="w-full">
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
                    <Label htmlFor="district">District *</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
                      disabled={!formData.province}
                      required
                    >
                      <SelectTrigger className="w-full">
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
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Enter postal code"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Hours *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="open">Opening Time *</Label>
                  <Input
                    id="open"
                    type="time"
                    value={formData.businessHours.open}
                    onChange={handleBusinessHoursChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="close">Closing Time *</Label>
                  <Input
                    id="close"
                    type="time"
                    value={formData.businessHours.close}
                    onChange={handleBusinessHoursChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Business Days *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {days.map(day => (
                    <Button
                      key={day}
                      type="button"
                      variant={formData.businessHours.days.includes(day) ? "default" : "outline"}
                      onClick={() => handleDayToggle(day)}
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
                <h3 className="text-lg font-semibold">Services *</h3>
                <Button type="button" onClick={handleServiceAdd}>
                  Add Service
                </Button>
              </div>
              {formData.services.map((service, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Service Name *</Label>
                    <Input
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                      placeholder="Enter service name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Price (Rs.) *</Label>
                    <Input
                      type="number"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Input
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      placeholder="Enter service description"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    className="col-span-full"
                    onClick={() => handleServiceRemove(index)}
                  >
                    Remove Service
                  </Button>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Shop Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter shop description"
                required
                className="mt-2"
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Uploads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Shop Images</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Business Documents</Label>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleDocumentUpload}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Security *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Register Shop
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopRegistration; 