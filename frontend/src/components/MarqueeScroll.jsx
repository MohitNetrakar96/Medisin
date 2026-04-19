import React from 'react';
import { motion } from 'framer-motion';

function MarqueeScroll() {
    return (
        <div className='relative mt-[68vh] lg:mt-[-70px] w-screen h-screen left-1/2 -translate-x-1/2 bg-[#FFFF99] py-2 overflow-hidden flex items-center z-15'>
            <div className="text border-t-2 border-b-2 border-black flex gap-10 whitespace-nowrap overflow-hidden mt-[-670px] md:mt-[-600px] lg:mt-[-550px]">
                <motion.div
                    className="flex gap-10 whitespace-nowrap"
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ ease: "linear", repeat: Infinity, duration: 5 }}>
                    <a href="#speciality" className='flex'>
                        <h1 className='text-[40px] md:text-[80px] lg:text-[6vw] xl:text-[6vw] font-semibold uppercase px-5'>Book Your Appointment</h1>
                        <h1 className='text-[40px] md:text-[80px] lg:text-[6vw] xl:text-[6vw] font-semibold uppercase px-5'>Book Your Appointment</h1>
                        <h1 className='text-[40px] md:text-[80px] lg:text-[6vw] xl:text-[6vw] font-semibold uppercase px-5'>Book Your Appointment</h1>
                    </a>

                </motion.div>
            </div>
        </div>
    );
}

export default MarqueeScroll;
