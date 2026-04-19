import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);
  const [isExpanded, setIsExpanded] = useState(true);

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' }
  };

  const linkTextVariants = {
    expanded: { opacity: 1, display: 'block' },
    collapsed: { opacity: 0, display: 'none' }
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className='min-h-screen bg-white border-r shadow-sm relative'
      initial="expanded"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.button
        className='absolute -right-3 top-5 bg-primary text-white rounded-full p-1 shadow-md z-10'
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          {isExpanded ? (
            <path d="M11 8L6 3v10l5-5z" />
          ) : (
            <path d="M5 8l5-5v10l-5-5z" />
          )}
        </svg>
      </motion.button>

      <div className="flex justify-center my-6">
        <motion.div 
          className="text-primary font-bold text-xl"
          variants={linkTextVariants}
        >
          {isExpanded && (aToken ? "Admin Panel" : "Doctor Portal")}
        </motion.div>
      </div>

      {aToken && (
        <ul className='text-gray-600 mt-5 flex flex-col gap-2'>
          {[
            { to: '/admin-dashboard', icon: assets.home_icon, label: 'Dashboard' },
            { to: '/all-appointments', icon: assets.appointment_icon, label: 'Appointments' },
            { to: '/add-doctor', icon: assets.add_icon, label: 'Add Doctor' },
            { to: '/doctor-list', icon: assets.people_icon, label: 'Doctors List' }
          ].map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => 
                `flex items-center gap-3 py-3.5 px-4 mx-2 rounded-lg transition-all duration-300 
                ${isActive 
                  ? 'bg-gradient-to-r from-primary/90 to-primary text-white shadow-md' 
                  : 'hover:bg-gray-100'}`
              }
            >
              <motion.div 
                whileHover="hover"
                whileTap="tap"
                variants={iconVariants}
              >
                <img className='min-w-5' src={item.icon} alt='' />
              </motion.div>
              <motion.p variants={linkTextVariants}>{item.label}</motion.p>
            </NavLink>
          ))}
        </ul>
      )}

      {dToken && (
        <ul className='text-gray-600 mt-5 flex flex-col gap-2'>
          {[
            { to: '/doctor-dashboard', icon: assets.home_icon, label: 'Dashboard' },
            { to: '/doctor-appointments', icon: assets.appointment_icon, label: 'Appointments' },
            { to: '/doctor-profile', icon: assets.people_icon, label: 'Profile' }
          ].map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => 
                `flex items-center gap-3 py-3.5 px-4 mx-2 rounded-lg transition-all duration-300 
                ${isActive 
                  ? 'bg-gradient-to-r from-primary/90 to-primary text-white shadow-md' 
                  : 'hover:bg-gray-100'}`
              }
            >
              <motion.div 
                whileHover="hover"
                whileTap="tap"
                variants={iconVariants}
              >
                <img className='min-w-5' src={item.icon} alt='' />
              </motion.div>
              <motion.p variants={linkTextVariants}>{item.label}</motion.p>
            </NavLink>
          ))}
        </ul>
      )}

      <div className="absolute bottom-8 w-full flex justify-center">
        <motion.div 
          className="text-xs text-gray-400"
          variants={linkTextVariants}
        >
          {isExpanded && "© 2025 MEDISIN Panel"}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
