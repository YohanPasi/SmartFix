import React, { useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, details, confirmation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    const loadingToast = toast.loading('Processing your order...');

    try {
      // Create order object
      const order = {
        id: `ORD${Date.now()}`,
        userEmail: user.email,
        date: new Date().toISOString().split('T')[0],
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotal(),
        status: 'pending',
        shippingDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        }
      };

      // Get existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Add new order
      const updatedOrders = [...existingOrders, order];
      
      // Save back to localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Clear the cart
      clearCart();
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Order placed successfully!');
      
      // Move to confirmation step
      setCheckoutStep('confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.dismiss(loadingToast);
      toast.error('Error placing order. Please try again.');
    }
  };

  const renderCart = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Your cart is empty</p>
          <Button className="mt-4" onClick={() => navigate('/marketplace')}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-lg">Rs. {item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-red-500 hover:text-red-600"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-xl font-bold">Total: Rs. {getTotal().toLocaleString()}</span>
            <Button onClick={() => setCheckoutStep('details')}>Proceed to Checkout</Button>
          </div>
        </>
      )}
    </div>
  );

  const renderCheckoutDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Checkout Details</h2>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="Enter your full name" 
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="Enter your phone number" 
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address</Label>
          <Input 
            id="address" 
            placeholder="Enter your delivery address" 
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCheckoutStep('cart')}>
            Back to Cart
          </Button>
          <Button onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">Order Confirmed!</h2>
      <p className="text-gray-600">
        Thank you for your order. We'll send you a confirmation email shortly.
      </p>
      <Button onClick={() => navigate('/marketplace')}>Continue Shopping</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {checkoutStep === 'cart' && renderCart()}
      {checkoutStep === 'details' && renderCheckoutDetails()}
      {checkoutStep === 'confirmation' && renderConfirmation()}
    </div>
  );
};

export default Cart; 