import React, { useState } from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import dentist_mobile_img from '../assets/dentist_mobile.svg';
import orthopedic_mobile_img from '../assets/orthopedic_mobile.svg';
import gynecology_mobile_img from '../assets/gynecology_mobile.svg';
import dermatology_mobile_img from '../assets/dermatologist_mobile.svg';
import pediatrician_mobile_img from '../assets/pediatrician_mobile.svg';
import general_physician_mobile_img from '../assets/general_physician_mobile.svg';

const SpecialityMenu = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Mobile icons array for the decorative section
    const mobileIconsArray = [
        { img: dentist_mobile_img, name: "Dentist" },
        { img: orthopedic_mobile_img, name: "Orthopedic" },
        { img: gynecology_mobile_img, name: "Gynecology" },
        { img: dermatology_mobile_img, name: "Dermatology" },
        { img: pediatrician_mobile_img, name: "Pediatrician" },
        { img: general_physician_mobile_img, name: "General Physician" }
    ];

    return (
        <section id='speciality' className='sticky top-[-130vh] md:top-[-500px] lg:top-[-500px] xl:top-[-500px] py-24 md:py-32 px-4 overflow-hidden bg-gradient-to-b from-white to-pastel-blue-light/20'>
            {/* Soft Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 top-20 w-96 h-96 rounded-full bg-pastel-yellow-light/30 blur-3xl"></div>
                <div className="absolute -left-20 bottom-20 w-96 h-96 rounded-full bg-pastel-purple-light/30 blur-3xl"></div>
            </div>

            <div className='max-w-6xl mx-auto relative'>
                {/* Section Header with Animations */}
                <div className='text-center mb-20'>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className='inline-block px-4 py-2 rounded-full bg-pastel-blue/20 text-pastel-blue-dark text- mb-4'
                    >
                        Our Specialties
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className='text-3xl md:text-5xl font-display font-medium text-neutral-800 mb-6'
                    >
                        Find Specialists by Department
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='text-neutral-600 max-w-2xl mx-auto text-lg md:text-xl'
                    >
                        Connect with experienced healthcare professionals across various specialties for personalized care.
                    </motion.p>
                </div>

                {/* Card Grid with Staggered Animation */}
                <div
                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 px-4 z-10'>
                    {specialityData.map((item, index) => (
                        <motion.div
                            key={index}
                            className="relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            variants={{
                                visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
                                hidden: { opacity: 0, y: 30 },
                            }}
                        >
                            {/* Wrap everything inside the Link */}
                            <Link
                                to={`/doctors/${item.speciality}`}
                                onClick={() => window.scrollTo(0, 0)}
                                className="block relative"
                            >
                                {/* Base Card */}
                                <motion.div
                                    className="relative w-full aspect-[3/2] md:aspect-[4/3] rounded-lg overflow-hidden shadow-md"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                            backgroundSize: "cover",
                                        }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white text-base font-medium">
                                            {item.speciality}
                                        </h3>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Integrated Decorative Section - Fixed for Mobile */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 md:mt-12 mb-6 relative px-2 md:px-4 w-full"
                >
                    <div className="relative bg-gradient-to-r from-pastel-blue-light/30 to-pastel-purple-light/30 rounded-xl p-4 md:p-6 overflow-hidden shadow-sm">
                        {/* Background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
                        
                        <h4 className="text-center text-neutral-700 font-medium mb-4 text-sm md:text-base">Specialties at a Glance</h4>
                        
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4 relative z-10">
                            {mobileIconsArray.map((icon, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ rotate: 0 }}
                                    whileInView={{ 
                                        rotate: [0, 5, -5, 0],
                                        transition: { 
                                            duration: 1.5,
                                            delay: index * 0.2,
                                            repeat: Infinity,
                                            repeatDelay: 5
                                        }
                                    }}
                                    className="relative"
                                >
                                    <div className={`w-11 h-11 py-[-80px] md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white shadow-sm p-2 md:p-3 
                                        ${index % 2 === 0 ? 'bg-gradient-to-br from-white to-pastel-blue-light/30' : 'bg-gradient-to-br from-white to-pastel-purple-light/30'}`}
                                    >
                                        <img 
                                            src={icon.img} 
                                            alt={icon.name}
                                            className="w-full h-full object-contain" 
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 w-full">
                                        <div className="h-1 w-8 md:w-10 mx-auto rounded-full bg-pastel-blue-light/50"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-xs md:text-sm text-neutral-600">Find the right specialist for your needs</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SpecialityMenu;