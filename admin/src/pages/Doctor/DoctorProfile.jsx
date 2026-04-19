import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
    const { currency, backendUrl } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            };

            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile', 
                updateData, 
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message);
            }
            
            setIsEdit(false);
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        if (dToken) {
            getProfileData();
        }
    }, [dToken]);

    return profileData && (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Hero section with background image */}
            <div 
                className="relative w-full h-96 overflow-hidden transition-all duration-500"
                style={{
                    backgroundColor: isHovered ? '#f0f9ff' : '#e0f2fe',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Background image with parallax effect - positioned lower to show head */}
                <motion.div 
                    className="absolute inset-0 bg-cover ml-[80px] md:ml-[70vh] z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ 
                        scale: isHovered ? 1.12 : 1.1,
                        filter: isHovered ? 'brightness(1.1)' : 'brightness(1)' 
                    }}
                    transition={{ duration: 0.8 }}
                    style={{
                        backgroundImage: `url(${profileData.image})`,
                        opacity: 0.15,
                        backgroundPosition: 'center 25%', // Moved down to show head properly
                    }}
                />
                
                {/* Overlapping content */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/5 z-0" />
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-full flex items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-3/4 lg:w-2/3 ml-6 md:ml-10"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-800">
                            {profileData.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-xl text-gray-600">{profileData.degree}</span>
                            <span className="hidden md:inline text-gray-400">•</span>
                            <span className="text-xl text-gray-600">{profileData.experience}s of Experience</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Unified doctor details container that overlaps the hero section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-[-8vh] mb-16 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Profile image and basic info section */}
                        <div className="lg:col-span-1 border-r border-gray-100">
                            <div className="relative pb-[120%]"> {/* Using padding-bottom for aspect ratio */}
                                <motion.div 
                                    className="absolute inset-0 overflow-hidden"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <img 
                                        className="w-full h-full object-cover object-center"
                                        src={profileData.image} 
                                        alt={profileData.name} 
                                    />
                                    <div className="absolute inset-0  opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                                
                                {/* Availability badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${profileData.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {profileData.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800">{profileData.speciality}</h2>
                                <p className="text-gray-500 mt-1">{profileData.degree}</p>
                                
                                <div className="mt-[-4px] pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Consultation Fee</span>
                                        <span className="text-xl font-bold text-primary">{currency} {isEdit ? 
                                            <input 
                                                type="number" 
                                                onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                                value={profileData.fees}
                                                className="w-20 border border-gray-300 rounded p-1 text-center" 
                                            /> : 
                                            profileData.fees
                                        }</span>
                                    </div>
                                </div>
                                
                                {isEdit && (
                                    <div className="mt-4 flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="available"
                                            className="w-4 h-4 text-primary rounded border-gray-300"
                                            onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                                            checked={profileData.available} 
                                        />
                                        <label htmlFor="available" className="ml-2 text-sm text-gray-700">Toggle Availability</label>
                                    </div>
                                )}
                                
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={isEdit ? updateProfile : () => setIsEdit(prev => !prev)}
                                    className="w-full mt-6 px-4 py-3 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary/90 transition-all"
                                >
                                    {isEdit ? 'Save Changes' : 'Edit Profile'}
                                </motion.button>
                            </div>
                        </div>
                        
                        {/* Expertise and location details merged section */}
                        <div className="lg:col-span-3 p-8">
                            {/* Expertise section */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">Expertise</h2>
                                <div className="mt-4">
                                    {isEdit ? (
                                        <textarea 
                                            onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                            className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            rows={6} 
                                            value={profileData.about} 
                                        />
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed">{profileData.about}</p>
                                    )}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {/* Sample expertise tags - can be made dynamic */}
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Dental Procedures</span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Cosmetic Dentistry</span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Implants</span>
                                </div>
                            </div>
                            
                            {/* Location section */}
                            <div className="pt-8 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800">Location</h2>
                                <div className="mt-4">
                                    {isEdit ? (
                                        <div className="space-y-3">
                                            <input 
                                                type="text" 
                                                onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                                value={profileData.address.line1}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent" 
                                                placeholder="Address Line 1"
                                            />
                                            <input 
                                                type="text" 
                                                onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                                value={profileData.address.line2}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent" 
                                                placeholder="Address Line 2"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <address className="not-italic text-gray-600">
                                                    {profileData.address.line1}<br />
                                                    {profileData.address.line2}
                                                </address>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DoctorProfile;
