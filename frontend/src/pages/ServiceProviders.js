import React, { useState, useEffect } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import { categories, districts, serviceProviders } from '../data/serviceProviders';
import { useNavigate } from 'react-router-dom';

const ServiceProviders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sortBy, setSortBy] = useState('experience');
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get both types of service providers
    const defaultProviders = serviceProviders;
    const registeredProviders = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
    
    // Convert registered providers to match the default provider structure
    const convertedProviders = registeredProviders.map(provider => ({
      id: provider.id || Math.random().toString(36).substr(2, 9),
      name: `${provider.firstName} ${provider.lastName}`,
      category: provider.category,
      experience: provider.experience,
      district: provider.district,
      address: provider.address,
      hourlyRate: provider.hourlyRate || 'Contact for rates',
      profilePicture: provider.profilePicture || 'https://via.placeholder.com/150',
      description: provider.description || 'Professional service provider',
      reviews: provider.reviews || [],
      previousWorks: provider.previousWorks || [],
      contactNumber: provider.contactNumber,
      email: provider.email
    }));

    // Merge both arrays and remove duplicates based on email
    const mergedProviders = [...defaultProviders];
    convertedProviders.forEach(provider => {
      if (!mergedProviders.some(p => p.email === provider.email)) {
        mergedProviders.push(provider);
      }
    });

    // Filter out any invalid providers
    const validProviders = mergedProviders.filter(provider => 
      provider && 
      typeof provider === 'object' && 
      provider.name && 
      provider.category
    );

    // Save the merged providers back to localStorage for consistency
    localStorage.setItem('allServiceProviders', JSON.stringify(validProviders));

    setProviders(validProviders);
  }, []);

  const filteredProviders = providers
    .filter(provider => {
      if (!provider || !provider.name || !provider.category) return false;
      
      const matchesSearch = 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || provider.category === selectedCategory;
      const matchesDistrict = !selectedDistrict || provider.district === selectedDistrict;
      return matchesSearch && matchesCategory && matchesDistrict;
    })
    .sort((a, b) => {
      if (sortBy === 'experience') {
        return (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0);
      }
      return (a.district || '').localeCompare(b.district || '');
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or category..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="experience">Sort by Experience</option>
              <option value="district">Sort by District</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Providers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map(provider => (
          <div
            key={provider.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={provider.profilePicture || 'https://via.placeholder.com/150'}
                  alt={provider.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.category}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Service Provider
                  </span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Experience:</span> {provider.experience || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">District:</span> {provider.district || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Hourly Rate:</span> {provider.hourlyRate || 'N/A'}
                </p>
              </div>
              
              {provider.reviews && provider.reviews.length > 0 && (
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < Math.floor(provider.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / provider.reviews.length)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({provider.reviews.length} reviews)
                  </span>
                </div>
              )}
              
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                onClick={() => navigate(`/service-providers/${provider.id}`)}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProviders; 