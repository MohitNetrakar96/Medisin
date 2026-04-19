import React from 'react';
import { assets } from '../assets/assets';
import header_image from '../assets/header-animated-logo2.svg';
import corner_animation from '../assets/corner-animate2.svg';
import bottom_corner_animation from '../assets/bottom-corner-animation-cropped.svg';

const Header = () => {
    return (
        <div className="relative flex flex-col md:flex-row items-center w-full min-h-[70vh] md:min-h-screen">
            {/* Corner Animation - Hidden on Mobile, Shown on Desktop */}
            <div className="hidden lg:block absolute top-0 lg:left-[-900px] w-full h-full z-0 overflow-hidden pointer-events-none">
                <img
                    className="w-full h-full object-cover"
                    src={corner_animation}
                    alt="Corner animation"
                />
            </div>

            {/* Image Container */}
            <div className="relative md:hidden lg:hidden xl:absolute xl:block w-[50vh] xl:w-[60%] xl:h-full h-[400px] top-[25px] xl:top-[50px] right-0 mt-8 lg:mt-0 z-20">
                <img
                    className="w-full h-full object-cover md:object-cover"
                    src={header_image}
                    alt="Medical illustration"
                />
            </div>

            <div className="hidden lg:block absolute bottom-[-500px] lg:bottom-[-250px] xl:bottom-[-500px] lg:right-[-190px] xl:right-[-64px] lg:w-[60vh] xl:w-[50vh] h-[-100px] z-10 overflow-hidden pointer-events-none">
                <img
                    className="w-full h-full object-cover"
                    src={bottom_corner_animation}
                    alt="Corner animation"
                />
            </div>

            {/* Combined Containers Block */}
            <div className="w-11/12 md:w-[850px] lg:w-[60%] xl:w-[40%] flex flex-col gap-4 z-20 mx-auto md:ml-50 lg:ml-10 xl:ml-[85px] mt-[-40px] lg:mt-4 md:mt-0">
                {/* Main Text Container */}
                <div className="bg-[#CFE8FF] rounded-3xl px-5 md:px-10 lg:px-16 py-6 md:py-10 flex flex-col items-start gap-4 md:gap-6 shadow-lg">
                    <p className="text-2xl md:text-4xl font-semibold text-gray-800 leading-tight md:leading-snug">
                        Book Appointment <br className="hidden xs:block" /> With Trusted Doctors
                    </p>

                    <div className="flex items-center gap-3 text-gray-700">
                        <img
                            className="w-16 md:w-24"
                            src={assets.group_profiles}
                            alt="Trusted users"
                        />
                        <p className="text-xs md:text-sm font-light leading-relaxed">
                            Browse our extensive list of trusted doctors and <br className="hidden sm:block" /> schedule appointments hassle-free.
                        </p>
                    </div>

                    <a
                        href="#speciality"
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full text-sm hover:scale-105 transition-transform duration-300"
                    >
                        Book appointment
                        <img
                            className="w-3 md:w-4"
                            src={assets.arrow_icon}
                            alt="Arrow icon"
                        />
                    </a>
                </div>

                {/* Additional Containers Row */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    {/* Services Container */}
                    <div className="w-full md:w-3/4 bg-white rounded-3xl px-5 md:px-8 py-6 shadow-md">
                        <h3 className="text-xl font-medium text-gray-800 mb-2">Our Services</h3>
                        <p className="text-sm text-gray-600">
                            Explore our range of medical services designed to provide you with comprehensive healthcare solutions.
                        </p>
                    </div>

                    {/* Emergency Container */}
                    <div className="w-full md:w-1/4 bg-gray-100 rounded-3xl px-4 py-6 shadow-md flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-gray-800 text-center">24/7</p>
                        <p className="text-xs text-gray-600 text-center">Emergency Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;