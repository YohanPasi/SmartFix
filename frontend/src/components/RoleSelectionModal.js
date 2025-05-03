import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';
import { User, Wrench, Store, X } from 'lucide-react';

const RoleSelectionModal = ({ isOpen, onClose }) => {
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, user } = useAuth();

    // If user already has a role selected, don't show the modal
    if (user?.isRoleSelected) {
        return null;
    }

    const handleRoleSelect = async (role) => {
        try {
            setLoading(true);
            console.log('Updating role to:', role);
            const response = await authService.updateRole(role);
            console.log('Role update response:', response);
            
            if (response.success) {
                // Update the user in context
                const updatedUser = {
                    ...user,
                    role: role,
                    isRoleSelected: true
                };
                setUser(updatedUser);
                
                // Update user in localStorage
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Close the modal
                onClose();
                
                // Show success message
                toast.success('Role updated successfully!');
                
                // Redirect based on selected role
                switch (role) {
                    case 'user':
                        navigate('/user-dashboard');
                        break;
                    case 'service_provider':
                        navigate('/provider-dashboard');
                        break;
                    case 'shop':
                    case 'shop_owner':
                        navigate('/shop-dashboard');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                throw new Error(response.error || 'Failed to update role');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error(error.response?.data?.error || 'Failed to update role');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Select Your Role
                                </h3>
                                <div className="mt-4 space-y-4">
                                    <button
                                        onClick={() => handleRoleSelect('user')}
                                        disabled={loading}
                                        className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        <h4 className="font-medium">User</h4>
                                        <p className="text-sm text-gray-500">Browse and purchase services and products</p>
                                    </button>
                                    
                                    <button
                                        onClick={() => handleRoleSelect('service_provider')}
                                        disabled={loading}
                                        className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        <h4 className="font-medium">Service Provider</h4>
                                        <p className="text-sm text-gray-500">Offer your services to customers</p>
                                    </button>
                                    
                                    <button
                                        onClick={() => handleRoleSelect('shop_owner')}
                                        disabled={loading}
                                        className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        <h4 className="font-medium">Shop Owner</h4>
                                        <p className="text-sm text-gray-500">Manage your shop and sell products</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionModal; 