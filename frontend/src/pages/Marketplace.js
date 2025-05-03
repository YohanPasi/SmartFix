import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, ShoppingCart } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [shopSearch, setShopSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
    },
    {
      id: 8,
      name: "Mountain Tools",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Nuwara Eliya",
      rating: 4.4,
      description: "Specialized tools for high-altitude work"
    },
    {
      id: 9,
      name: "Gem City Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Ratnapura",
      rating: 4.2,
      description: "Mining and construction equipment"
    },
    {
      id: 10,
      name: "Ancient Tools",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Kandy",
      rating: 4.7,
      description: "Traditional and modern tools"
    },
    {
      id: 11,
      name: "Spice Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Matale",
      rating: 4.0,
      description: "Agricultural and spice processing tools"
    },
    {
      id: 12,
      name: "City Center Tools",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Colombo",
      rating: 4.5,
      description: "Urban construction and DIY tools"
    }
  ];

  const products = [
    {
      id: 1,
      name: "Professional Hammer",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Tools",
      price: 1500,
      stock: 10
    },
    {
      id: 2,
      name: "Screwdriver Set",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Tools",
      price: 2500,
      stock: 15
    },
    {
      id: 3,
      name: "Paint Bucket",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Paint",
      price: 800,
      stock: 20
    },
    {
      id: 4,
      name: "Power Drill",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Tools",
      price: 12000,
      stock: 8
    },
    {
      id: 5,
      name: "Wall Paint",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Paint",
      price: 3500,
      stock: 25
    },
    {
      id: 6,
      name: "Plumbing Kit",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Plumbing",
      price: 4500,
      stock: 12
    },
    {
      id: 7,
      name: "Safety Helmet",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Safety",
      price: 1200,
      stock: 30
    },
    {
      id: 8,
      name: "Work Gloves",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Safety",
      price: 800,
      stock: 40
    },
    {
      id: 9,
      name: "Measuring Tape",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Tools",
      price: 600,
      stock: 25
    },
    {
      id: 10,
      name: "Nail Set",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Tools",
      price: 400,
      stock: 50
    },
    {
      id: 11,
      name: "PVC Pipes",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Plumbing",
      price: 800,
      stock: 100
    },
    {
      id: 12,
      name: "Paint Roller",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      category: "Paint",
      price: 500,
      stock: 35
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Show a toast notification
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(shopSearch.toLowerCase());
    const matchesDistrict = !selectedDistrict || shop.district.toLowerCase() === selectedDistrict.toLowerCase();
    return matchesSearch && matchesDistrict;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section - Shops */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Shops</h2>
            <Button variant="outline" onClick={() => navigate('/shops')}>
              More
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search shops..."
                  value={shopSearch}
                  onChange={(e) => setShopSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colombo">Colombo</SelectItem>
                  <SelectItem value="gampaha">Gampaha</SelectItem>
                  <SelectItem value="kalutara">Kalutara</SelectItem>
                  {/* Add more districts */}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredShops.map((shop) => (
                <Card 
                  key={shop.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/shops/${shop.id}`)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <img 
                      src={shop.image} 
                      alt={shop.name} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{shop.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{shop.district}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{shop.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Products */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Products</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/cart')}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
              </Button>
              <Button variant="outline">More</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="paint">Paint</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="flex items-center gap-4 p-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-lg">Rs. {product.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                      </div>
                      <Button
                        className="w-full mt-3"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace; 