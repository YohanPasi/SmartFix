import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);

    // Password validation function
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        if (password.length < minLength) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!hasUpperCase) {
            return { isValid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!hasLowerCase) {
            return { isValid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!hasNumber) {
            return { isValid: false, message: 'Password must contain at least one number' };
        }
        return { isValid: true };
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Fetch fresh user data
                    const response = await authService.getCurrentUser();
                    if (response.success) {
                        setUser(response.data);
                        localStorage.setItem('user', JSON.stringify(response.data));
                        
                        // Show role selection modal if user doesn't have a role
                        if (!response.data.role || !response.data.isRoleSelected) {
                            setShowRoleModal(true);
                        }
                    } else {
                        // Clear invalid data
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const userData = response.data.user;
            setUser(userData);
            
            // Show role selection modal if user doesn't have a role
            if (!userData.role || !userData.isRoleSelected) {
                setShowRoleModal(true);
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authService.signup(userData);
            const newUser = response.data.user;
            setUser(newUser);
            
            // Show role selection modal for new users
            setShowRoleModal(true);
            
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setShowRoleModal(false);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        showRoleModal,
        setShowRoleModal,
        login,
        signup,
        logout,
        updateUser,
        setUser,
        validatePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 