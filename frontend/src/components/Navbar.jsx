import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-primary">
              ServiceHub
            </a>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <a href="/marketplace" className="text-gray-700 hover:text-primary">
              Marketplace
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <a href="/cart" className="text-gray-700 hover:text-primary">
              <ShoppingCart className="h-6 w-6" />
            </a>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-gray-700 hover:text-primary border border-gray-300 rounded-md">
                Login
              </button>
              <button className="px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-md">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 