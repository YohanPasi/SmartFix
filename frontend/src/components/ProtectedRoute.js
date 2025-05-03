import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If user is logged in but hasn't selected a role (new user), redirect to role selection
    if (!user.role) {
        return <Navigate to="/select-role" />;
    }

    // If specific roles are required, check if user's role is allowed
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        switch (user.role) {
            case 'user':
                return <Navigate to="/user-dashboard" />;
            case 'service_provider':
                return <Navigate to="/provider-dashboard" />;
            case 'shop_owner':
                return <Navigate to="/shop-dashboard" />;
            default:
                return <Navigate to="/" />;
        }
    }

    // If user is logged in and has selected a role, show the protected content
    return children;
};

export default ProtectedRoute; 