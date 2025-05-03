import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Star, MapPin, ShoppingCart } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from '../context/CartContext';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Replace with actual API calls
  const shops = [
    {
      id: 1,
      name: "Hardware Haven",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      district: "Colombo",
      rating: 4.5,
      description: "Your one-stop shop for all hardware needs. We offer a wide range of tools, paint, plumbing supplies, and safety equipment.",
      products: [
        {
          id: 101,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 102,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 103,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 104,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 105,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 106,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 107,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 108,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 109,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 110,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 111,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 112,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 2,
      name: "Tool Masters",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Gampaha",
      rating: 4.2,
      description: "Specializing in high-quality tools and equipment for professionals and DIY enthusiasts.",
      products: [
        {
          id: 201,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 202,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 203,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 204,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 205,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 206,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 207,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 208,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 209,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 210,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 211,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 212,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 3,
      name: "Build & Fix",
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=300&fit=crop",
      district: "Kalutara",
      rating: 4.8,
      description: "Your trusted partner for all construction and repair needs. We stock everything from basic tools to specialized equipment.",
      products: [
        {
          id: 301,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 302,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 303,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 304,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 305,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 306,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 307,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 308,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 309,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 310,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 311,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 312,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 4,
      name: "Home Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Colombo",
      rating: 4.0,
      description: "Your local hardware store with a wide selection of home improvement products and expert advice.",
      products: [
        {
          id: 401,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 402,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 403,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 404,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 405,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 406,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 407,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 408,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 409,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 410,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 411,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 412,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 5,
      name: "Metro Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Colombo",
      rating: 4.6,
      description: "Modern hardware store with wide selection of tools and equipment for urban projects.",
      products: [
        {
          id: 501,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 502,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 503,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 504,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 505,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 506,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 507,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 508,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 509,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 510,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 511,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 512,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 6,
      name: "Rural Tools",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Gampaha",
      rating: 4.3,
      description: "Specialized in agricultural and construction tools for rural development.",
      products: [
        {
          id: 601,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 602,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 603,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 604,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 605,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 606,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 607,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 608,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 609,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 610,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 611,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 612,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 7,
      name: "Coastal Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Kalutara",
      rating: 4.1,
      description: "Marine and general hardware supplies for coastal areas.",
      products: [
        {
          id: 701,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 702,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 703,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 704,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 705,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 706,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 707,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 708,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 709,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 710,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 711,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 712,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 8,
      name: "Mountain Tools",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Nuwara Eliya",
      rating: 4.4,
      description: "Specialized tools for high-altitude work and mountain construction.",
      products: [
        {
          id: 801,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 802,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 803,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 804,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 805,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 806,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 807,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 808,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 809,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 810,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 811,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 812,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 9,
      name: "Gem City Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Ratnapura",
      rating: 4.2,
      description: "Mining and construction equipment for gem mining areas.",
      products: [
        {
          id: 901,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 902,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 903,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 904,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 905,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 906,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 907,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 908,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 909,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 910,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 911,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 912,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 10,
      name: "Ancient Tools",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Kandy",
      rating: 4.7,
      description: "Traditional and modern tools for heritage site maintenance.",
      products: [
        {
          id: 1001,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 1002,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 1003,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 1004,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 1005,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 1006,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 1007,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 1008,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 1009,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 1010,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 1011,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 1012,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 11,
      name: "Spice Hardware",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Matale",
      rating: 4.0,
      description: "Agricultural and spice processing tools for the spice industry.",
      products: [
        {
          id: 1101,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 1102,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 1103,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 1104,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 1105,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 1106,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 1107,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 1108,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 1109,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 1110,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 1111,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 1112,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    },
    {
      id: 12,
      name: "City Center Tools",
      image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
      district: "Colombo",
      rating: 4.5,
      description: "Urban construction and DIY tools for city projects.",
      products: [
        {
          id: 1201,
          name: "Professional Hammer",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 1500,
          stock: 10
        },
        {
          id: 1202,
          name: "Screwdriver Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 2500,
          stock: 15
        },
        {
          id: 1203,
          name: "Paint Bucket",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 800,
          stock: 20
        },
        {
          id: 1204,
          name: "Power Drill",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 12000,
          stock: 8
        },
        {
          id: 1205,
          name: "Wall Paint",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 3500,
          stock: 25
        },
        {
          id: 1206,
          name: "Plumbing Kit",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 4500,
          stock: 12
        },
        {
          id: 1207,
          name: "Safety Helmet",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 1200,
          stock: 30
        },
        {
          id: 1208,
          name: "Work Gloves",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Safety",
          price: 800,
          stock: 40
        },
        {
          id: 1209,
          name: "Measuring Tape",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 600,
          stock: 25
        },
        {
          id: 1210,
          name: "Nail Set",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Tools",
          price: 400,
          stock: 50
        },
        {
          id: 1211,
          name: "PVC Pipes",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Plumbing",
          price: 800,
          stock: 100
        },
        {
          id: 1212,
          name: "Paint Roller",
          image: "https://images.unsplash.com/photo-1581092334247-ddef2a41f3b4?w=400&h=300&fit=crop",
          category: "Paint",
          price: 500,
          stock: 35
        }
      ]
    }
  ];

  const shop = shops.find(s => s.id === parseInt(id));
  if (!shop) {
    return <div className="container mx-auto px-4 py-8">Shop not found</div>;
  }

  const filteredProducts = shop.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/shops')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shops
      </Button>

      {/* Shop Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start gap-6">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-48 h-48 object-cover rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-5 h-5" />
              <span>{shop.district}</span>
            </div>
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{shop.rating}</span>
            </div>
            <p className="text-gray-600">{shop.description}</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Available Products</h2>
          <Button variant="outline" onClick={() => navigate('/cart')}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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
  );
};

export default ShopDetails; 