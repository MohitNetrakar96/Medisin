import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('gender', userData.gender);
            formData.append('dob', userData.dob);
            image && formData.append('image', image);

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    const handleCancel = () => {
        setIsEdit(false);
        setImage(false);
        loadUserProfileData(); // Reset to original data
    };

    if (!userData) return null;

    return (
        <div className=" mt-20 min-h-screen bg-gray-100 py-8 px-4 sm:px-6">
            {/* Card container that changes layout on large screens */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden lg:flex">
                    {/* Left side - Header and profile picture */}
                    <div className="lg:w-2/5">
                        <div className="h-full relative">
                            {/* Gradient background that takes full height on lg */}
                            <div className="bg-black h-48 lg:h-full w-full relative">
                                <div className="px-8 pt-8 lg:pt-12 lg:pb-24">
                                    <h2 className="text-white text-lg font-medium">Profile</h2>
                                    <h1 className="text-white text-3xl lg:text-4xl font-bold mt-2">Welcome Back</h1>
                                </div>
                                
                                {/* Profile image - centered on mobile, positioned on lg */}
                                <div className="absolute -bottom-16 inset-x-0 lg:bottom-auto lg:top-1/3 lg:left-1/2 lg:transform lg:-translate-x-1/2">
                                    <div className="flex justify-center">
                                        <label htmlFor="image" className={`cursor-pointer ${isEdit ? 'group' : ''}`}>
                                            <div className="relative h-32 w-32 lg:h-48 lg:w-48 rounded-full border-4 border-white shadow-xl bg-white">
                                                <img 
                                                    className="h-full w-full rounded-full object-cover" 
                                                    src={image ? URL.createObjectURL(image) : userData.image || 'https://via.placeholder.com/150'} 
                                                    alt="Profile" 
                                                />
                                                {isEdit && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition duration-300">
                                                        <img className="w-10 h-10" src={assets.upload_icon} alt="Upload" />
                                                    </div>
                                                )}
                                            </div>
                                            {isEdit && <input type="file" id="image" className="hidden" onChange={(e) => setImage(e.target.files[0])} />}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right side - Profile information */}
                    <div className="lg:w-3/5">
                        <div className="px-6 lg:px-12 py-24 lg:py-16 lg:h-full flex flex-col">
                            {/* Name */}
                            <div className="text-center lg:text-left mt-8 lg:mt-0">
                                {isEdit ? (
                                    <input 
                                        className="text-2xl lg:text-3xl font-bold text-center lg:text-left border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full" 
                                        type="text" 
                                        value={userData.name || ''} 
                                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                                    />
                                ) : (
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{userData.name}</h1>
                                )}
                            </div>

                            {/* Profile sections */}
                            <div className="mt-8 space-y-6 flex-grow">
                                {/* Contact Information */}
                                <div className="bg-gray-50 p-5 rounded-2xl transition-all hover:shadow-md">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                        </svg>
                                        Contact Information
                                    </h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <span className="text-gray-600 font-medium block">Email:</span>
                                            <span className="text-blue-600 text-lg truncate block">{userData.email}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-gray-600 font-medium block">Phone:</span>
                                            {isEdit ? (
                                                <input 
                                                    className="border rounded-lg p-2 focus:ring-black focus:border-black w-full" 
                                                    type="text" 
                                                    value={userData.phone || ''} 
                                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                                                />
                                            ) : (
                                                <span className="text-lg block">{userData.phone || 'Not provided'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div className="bg-gray-50 p-5 rounded-2xl transition-all hover:shadow-md">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                        </svg>
                                        Basic Information
                                    </h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <span className="text-gray-600 font-medium block">Gender:</span>
                                            {isEdit ? (
                                                <select 
                                                    className="border rounded-lg p-2 bg-white focus:ring-black focus:border-black w-full" 
                                                    value={userData.gender || 'Not Selected'} 
                                                    onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                                >
                                                    <option value="Not Selected">Not Selected</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            ) : (
                                                <span className="text-lg block">{userData.gender || 'Not specified'}</span>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-gray-600 font-medium block">Birthday:</span>
                                            {isEdit ? (
                                                <input 
                                                    className="border rounded-lg p-2 focus:ring-black focus:border-black w-full" 
                                                    type="date" 
                                                    value={userData.dob || ''} 
                                                    onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                                                />
                                            ) : (
                                                <span className="text-lg block">{userData.dob ? formatDate(userData.dob) : 'Not provided'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-8 mb-6 flex justify-center lg:justify-start gap-3">
                                {isEdit ? (
                                    <>
                                        <button 
                                            onClick={handleCancel}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={updateUserProfileData} 
                                            className="px-8 py-3 bg-black text-white rounded-xl hover:bg-white hover:text-black transition flex items-center font-medium"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setIsEdit(true)} 
                                        className="px-8 py-3 bg-black text-white rounded-xl hover:bg-white hover:text-black transition flex items-center font-medium"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;