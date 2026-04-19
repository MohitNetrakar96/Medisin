import React from 'react';
import endBanner2Image from '../assets/endbannerdoc.svg';

const EndBanner2 = () => {
  return (
    <section className="relative z-20 mt-[-20vh] lg:mt-[48vh]">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Text Content - Left Side (lg+) */}
          <div className="block order-1 sm:hidden lg:block xl:mt-[-50vh] xl:ml-[8vw]">
            <h1 className="text-3xl font-semibold text-center text-gray-900 lg:text-left xl:text-5xl 2xl:text-6xl">
              Book Your Appointment at Medisin
            </h1>
            
            <div className="mt-8 lg:mt-12 flex justify-center lg:justify-start">
              <a
                href="#"
                className="inline-block px-8 py-3 text-lg font-semibold text-white transition-colors duration-200 bg-black rounded-3xl xl:px-10 xl:py-4 hover:bg-white hover:text-black"
              >
                Schedule Consultation
              </a>
            </div>
          </div>

          {/* Image Container - Responsive Right Alignment */}
          <div className="relative lg:col-start-2 lg:row-start-1">
            <img 
              className="w-full max-w-2xl mt-[-16vh] lg:max-w-4xl lg:w-[100%] xl:mt-[-50vh] xl:w-[100%] 2xl:w-full xl:h-[140vw] object-contain lg:ml-auto"
              src={endBanner2Image} 
              alt="Medical professionals"
              style={{
                maxHeight: '700px',
                transform: 'lg:translateX(10%) xl:translateX(0)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EndBanner2;
