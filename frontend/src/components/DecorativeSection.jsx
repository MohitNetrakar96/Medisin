import React from 'react';
import { motion } from 'framer-motion';
import dentist_mobile_img from '../assets/dentist_mobile.svg';
import orthopedic_mobile_img from '../assets/orthopedic_mobile.svg';
import gynecology_mobile_img from '../assets/gynecology_mobile.svg';
import dermatology_mobile_img from '../assets/dermatologist_mobile.svg';
import pediatrician_mobile_img from '../assets/pediatrician_mobile.svg';
import general_physician_mobile_img from '../assets/general_physician_mobile.svg';

const mobileIconsArray = [
    { img: dentist_mobile_img, name: "Dentist" },
    { img: orthopedic_mobile_img, name: "Orthopedic" },
    { img: gynecology_mobile_img, name: "Gynecology" },
    { img: dermatology_mobile_img, name: "Dermatology" },
    { img: pediatrician_mobile_img, name: "Pediatrician" },
    { img: general_physician_mobile_img, name: "General Physician" }
];

const DecorativeSection = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mt-10 mb-6 relative"
        >
            <div className="relative bg-gradient-to-r from-pastel-blue-light/30 to-pastel-purple-light/30 rounded-xl p-4 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
                
                <h4 className="text-center text-neutral-700 font-medium mb-4">Specialties at a Glance</h4>
                
                <div className="flex flex-wrap justify-center gap-2 relative z-10">
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
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm p-3 
                                ${index % 2 === 0 ? 'bg-gradient-to-br from-white to-pastel-blue-light/30' : 'bg-gradient-to-br from-white to-pastel-purple-light/30'}`}
                            >
                                <img 
                                    src={icon.img} 
                                    alt={icon.name}
                                    className="w-full h-full object-contain" 
                                />
                            </div>
                            <div className="absolute -bottom-1 w-full">
                                <div className="h-1 w-10 mx-auto rounded-full bg-pastel-blue-light/50"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xs text-neutral-600">Find the right specialist for your needs</p>
                </div>
            </div>
        </motion.div>
    );
};

export default DecorativeSection;
