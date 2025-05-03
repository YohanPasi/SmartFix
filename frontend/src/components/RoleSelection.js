import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import { User, Wrench, Store } from 'lucide-react';

const RoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleRoleSelect = async (role) => {
        try {
            setLoading(true);
            setSelectedRole(role);
            
            const response = await authService.updateRole(role);
            
            if (response.success) {
                setUser(response.data);
                toast.success('Role updated successfully!');
                
                // Redirect based on selected role
                switch (role) {
                    case 'user':
                        navigate('/user-dashboard');
                        break;
                    case 'service_provider':
                        navigate('/provider-dashboard');
                        break;
                    case 'shop_owner':
                        navigate('/shop-dashboard');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                toast.error(response.error || 'Failed to update role');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error(error.message || 'Failed to update role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Select Your Role
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Choose the role that best describes you
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => handleRoleSelect('user')}
                                disabled={loading}
                                className={`flex items-center justify-between p-4 border rounded-lg ${
                                    selectedRole === 'user'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-300 hover:border-indigo-500'
                                }`}
                            >
                                <div className="flex items-center">
                                    <User className="h-6 w-6 text-indigo-600 mr-3" />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">User</h3>
                                        <p className="text-sm text-gray-500">Browse and book services</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleRoleSelect('service_provider')}
                                disabled={loading}
                                className={`flex items-center justify-between p-4 border rounded-lg ${
                                    selectedRole === 'service_provider'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-300 hover:border-indigo-500'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Wrench className="h-6 w-6 text-indigo-600 mr-3" />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Service Provider</h3>
                                        <p className="text-sm text-gray-500">Offer your services to users</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleRoleSelect('shop')}
                                disabled={loading}
                                className={`flex items-center justify-between p-4 border rounded-lg ${
                                    selectedRole === 'shop'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-300 hover:border-indigo-500'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Store className="h-6 w-6 text-indigo-600 mr-3" />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Shop Owner</h3>
                                        <p className="text-sm text-gray-500">Manage your shop and products</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection; 