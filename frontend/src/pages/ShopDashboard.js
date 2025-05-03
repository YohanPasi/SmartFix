import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    ShoppingBag, 
    Star, 
    Package, 
    Settings,
    Bell,
    ChevronRight,
    Store,
    LogOut,
    Upload,
    Edit2,
    Save,
    X,
    Wrench,
    Clock,
    Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { shopService } from '../services/shopService';
import axios from 'axios';

const ShopDashboard = () => {
    const { user, setUser, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [recentActivity, setRecentActivity] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [previewBanner, setPreviewBanner] = useState('');
    const [previewLogo, setPreviewLogo] = useState('');
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [formData, setFormData] = useState({
        shopName: '',
        email: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        description: '',
        businessRegistrationNumber: '',
        businessType: '',
        openingHours: {
            monday: { start: '09:00', end: '18:00' },
            tuesday: { start: '09:00', end: '18:00' },
            wednesday: { start: '09:00', end: '18:00' },
            thursday: { start: '09:00', end: '18:00' },
            friday: { start: '09:00', end: '18:00' },
            saturday: { start: '10:00', end: '16:00' },
            sunday: { start: '10:00', end: '16:00' }
        },
        categories: [],
        paymentMethods: [],
        deliveryOptions: [],
        socialMedia: {
            facebook: '',
            instagram: '',
            twitter: '',
            website: ''
        },
        shopBanner: '',
        shopLogo: '',
        minimumOrderAmount: 0,
        deliveryRadius: 0,
        taxRate: 0
    });

    const [availableCategories] = useState([
        'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports',
        'Toys', 'Books', 'Food & Beverages', 'Health', 'Automotive'
    ]);

    const [availablePaymentMethods] = useState([
        'Cash on Delivery', 'Credit Card', 'Debit Card', 'Bank Transfer',
        'Mobile Payment', 'Digital Wallet'
    ]);

    const [availableDeliveryOptions] = useState([
        'Standard Delivery', 'Express Delivery', 'Same Day Delivery',
        'Pickup Available', 'Free Delivery'
    ]);

    useEffect(() => {
        if (user) {
            console.log('Initializing form data with user:', user);
            setFormData({
                shopName: user.shopDetails?.shopName || '',
                email: user.email || '',
                phone: user.profile?.contactNumber || '',
                address: user.profile?.address || '',
                province: user.profile?.province || '',
                district: user.profile?.district || '',
                description: user.shopDetails?.description || '',
                businessRegistrationNumber: user.shopDetails?.businessRegistrationNumber || '',
                businessType: user.shopDetails?.businessType || '',
                openingHours: user.shopDetails?.openingHours || {
                    monday: { start: '09:00', end: '18:00' },
                    tuesday: { start: '09:00', end: '18:00' },
                    wednesday: { start: '09:00', end: '18:00' },
                    thursday: { start: '09:00', end: '18:00' },
                    friday: { start: '09:00', end: '18:00' },
                    saturday: { start: '10:00', end: '16:00' },
                    sunday: { start: '10:00', end: '16:00' }
                },
                categories: user.shopDetails?.categories || [],
                paymentMethods: user.shopDetails?.paymentMethods || [],
                deliveryOptions: user.shopDetails?.deliveryOptions || [],
                socialMedia: user.shopDetails?.socialMedia || {
                    facebook: '',
                    instagram: '',
                    twitter: '',
                    website: ''
                },
                minimumOrderAmount: user.shopDetails?.minimumOrderAmount || 0,
                deliveryRadius: user.shopDetails?.deliveryRadius || 0,
                taxRate: user.shopDetails?.taxRate || 0,
                shopBanner: user.shopDetails?.shopBanner || '',
                shopLogo: user.shopDetails?.shopLogo || ''
            });
            setPreviewBanner(user.shopDetails?.shopBanner || '');
            setPreviewLogo(user.shopDetails?.shopLogo || '');

            const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const shopOrders = allOrders.filter(order => order.shopEmail === user.email);
            setOrders(shopOrders);

            const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
            const shopReviews = allReviews.filter(review => review.shopEmail === user.email);
            setReviews(shopReviews);
        }

        setRecentActivity([
            { id: 1, type: 'order', description: 'Order #1234 Completed', date: '2024-03-15', status: 'completed' },
            { id: 2, type: 'product', description: 'New Product Added', date: '2024-03-14', status: 'pending' },
            { id: 3, type: 'review', description: 'New 5-star Review', date: '2024-03-13', status: 'completed' },
        ]);
    }, [user]);

    const handleSignOut = () => {
        logout();
        navigate('/login');
        toast.success('Successfully signed out');
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Logo size should be less than 5MB');
            return;
        }

        if (!file.type.match(/image\/(jpeg|png|jpg|gif)/)) {
            toast.error('Please upload an image file (JPEG, PNG, JPG, GIF)');
            return;
        }

        setSelectedLogo(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewLogo(reader.result);
        };
        reader.readAsDataURL(file);

        try {
            const formData = new FormData();
            formData.append('shopLogo', file);
            formData.append('role', 'shop_owner');
            formData.append('firstName', user.firstName);
            formData.append('lastName', user.lastName);
            formData.append('profile[contactNumber]', formData.phone || '');
            formData.append('profile[address]', formData.address || '');
            formData.append('profile[province]', formData.province || '');
            formData.append('profile[district]', formData.district || '');

            const response = await shopService.updateShopProfile(formData);
            
            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    shopLogo: response.data.shopDetails?.shopLogo || prev.shopLogo
                }));
                toast.success('Logo uploaded successfully');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error(error.response?.data?.error || 'Failed to upload logo');
        }
    };

    const handleBannerChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Banner size should be less than 5MB');
            return;
        }

        if (!file.type.match(/image\/(jpeg|png|jpg|gif)/)) {
            toast.error('Please upload an image file (JPEG, PNG, JPG, GIF)');
            return;
        }

        setSelectedBanner(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewBanner(reader.result);
        };
        reader.readAsDataURL(file);

        try {
            const formData = new FormData();
            formData.append('shopBanner', file);
            formData.append('role', 'shop_owner');
            formData.append('firstName', user.firstName);
            formData.append('lastName', user.lastName);
            formData.append('profile[contactNumber]', formData.phone || '');
            formData.append('profile[address]', formData.address || '');
            formData.append('profile[province]', formData.province || '');
            formData.append('profile[district]', formData.district || '');

            const response = await shopService.updateShopProfile(formData);
            
            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    shopBanner: response.data.shopDetails?.shopBanner || prev.shopBanner
                }));
                toast.success('Banner uploaded successfully');
            }
        } catch (error) {
            console.error('Error uploading banner:', error);
            toast.error(error.response?.data?.error || 'Failed to upload banner');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Current form data:', formData);

            const formDataToSend = new FormData();
            
            // Add basic user info
            formDataToSend.append('firstName', user.firstName);
            formDataToSend.append('lastName', user.lastName);
            
            // Add profile info
            formDataToSend.append('profile[contactNumber]', formData.phone || '');
            formDataToSend.append('profile[address]', formData.address || '');
            formDataToSend.append('profile[province]', formData.province || '');
            formDataToSend.append('profile[district]', formData.district || '');
            
            // Add shop details
            formDataToSend.append('shopDetails[shopName]', formData.shopName || '');
            formDataToSend.append('shopDetails[description]', formData.description || '');
            formDataToSend.append('shopDetails[businessRegistrationNumber]', formData.businessRegistrationNumber || '');
            formDataToSend.append('shopDetails[businessType]', formData.businessType || '');
            
            // Add opening hours
            Object.entries(formData.openingHours || {}).forEach(([day, hours]) => {
                formDataToSend.append(`shopDetails[openingHours][${day}][start]`, hours.start);
                formDataToSend.append(`shopDetails[openingHours][${day}][end]`, hours.end);
            });
            
            // Add arrays
            formData.categories?.forEach(category => {
                formDataToSend.append('shopDetails[categories][]', category);
            });
            
            formData.paymentMethods?.forEach(method => {
                formDataToSend.append('shopDetails[paymentMethods][]', method);
            });
            
            formData.deliveryOptions?.forEach(option => {
                formDataToSend.append('shopDetails[deliveryOptions][]', option);
            });
            
            // Add social media
            Object.entries(formData.socialMedia || {}).forEach(([platform, url]) => {
                formDataToSend.append(`shopDetails[socialMedia][${platform}]`, url);
            });
            
            // Add numbers
            formDataToSend.append('shopDetails[minimumOrderAmount]', formData.minimumOrderAmount || 0);
            formDataToSend.append('shopDetails[deliveryRadius]', formData.deliveryRadius || 0);
            formDataToSend.append('shopDetails[taxRate]', formData.taxRate || 0);
            
            // Add role
            formDataToSend.append('role', 'shop_owner');
            
            // Add images if they exist
            if (selectedLogo) {
                formDataToSend.append('shopLogo', selectedLogo);
            }
            if (selectedBanner) {
                formDataToSend.append('shopBanner', selectedBanner);
            }

            console.log('Sending update request with form data');
            const response = await shopService.updateShopProfile(formDataToSend);

            if (response.success) {
                // Update the form data with the response data directly
                const updatedData = response.data;
                console.log('Updated data from server:', updatedData);
                
                // Update the user context and localStorage
                updateUser(updatedData);
                localStorage.setItem('user', JSON.stringify(updatedData));
                
                // Update the form data with the new values
                setFormData(prev => ({
                    ...prev,
                    shopName: updatedData.shopDetails?.shopName || '',
                    description: updatedData.shopDetails?.description || '',
                    businessRegistrationNumber: updatedData.shopDetails?.businessRegistrationNumber || '',
                    businessType: updatedData.shopDetails?.businessType || '',
                    openingHours: updatedData.shopDetails?.openingHours || prev.openingHours,
                    categories: updatedData.shopDetails?.categories || [],
                    paymentMethods: updatedData.shopDetails?.paymentMethods || [],
                    deliveryOptions: updatedData.shopDetails?.deliveryOptions || [],
                    socialMedia: updatedData.shopDetails?.socialMedia || prev.socialMedia,
                    minimumOrderAmount: updatedData.shopDetails?.minimumOrderAmount || 0,
                    deliveryRadius: updatedData.shopDetails?.deliveryRadius || 0,
                    taxRate: updatedData.shopDetails?.taxRate || 0,
                    shopLogo: updatedData.shopDetails?.shopLogo || '',
                    shopBanner: updatedData.shopDetails?.shopBanner || '',
                    phone: updatedData.profile?.contactNumber || '',
                    address: updatedData.profile?.address || '',
                    province: updatedData.profile?.province || '',
                    district: updatedData.profile?.district || ''
                }));

                setIsEditing(false);
                setSelectedBanner(null);
                setSelectedLogo(null);
                toast.success('Shop profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.error || 'Error updating profile');
            }
        }
    };

    const handleDeleteOrder = (orderId) => {
        const loadingToast = toast.loading('Cancelling order...');
        try {
            const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const updatedOrders = allOrders.filter(order => order.id !== orderId);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            setOrders(prev => prev.filter(order => order.id !== orderId));
            toast.dismiss(loadingToast);
            toast.success('Order cancelled successfully!');
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.dismiss(loadingToast);
            toast.error('Error cancelling order. Please try again.');
        }
    };

    const handleDeleteReview = (reviewId) => {
        const loadingToast = toast.loading('Deleting review...');
        try {
            const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
            const updatedReviews = allReviews.filter(review => review.id !== reviewId);
            localStorage.setItem('reviews', JSON.stringify(updatedReviews));
            setReviews(prev => prev.filter(review => review.id !== reviewId));
            toast.dismiss(loadingToast);
            toast.success('Review deleted successfully!');
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.dismiss(loadingToast);
            toast.error('Error deleting review. Please try again.');
        }
    };

    const handleUpdateReview = (reviewId, updatedReview) => {
        const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const updatedReviews = allReviews.map(review => 
            review.id === reviewId ? { ...review, ...updatedReview } : review
        );
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
        setReviews(updatedReviews.filter(review => review.shopEmail === user.email));
        setEditingReview(null);
        toast.success('Review updated successfully');
    };

    const handleCategoryChange = (category, checked) => {
        if (checked) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, category]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                categories: prev.categories.filter(c => c !== category)
            }));
        }
    };

    const handlePaymentMethodChange = (method, checked) => {
        if (checked) {
            setFormData(prev => ({
                ...prev,
                paymentMethods: [...prev.paymentMethods, method]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                paymentMethods: prev.paymentMethods.filter(m => m !== method)
            }));
        }
    };

    const handleDeliveryOptionChange = (option, checked) => {
        if (checked) {
            setFormData(prev => ({
                ...prev,
                deliveryOptions: [...prev.deliveryOptions, option]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                deliveryOptions: prev.deliveryOptions.filter(o => o !== option)
            }));
        }
    };

    const handleSocialMediaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [name]: value
            }
        }));
    };

    const handleOpeningHoursChange = (day, time, value) => {
        setFormData(prev => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: {
                    ...prev.openingHours[day],
                    [time]: value
                }
            }
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-sm p-6 mb-6 text-white"
                >
                    <h2 className="text-2xl font-bold mb-2">
                        Welcome back, {user?.firstName}!
                    </h2>
                    <p className="opacity-90">
                        Manage your shop and orders.
                    </p>
                </motion.div>

                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`${
                                activeTab === 'dashboard'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            <Store className="h-5 w-5 inline-block mr-2" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`${
                                activeTab === 'profile'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            <User className="h-5 w-5 inline-block mr-2" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`${
                                activeTab === 'services'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            <Wrench className="h-5 w-5 inline-block mr-2" />
                            Services
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`${
                                activeTab === 'bookings'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            <Calendar className="h-5 w-5 inline-block mr-2" />
                            Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`${
                                activeTab === 'reviews'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            <Star className="h-5 w-5 inline-block mr-2" />
                            Reviews
                        </button>
                    </nav>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                                    onClick={() => setActiveTab('profile')}
                                    className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                >
                                    <span className="flex items-center">
                                        <User className="mr-3" />
                                        Update Profile
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('services')}
                                    className="w-full flex items-center justify-between p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                >
                                    <span className="flex items-center">
                                        <Wrench className="mr-3" />
                                        Manage Services
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className="w-full flex items-center justify-between p-3 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                                >
                                    <span className="flex items-center">
                                        <Calendar className="mr-3" />
                                        View Bookings
                                    </span>
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-shrink-0">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.description}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {activity.date}
                                            </p>
                                        </div>
                                        <div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    activity.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {activity.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Shop Profile
                            </h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isEditing ? (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-6">
                                <div className="relative">
                                    <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
                                        {previewBanner ? (
                                            <img
                                                src={previewBanner}
                                                alt="Shop Banner"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <span className="text-gray-400">No banner image</span>
                                            </div>
                                        )}
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <label className="cursor-pointer bg-white px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                    <Upload className="h-4 w-4 inline-block mr-2" />
                                                    Change Banner
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleBannerChange}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="relative">
                                        <div className="relative h-32 w-32 bg-gray-100 rounded-full overflow-hidden">
                                            {previewLogo ? (
                                                <img
                                                    src={previewLogo}
                                                    alt="Shop Logo"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <span className="text-gray-400 text-xs text-center">No logo</span>
                                                </div>
                                            )}
                                            {isEditing && (
                                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <label className="cursor-pointer bg-white px-3 py-1 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50">
                                                        <Upload className="h-3 w-3 inline-block mr-1" />
                                                        Change Logo
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleLogoChange}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Shop Logo</h4>
                                        <p className="text-sm text-gray-500">
                                            Upload your shop logo. Recommended size: 400x400 pixels. Maximum file size: 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Shop Name
                                    </label>
                                    <input
                                        type="text"
                                        name="shopName"
                                        value={formData.shopName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Business Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        name="businessRegistrationNumber"
                                        value={formData.businessRegistrationNumber}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Province
                                    </label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Opening Hours</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {Object.entries(formData.openingHours).map(([day, hours]) => (
                                        <div key={day} className="flex items-center space-x-4">
                                            <span className="w-24 text-sm text-gray-500 capitalize">{day}</span>
                                            <input
                                                type="time"
                                                value={hours.start}
                                                onChange={(e) => handleOpeningHoursChange(day, 'start', e.target.value)}
                                                disabled={!isEditing}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                            <span className="text-gray-500">to</span>
                                            <input
                                                type="time"
                                                value={hours.end}
                                                onChange={(e) => handleOpeningHoursChange(day, 'end', e.target.value)}
                                                disabled={!isEditing}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Social Media</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {Object.entries(formData.socialMedia).map(([platform, url]) => (
                                        <div key={platform}>
                                            <label className="block text-sm font-medium text-gray-700 capitalize">
                                                {platform}
                                            </label>
                                            <input
                                                type="url"
                                                name={platform}
                                                value={url}
                                                onChange={handleSocialMediaChange}
                                                disabled={!isEditing}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Categories</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {availableCategories.map(category => (
                                        <div key={category} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.categories.includes(category)}
                                                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                                                disabled={!isEditing}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-700">{category}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Payment Methods</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {availablePaymentMethods.map(method => (
                                        <div key={method} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.paymentMethods.includes(method)}
                                                onChange={(e) => handlePaymentMethodChange(method, e.target.checked)}
                                                disabled={!isEditing}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-700">{method}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Delivery Options</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {availableDeliveryOptions.map(option => (
                                        <div key={option} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.deliveryOptions.includes(option)}
                                                onChange={(e) => handleDeliveryOptionChange(option, e.target.checked)}
                                                disabled={!isEditing}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-700">{option}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}

                {activeTab === 'services' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Manage Services
                        </h3>
                        <p className="text-sm text-gray-500">
                            Add or update services offered by your shop.
                        </p>
                        {/* Add service management UI here */}
                    </motion.div>
                )}

                {activeTab === 'bookings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Bookings
                        </h3>
                        <div className="space-y-4">
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">Status: {order.status}</p>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No bookings available.</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Reviews
                        </h3>
                        <div className="space-y-4">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900">Rating: {review.rating} stars</p>
                                        <p className="text-sm text-gray-500">{review.comment}</p>
                                        <div className="mt-2 space-x-2">
                                            <button
                                                onClick={() => setEditingReview(review.id)}
                                                className="text-sm text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(review.id)}
                                                className="text-sm text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        {editingReview === review.id && (
                                            <div className="mt-2">
                                                <textarea
                                                    value={review.comment}
                                                    onChange={(e) => handleUpdateReview(review.id, { comment: e.target.value })}
                                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No reviews available.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default ShopDashboard;