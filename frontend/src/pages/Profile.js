import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const districtsByProvince = {
  western: ['Colombo', 'Gampaha', 'Kalutara'],
  central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  southern: ['Galle', 'Matara', 'Hambantota'],
  northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  eastern: ['Batticaloa', 'Ampara', 'Trincomalee'],
  'north-western': ['Kurunegala', 'Puttalam'],
  'north-central': ['Anuradhapura', 'Polonnaruwa'],
  uva: ['Badulla', 'Monaragala'],
  sabaragamuwa: ['Ratnapura', 'Kegalle']
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState(user?.role || 'user');
  const [isRoleSelected, setIsRoleSelected] = useState(user?.isRoleSelected || false);

  // Common profile fields
  const [profile, setProfile] = useState({
    address: '',
    province: '',
    district: '',
    contactNumber: '',
    profilePicture: '',
    bio: ''
  });

  // Provider specific fields
  const [providerDetails, setProviderDetails] = useState({
    category: '',
    experience: 0,
    skills: [],
    availability: true
  });

  // Shop specific fields
  const [shopDetails, setShopDetails] = useState({
    shopName: '',
    location: '',
    businessType: '',
    openingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success) {
          const userData = response.data;
          setRole(userData.role);
          setIsRoleSelected(userData.isRoleSelected);
          setProfile(userData.profile || {});
          setProviderDetails(userData.providerDetails || {});
          setShopDetails(userData.shopDetails || {});
        }
      } catch (error) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderChange = (e) => {
    const { name, value } = e.target;
    setProviderDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleShopChange = (e) => {
    const { name, value } = e.target;
    setShopDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setShopDetails(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleRoleSelect = async (selectedRole) => {
    try {
      const response = await authService.updateProfile({
        role: selectedRole,
        isRoleSelected: true
      });
      
      if (response.success) {
        setRole(selectedRole);
        setIsRoleSelected(true);
        updateUser(response.data);
        toast.success('Role updated successfully');
      }
    } catch (error) {
      setError('Failed to update role');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const profileData = {
        profile,
        ...(role === 'provider' && { providerDetails }),
        ...(role === 'shop' && { shopDetails })
      };

      const response = await authService.updateProfile(profileData);
      
      if (response.success) {
        updateUser(response.data);
        toast.success('Profile updated successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isRoleSelected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Select Your Role
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please select your role to continue
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('user')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Regular User
            </button>
            <button
              onClick={() => handleRoleSelect('provider')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Service Provider
            </button>
            <button
              onClick={() => handleRoleSelect('shop')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Shop Owner
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile Information
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Update your profile information below.</p>
            </div>

            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
              {/* Common Profile Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                    Province
                  </label>
                  <select
                    name="province"
                    id="province"
                    value={profile.province}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Province</option>
                    {Object.keys(districtsByProvince).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {profile.province && (
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      District
                    </label>
                    <select
                      name="district"
                      id="district"
                      value={profile.district}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select District</option>
                      {districtsByProvince[profile.province].map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    id="contactNumber"
                    value={profile.contactNumber}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    rows={3}
                    value={profile.bio}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Provider Specific Fields */}
              {role === 'provider' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={providerDetails.category}
                      onChange={handleProviderChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Category</option>
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="carpenter">Carpenter</option>
                      <option value="painter">Painter</option>
                      <option value="mason">Mason</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      value={providerDetails.experience}
                      onChange={handleProviderChange}
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      id="skills"
                      value={providerDetails.skills.join(', ')}
                      onChange={(e) => {
                        const skills = e.target.value.split(',').map(skill => skill.trim());
                        setProviderDetails(prev => ({ ...prev, skills }));
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Shop Specific Fields */}
              {role === 'shop' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      id="shopName"
                      value={shopDetails.shopName}
                      onChange={handleShopChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                      Business Type
                    </label>
                    <input
                      type="text"
                      name="businessType"
                      id="businessType"
                      value={shopDetails.businessType}
                      onChange={handleShopChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Opening Hours
                    </label>
                    <div className="mt-2 space-y-2">
                      {Object.entries(shopDetails.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex space-x-2">
                          <span className="w-24 text-sm text-gray-500 capitalize">{day}</span>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                            className="block w-32 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <span className="text-sm text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                            className="block w-32 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 