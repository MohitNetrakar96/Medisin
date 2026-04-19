import React from 'react'
import { motion } from 'framer-motion'
import AboutUs_Img from '../assets/aboutus-image.svg'

const About = () => {
  return (
    <div className='min-h-screen bg-gray-50 px-4 py-20'>
      <div className='container mx-auto'>
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h1 className='mt-[30px] text-4xl font-bold text-gray-800'>
            ABOUT <span className='text-blue-600'>US</span>
          </h1>
        </motion.div>

        {/* Content Section */}
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='w-full'
          >
            <img 
              src={AboutUs_Img} 
              alt="MEDISIN About Us" 
              className='w-full h-auto' 
            />
          </motion.div>

          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='space-y-6'
          >
            <p className='text-gray-600 leading-relaxed'>
              Welcome to MEDISIN, your trusted partner in managing your healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              MEDISIN is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service.
            </p>
            
            <div className='border-l-4 border-blue-600 pl-4 py-2'>
              <h3 className='text-2xl font-semibold text-gray-800 mb-2'>Our Vision</h3>
              <p className='text-gray-600 italic'>
                To create a seamless healthcare experience, bridging the gap between patients and healthcare providers.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Why Choose Us Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='mt-16'
        >
          <h2 className='text-3xl text-center mb-12 text-gray-800'>
            WHY <span className='text-blue-600'>CHOOSE US</span>
          </h2>
          
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              { 
                title: 'EFFICIENCY', 
                description: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
                icon: '⏱️'
              },
              { 
                title: 'CONVENIENCE', 
                description: 'Access to a network of trusted healthcare professionals in your area.',
                icon: '🏥'
              },
              { 
                title: 'PERSONALIZATION', 
                description: 'Tailored recommendations and reminders to help you stay on top of your health.',
                icon: '🩺'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-2xl'
              >
                <div className='text-5xl mb-4'>{feature.icon}</div>
                <h3 className='text-xl font-bold text-gray-800 mb-3'>{feature.title}</h3>
                <p className='text-gray-600'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
