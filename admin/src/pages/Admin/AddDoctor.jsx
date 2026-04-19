import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        experience: '1 Year',
        fees: '',
        about: '',
        speciality: 'General physician',
        degree: '',
        address1: '',
        address2: ''
    });

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImg) {
                return toast.error('Please upload a doctor profile picture');
            }

            const data = new FormData();
            data.append('image', docImg);
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('experience', formData.experience);
            data.append('fees', Number(formData.fees));
            data.append('about', formData.about);
            data.append('speciality', formData.speciality);
            data.append('degree', formData.degree);
            data.append('address', JSON.stringify({ 
                line1: formData.address1, 
                line2: formData.address2 
            }));

            const response = await axios.post(
                `${backendUrl}/api/admin/add-doctor`, 
                data, 
                { headers: { aToken } }
            );
            
            if (response.data.success) {
                toast.success(response.data.message);
                setDocImg(false);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    experience: '1 Year',
                    fees: '',
                    about: '',
                    speciality: 'General physician',
                    degree: '',
                    address1: '',
                    address2: ''
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    // Years array for experience dropdown
    const years = Array.from({ length: 10 }, (_, i) => `${i + 1} Year${i > 0 ? 's' : ''}`);
    
    // Specialities array
    const specialities = [
        'General physician',
        'Gynecologist',
        'Dermatologist',
        'Pediatricians',
        'Dentist',
        'Orthopedist'
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h1>
            
            <form onSubmit={onSubmitHandler} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-8">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center mb-8">
                        <label 
                            htmlFor="doc-img"
                            className="relative cursor-pointer group"
                        >
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm hover:border-primary transition duration-200">
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                    alt="Doctor profile" 
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 rounded-full">
                                    <span className="text-white text-sm">Change Photo</span>
                                </div>
                            </div>
                        </label>
                        <input 
                            onChange={(e) => setDocImg(e.target.files[0])} 
                            type="file" 
                            id="doc-img" 
                            accept="image/*"
                            hidden 
                        />
                        <p className="text-gray-500 text-sm mt-2">Upload doctor profile picture</p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                                    placeholder="Dr. John Doe" 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                                    placeholder="doctor@example.com" 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                                    placeholder="••••••••" 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Experience</label>
                                <select 
                                    name="experience"
                                    value={formData.experience} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition appearance-none bg-white" 
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Consultation Fee</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500">₹</span>
                                    </div>
                                    <input 
                                        type="number" 
                                        name="fees"
                                        value={formData.fees} 
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                                        placeholder="100" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Speciality</label>
                                <select 
                                    name="speciality"
                                    value={formData.speciality} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition appearance-none bg-white" 
                                >
                                    {specialities.map(speciality => (
                                        <option key={speciality} value={speciality}>{speciality}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Medical Degree</label>
                                <input 
                                    type="text" 
                                    name="degree"
                                    value={formData.degree} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                                    placeholder="MD, MBBS, etc." 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Address</label>
                                <input 
                                    type="text" 
                                    name="address1"
                                    value={formData.address1} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                                    placeholder="Street Address" 
                                    required 
                                />
                                <input 
                                    type="text" 
                                    name="address2"
                                    value={formData.address2} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                                    placeholder="City, State, Zip Code" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* About Section - Full Width */}
                    <div className="mt-6">
                        <label className="block text-gray-700 font-medium mb-2">About Doctor</label>
                        <textarea 
                            name="about"
                            value={formData.about} 
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                            rows={5} 
                            placeholder="Provide a detailed description of the doctor's background, expertise, and approach to patient care..."
                        ></textarea>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button 
                            type="submit" 
                            className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                        >
                            Add Doctor
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddDoctor;