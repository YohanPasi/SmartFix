import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Store } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Find the Best Services</span>
            <span className="block text-blue-600">in Sri Lanka</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with trusted service providers and shop for quality products all in one place.
          </p>
        </div>

        <div className="mt-10 flex justify-center gap-8">
          <Link
            to="/service-providers"
            className="group relative flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all duration-200"
          >
            <Wrench className="h-6 w-6 mr-2" />
            Service Providers
          </Link>
          <Link
            to="/marketplace"
            className="group relative flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-200"
          >
            <Store className="h-6 w-6 mr-2" />
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero; 