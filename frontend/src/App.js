import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ServiceProviders from './pages/ServiceProviders';
import ServiceProviderProfile from './pages/ServiceProviderProfile';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import AllShops from './pages/AllShops';
import ShopDetails from './pages/ShopDetails';
import ShopProfile from './pages/ShopProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelection from './components/RoleSelection';
import UserDashboard from './pages/UserDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ShopDashboard from './pages/ShopDashboard';
import RoleSelectionModal from './components/RoleSelectionModal';
import ServiceManagement from './pages/ServiceManagement';

// Create a separate component for the app content
const AppContent = () => {
  const { showRoleModal, setShowRoleModal } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/service-providers" element={<ServiceProviders />} />
          <Route path="/service-providers/:id" element={<ServiceProviderProfile />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shops" element={<AllShops />} />
          <Route path="/shops/:id" element={<ShopDetails />} />
          <Route path="/provider/services" element={<ServiceManagement />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shop-profile" 
            element={
              <ProtectedRoute allowedRoles={['shop']}>
                <ShopProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/provider-profile" 
            element={
              <ProtectedRoute allowedRoles={['service_provider']}>
                <ServiceProviderProfile />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider-dashboard"
            element={
              <ProtectedRoute allowedRoles={['service_provider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop-dashboard"
            element={
              <ProtectedRoute allowedRoles={['shop_owner']}>
                <ShopDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onClose={() => setShowRoleModal(false)} 
      />
    </div>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
