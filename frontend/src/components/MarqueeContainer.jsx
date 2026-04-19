import React from 'react';
import firstMarqueeImage from '../assets/marquee_images/first_marquee.png';
import marqueeCornerDoctor from '../assets/marquee-corner-doctor.svg';
import TopDoctors from './TopDoctors';

function Marquee() {
  return (
    <div className='relative w-screen h-screen left-1/2 -translate-x-1/2 z-0 mt-[-90vh] md:mt-[-550px] lg:mt-[-550px] xl:mt-[-550px]'>
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={firstMarqueeImage} 
          alt="First marquee"
          className='w-full h-[210vh] md:h-[126vh] lg:h-[112vh] object-cover'
        />
      </div>
      
      {/* Main Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            
            {/* Left Column (Title & Corner Doctor Image) */}
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start relative mb-12 md:mb-0">
              
              {/* Title & Description */}
              <div className="mt-[105vh] sm:mt-[70vh] md:mt-[25vh] md:ml-[-20px] lg:mt-[55px] xl:mt-[60px] text-center md:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#262626] mb-4">
                  Top Doctors
                </h1>
                <p className="text-lg md:hidden xl:block lg:text-xl text-[#262626] mb-6">
                  Simply browse through our extensive list of trusted doctors.
                </p>
              </div>

              {/* Corner Doctor Image (Positioned Bottom-Left on Medium Screens) */}
              <div className="hidden lg:block absolute lg:bottom-[-94vh] xl:bottom-[-85vh] lg:left-[-26vh] xl:left-[-19vh] z-10">
                <img 
                  src={marqueeCornerDoctor} 
                  alt="corner doctor image"
                  className="w-48 md:w-[40vh] lg:w-[45vw] xl:w-[45vw] max-w-3xl"
                />
              </div>
            </div>
            
            {/* Right Column (Doctor Cards) */}
            <div className="w-[33vh] sm:w-full md:w-full lg:w-2/2 xl:w-2/3 mt-[3px] md:mt-[40vh] lg:mt-[20vh] xl:mt-[10vh] md:pl-6 lg:pl-8">
              <TopDoctors />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Marquee;
