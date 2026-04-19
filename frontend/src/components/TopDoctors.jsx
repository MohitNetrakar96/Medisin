import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
    const [visibleDoctors, setVisibleDoctors] = useState(4);

    // Helper function to get current month
    const getCurrentMonth = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[new Date().getMonth()];
    };

    // Helper function to generate calendar dates
    const getWeekDates = () => {
        const today = new Date();
        const weekDates = [];

        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            weekDates.push({
                day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
                date: date.getDate()
            });
        }

        return weekDates;
    };

    useEffect(() => {
        const updateVisibleDoctors = () => {
            if (window.innerWidth >= 640) {
                setVisibleDoctors(6);
            } else {
                setVisibleDoctors(4);
            }
        };

        updateVisibleDoctors();
        window.addEventListener('resize', updateVisibleDoctors);
        return () => window.removeEventListener('resize', updateVisibleDoctors);
    }, []);


    const weekDates = getWeekDates();

    return (
        <div className="w-full">
            {/* Card grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-4 mb-6">
                {doctors.slice(0, visibleDoctors).map((item, index) => (
                    <div
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }}
                        className="bg-[#5B87FF] rounded-3xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 text-white flex flex-col min-h-[240px]"
                        key={index}
                    >
                        {/* Image section */}
                        <div className="w-full h-40 relative flex-shrink-0">
                            <div className="w-full h-56 relative flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#5B87FF] to-transparent opacity-93"></div>
                            </div>

                        </div>

                        {/* Doctor info */}
                        <div className="p-4 flex-1 flex flex-col justify-between z-10">
                            <div>
                                <p className="text-sm opacity-80">{item.speciality}</p>
                                <h3 className="text-xl font-semibold">{item.name}</h3>
                            </div>

                            {/* Availability status */}
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                                <span className="text-sm">{item.available ? 'Available' : 'Not Available'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* More button */}
            <div className="flex justify-center">
                <button
                    onClick={() => { navigate('/doctors'); scrollTo(0, 0); }}
                    className="bg-white text-[#5B87FF] hover:bg-[#EAEFFF] px-10 py-2 rounded-full font-medium transition-all duration-300 shadow-sm"
                >
                    more
                </button>
            </div>
        </div>
    );
};

export default TopDoctors;