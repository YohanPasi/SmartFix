import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    FaUser, 
    FaShoppingBag,
    FaHeart,
    FaTools,
    FaBell,
    FaChevronRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    // Mock data for demonstration
    useEffect(() => {
        // Simulated notifications
        setNotifications([
            { id: 1, message: 'Your order #123 has been delivered', time: '2 hours ago', read: false },
            { id: 2, message: 'New service available in your area', time: '1 day ago', read: true },
            { id: 3, message: 'Special discount on your next purchase', time: '2 days ago', read: true },
        ]);

        // Simulated recent activity
        setRecentActivity([
            { id: 1, type: 'order', description: 'Ordered Home Cleaning Service', date: '2024-03-15', status: 'completed' },
            { id: 2, type: 'service', description: 'Booked Plumbing Service', date: '2024-03-14', status: 'pending' },
            { id: 3, type: 'shop', description: 'Purchased from Home Essentials', date: '2024-03-13', status: 'completed' },
        ]);
    }, []);

    const handleQuickAction = (action) => {
        switch (action) {
            case 'profile':
                navigate('/profile');
                break;
            case 'orders':
                navigate('/orders');
                break;
            case 'favorites':
                navigate('/favorites');
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm p-6 mb-6"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.firstName}!
                    </h2>
                    <p className="text-gray-600">
                        Here's what's happening with your account today.
                    </p>
                </motion.div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleQuickAction('profile')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                                <span className="flex items-center">
                                    <FaUser className="mr-3" />
                                    View Profile
                                </span>
                                <FaChevronRight />
                            </button>
                            <button
                                onClick={() => handleQuickAction('orders')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                            >
                                <span className="flex items-center">
                                    <FaShoppingBag className="mr-3" />
                                    My Orders
                                </span>
                                <FaChevronRight />
                            </button>
                            <button
                                onClick={() => handleQuickAction('favorites')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                            >
                                <span className="flex items-center">
                                    <FaHeart className="mr-3" />
                                    Favorites
                                </span>
                                <FaChevronRight />
                            </button>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {[
                                {
                                    type: 'order',
                                    message: 'Order #12345 has been delivered',
                                    time: '2 hours ago',
                                    icon: FaShoppingBag,
                                    color: 'text-green-500',
                                },
                                {
                                    type: 'service',
                                    message: 'New service provider available in your area',
                                    time: '5 hours ago',
                                    icon: FaTools,
                                    color: 'text-blue-500',
                                },
                                {
                                    type: 'notification',
                                    message: 'Your profile has been updated',
                                    time: '1 day ago',
                                    icon: FaBell,
                                    color: 'text-yellow-500',
                                },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`p-2 rounded-full ${activity.color} bg-opacity-10`}>
                                        <activity.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">{activity.message}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* User Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Your Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-indigo-50">
                                <p className="text-sm text-indigo-600 font-medium">Total Orders</p>
                                <p className="text-2xl font-bold text-indigo-700">12</p>
                            </div>
                            <div className="p-4 rounded-lg bg-green-50">
                                <p className="text-sm text-green-600 font-medium">Active Services</p>
                                <p className="text-2xl font-bold text-green-700">3</p>
                            </div>
                            <div className="p-4 rounded-lg bg-yellow-50">
                                <p className="text-sm text-yellow-600 font-medium">Favorites</p>
                                <p className="text-2xl font-bold text-yellow-700">8</p>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-50">
                                <p className="text-sm text-purple-600 font-medium">Reviews</p>
                                <p className="text-2xl font-bold text-purple-700">5</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard; 