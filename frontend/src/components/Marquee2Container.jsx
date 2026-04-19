import React from 'react';
import secondMarqueeImage from '../assets/marquee_images/second_marquee.png';
import EndBanner from './EndBanner';
import EndBanner2 from './EndBanner2';
function Marquee2() {
    return (
        <div className='relative mt-[10vh] sm:mt-[-30vh] md:mt-[-75vh] lg:mt-[-35vh] w-screen h-screen left-1/2 -translate-x-1/2 z-10'>
           <div className="absolute inset-0 z-0">
            <img 
              src={secondMarqueeImage} 
              alt="Healthcare background"
              className='w-full h-[150vh] sm:h-[155vh] md:h-[165vh] lg:h-[195vh] xl:h-[174vh] object-cover'
            />
          </div>
          
          <div className="relative z-20 pb-20">
            <EndBanner />
          </div>
          
          <div className="relative z-20 mt-[-10vh] lg:mt-[-15vh]">
            <EndBanner2 />
          </div>
        </div>
    )
}

export default Marquee2
