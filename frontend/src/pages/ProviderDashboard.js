import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    User, 
    Calendar, 
    Star, 
    DollarSign, 
    Users, 
    Clock,
    Wrench,
    Settings,
    Bell,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    // Mock data for demonstration
    useEffect(() => {
        setNotifications([
            { id: 1, message: 'New service request from John Doe', time: '2 hours ago', read: false },
            { id: 2, message: 'Your service was rated 5 stars', time: '1 day ago', read: true },
            { id: 3, message: 'Payment received for service #123', time: '2 days ago', read: true },
        ]);

        setRecentActivity([
            { id: 1, type: 'service', description: 'Plumbing Service Completed', date: '2024-03-15', status: 'completed' },
            { id: 2, type: 'booking', description: 'New Booking Request', date: '2024-03-14', status: 'pending' },
            { id: 3, type: 'review', description: 'New 5-star Review', date: '2024-03-13', status: 'completed' },
        ]);
    }, []);

    const handleQuickAction = (action) => {
        switch (action) {
            case 'services':
                navigate('/provider/services');
                break;
            case 'schedule':
                navigate('/provider/schedule');
                break;
            case 'profile':
                navigate('/provider-profile');
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Bell className="h-6 w-6" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                                    {user?.profile?.profilePicture?.url ? (
                                        <img 
                                            src={user.profile.profilePicture.url} 
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        `${user?.firstName?.[0]}${user?.lastName?.[0]}`
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {user?.role === 'service_provider' ? 'Service Provider' : 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

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
                        Here's an overview of your service provider account.
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
                                onClick={() => handleQuickAction('services')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                                <span className="flex items-center">
                                    <Wrench className="mr-3" />
                                    Manage Services
                                </span>
                                <ChevronRight />
                            </button>
                            <button
                                onClick={() => handleQuickAction('schedule')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                            >
                                <span className="flex items-center">
                                    <Calendar className="mr-3" />
                                    View Schedule
                                </span>
                                <ChevronRight />
                            </button>
                            <button
                                onClick={() => handleQuickAction('profile')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                            >
                                <span className="flex items-center">
                                    <User className="mr-3" />
                                    Edit Profile
                                </span>
                                <ChevronRight />
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
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`p-2 rounded-full ${
                                        activity.type === 'service' ? 'text-green-500 bg-green-50' :
                                        activity.type === 'booking' ? 'text-blue-500 bg-blue-50' :
                                        'text-yellow-500 bg-yellow-50'
                                    }`}>
                                        {activity.type === 'service' ? <Wrench className="h-5 w-5" /> :
                                         activity.type === 'booking' ? <Calendar className="h-5 w-5" /> :
                                         <Star className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">{activity.description}</p>
                                        <p className="text-xs text-gray-500">{activity.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Provider Stats */}
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
                                <p className="text-sm text-indigo-600 font-medium">Total Clients</p>
                                <p className="text-2xl font-bold text-indigo-700">12</p>
                            </div>
                            <div className="p-4 rounded-lg bg-green-50">
                                <p className="text-sm text-green-600 font-medium">Completed Services</p>
                                <p className="text-2xl font-bold text-green-700">45</p>
                            </div>
                            <div className="p-4 rounded-lg bg-yellow-50">
                                <p className="text-sm text-yellow-600 font-medium">Average Rating</p>
                                <p className="text-2xl font-bold text-yellow-700">4.8</p>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-50">
                                <p className="text-sm text-purple-600 font-medium">Total Earnings</p>
                                <p className="text-2xl font-bold text-purple-700">$2,450</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ProviderDashboard; 