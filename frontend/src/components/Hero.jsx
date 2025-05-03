import React from 'react';
import { Store, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ServiceHub
          </h1>
          <p className="text-xl text-gray-600">
            Connect with service providers and explore our marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <a
            href="/service-providers"
            className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Users className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Service Providers
            </h2>
            <p className="text-gray-600 text-center">
              Find skilled professionals for your needs
            </p>
          </a>

          <a
            href="/marketplace"
            className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Store className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Marketplace
            </h2>
            <p className="text-gray-600 text-center">
              Shop for products from trusted suppliers
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;