import React, { useState } from 'react';
import { Search, Star, MapPin } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { useNavigate } from 'react-router-dom';

const AllShops = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Mock data - Replace with actual API calls
  const shops = [
    {
      id: 1,
      name: "Hardware Haven",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      district: "Colombo",
      rating: 4.5,
      description: "Your one-stop shop for all hardware needs"
    },
    {
      id: 2,
      name: "Tool Masters",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Gampaha",
      rating: 4.2,
      description: "Professional tools and equipment"
    },
    {
      id: 3,
      name: "Build & Fix",
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=300&fit=crop",
      district: "Kalutara",
      rating: 4.8,
      description: "Quality building materials and tools"
    },
    {
      id: 4,
      name: "Home Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Colombo",
      rating: 4.0,
      description: "Complete home improvement solutions"
    },
    {
      id: 5,
      name: "Metro Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Colombo",
      rating: 4.6,
      description: "Modern hardware store with wide selection"
    },
    {
      id: 6,
      name: "Rural Tools",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Gampaha",
      rating: 4.3,
      description: "Agricultural and construction tools"
    },
    {
      id: 7,
      name: "Coastal Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Kalutara",
      rating: 4.1,
      description: "Marine and general hardware supplies"
    }
  ];

  const districts = ["Colombo", "Gampaha", "Kalutara", "Ratnapura", "Kandy", "Matale", "Nuwara Eliya"];

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = !selectedDistrict || shop.district.toLowerCase() === selectedDistrict.toLowerCase();
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Hardware Shops</h1>
        <Button variant="outline" onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search shops by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district.toLowerCase()}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <Card 
              key={shop.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/shops/${shop.id}`)}
            >
              <CardContent className="p-4">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
                <p className="text-gray-600 mb-4">{shop.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.district}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{shop.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No shops found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllShops; 