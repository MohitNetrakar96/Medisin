import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Dentist',
    'Orthopedist'
  ];

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="pt-24 px-4 md:px-6 lg:px-8 w-full min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Find Your Specialist</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Browse through our network of trusted medical specialists to find the right care for your health needs.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-5 sticky top-24">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-gray-800">Specialities</h2>
              <button 
                onClick={() => setShowFilter(!showFilter)} 
                className="lg:hidden flex items-center gap-1 text-primary"
              >
                {showFilter ? 'Hide' : 'Show'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showFilter ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              </button>
            </div>
            
            <div className={`flex flex-col gap-2 ${showFilter ? 'block' : 'hidden lg:block'}`}>
              {specialities.map((spec, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    speciality === spec 
                      ? 'bg-gradient-to-r from-primary/90 to-primary text-white shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                >
                  <p className="font-medium">{spec}</p>
                </motion.div>
              ))}
              
              {speciality && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => navigate('/doctors')}
                >
                  Clear Filters
                </motion.button>
              )}
            </div>
          </div>
        </div>
        
        {/* Doctors Grid */}
        <div className="flex-grow">
          {filterDoc.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-xl">
              No doctors found matching your criteria.
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filterDoc.map((item, index) => (
            <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;