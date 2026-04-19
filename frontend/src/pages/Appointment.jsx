import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import ConfirmationModal from '../components/AppointmentConfirmationModal'
import SuccessModal from '../components/SuccessModal'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion';

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    
    // Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {

        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];


            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]))

        }

    }

    const handleBookClick = () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }
        
        if (!slotTime) {
            toast.warning('Please select a time slot')
            return
        }
        
        setShowConfirmModal(true)
    }

    const bookAppointment = async () => {
        setShowConfirmModal(false)
        
        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                getDoctosData()
                setShowSuccessModal(true)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    
    const handleSuccessClose = () => {
        setShowSuccessModal(false)
        navigate('/my-appointments')
    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };
    
    const slideUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };
    
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
        }
    };
    
    const pulse = {
        scale: [1, 1.02, 1],
        transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
    };

    return docInfo ? (
        <div className='pt-8 sm:pt-12 md:pt-16 max-w-7xl mx-auto px-3 sm:px-5'>
        {/* ---------- Doctor Details ----------- */}
        <motion.div 
          className='flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8'
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* Doctor Image */}
          <motion.div 
            className='w-full md:w-56 lg:w-64 xl:w-72 md:sticky md:top-24 md:self-start'
            variants={slideUp}
          >
            <motion.img 
              whileHover={{ scale: 1.02 }}
              className='bg-primary mt-[80px] w-[280px] h-[290px] md:w-56 md:h-64 lg:w-[280px] lg:h-72 mx-auto md:mx-0 object-cover rounded-lg shadow-md border border-primary/10' 
              src={docInfo.image} 
              alt={docInfo.name} 
            />
          </motion.div>
  
          {/* Doctor Info Container */}
          <motion.div 
            variants={slideUp}
            className='flex-1 border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 bg-white mx-2 sm:mx-0 mt-[-30px] sm:mt-[-40px] md:mt-0 shadow-sm z-10 relative'
          >
            {/* ----- Doc Info : name, degree, experience ----- */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className='flex items-center gap-1.5 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800'
                >
                  {docInfo.name} 
                  <motion.img 
                    animate={pulse}
                    className='w-4 h-4 sm:w-5 sm:h-5' 
                    src={assets.verified_icon} 
                    alt="Verified" 
                  />
                </motion.h2>
                <div className='flex flex-wrap items-center gap-2 mt-1 sm:mt-1.5'>
                  <p className='text-sm sm:text-base text-gray-700 font-medium'>{docInfo.degree} - {docInfo.speciality}</p>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className='py-0.5 px-2 bg-primary/10 text-primary text-xs font-medium rounded-full'
                  >
                    {docInfo.experience}
                  </motion.span>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className='mt-2 md:mt-0'
              >
                <p className='text-lg sm:text-xl font-bold text-primary'>{currencySymbol}{docInfo.fees}</p>
                <p className='text-xs sm:text-sm text-gray-500'>Appointment fee</p>
              </motion.div>
            </div>
  
            {/* ----- Doc About ----- */}
            <motion.div 
              variants={slideUp}
              className='mt-4 sm:mt-6 border-t border-gray-100 pt-4 sm:pt-5'
            >
              <h3 className='flex items-center gap-1.5 text-base sm:text-lg font-semibold text-gray-800 mb-2'>
                About Doctor
                <img className='w-3.5' src={assets.info_icon} alt="Info" />
              </h3>
              <div className='prose prose-sm sm:prose max-w-none'>
                <p className='text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed'>{docInfo.about}</p>
              </div>
            </motion.div>
  
            {/* Booking slots */}
            <motion.div 
              variants={slideUp}
              className='mt-5 sm:mt-6 border-t border-gray-100 pt-4 sm:pt-5'
            >
              <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4'>Available Appointment Slots</h3>
              
              {/* Date selector */}
              <div className='relative'>
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className='flex gap-2 sm:gap-3 items-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100 md:overflow-visible'
                >
                  {docSlots.length > 0 && docSlots.map((item, index) => (
                    <motion.div 
                      variants={slideUp}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSlotIndex(index)} 
                      key={index} 
                      className={`flex flex-col items-center justify-center p-2 sm:p-3 min-w-16 sm:min-w-20 h-16 sm:h-20 rounded-lg cursor-pointer transition-all duration-200 ${
                        slotIndex === index 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <p className={`text-sm sm:text-base ${slotIndex === index ? 'font-semibold' : 'font-medium'}`}>
                        {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                      </p>
                      <p className={`text-lg sm:text-xl ${slotIndex === index ? 'font-bold' : 'font-semibold'}`}>
                        {item[0] && item[0].datetime.getDate()}
                      </p>
                      <p className={`text-xs ${slotIndex === index ? 'text-white/80' : 'text-gray-500'}`}>
                        {item[0] && new Intl.DateTimeFormat('en-US', { month: 'short' }).format(item[0].datetime)}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Custom scroll controls for desktop */}
                <div className='hidden lg:flex absolute top-1/2 left-0 transform -translate-y-1/2 -ml-4'>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 focus:outline-none'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                </div>
                <div className='hidden lg:flex absolute top-1/2 right-0 transform -translate-y-1/2 -mr-4'>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 focus:outline-none'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
  
              {/* Time slots */}
              <motion.div 
                variants={slideUp}
                className='mt-4 sm:mt-5'
              >
                <h4 className='text-xs sm:text-sm font-medium text-gray-500 mb-2'>Select Time</h4>
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2'
                >
                  {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                    <motion.div
                      variants={slideUp}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSlotTime(item.time)} 
                      key={index} 
                      className={`text-center py-2 px-1 rounded-md cursor-pointer transition-all duration-200 ${
                        item.time === slotTime 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <p className={`text-xs sm:text-sm ${item.time === slotTime ? 'font-medium' : 'font-normal'}`}>
                        {item.time.toLowerCase()}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
  
              {/* Booking button */}
              <div className='mt-6 sm:mt-8 flex justify-center sm:justify-start'>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBookClick} 
                  className='bg-primary text-white text-sm sm:text-base font-medium px-6 sm:px-8 py-2.5 rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Appointment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
  
        {/* Listing Related Doctors */}
        <motion.div 
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className='mt-8 md:mt-10 lg:mt-12'
        >
          <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </motion.div>
        
        {/* Confirmation Modal */}
        <ConfirmationModal 
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={bookAppointment}
          doctorName={docInfo.name}
          appointmentDate={docSlots[slotIndex] && docSlots[slotIndex][0] ? docSlots[slotIndex][0].datetime : null}
          appointmentTime={slotTime}
        />
        
        {/* Success Modal */}
        <SuccessModal 
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
        />
      </div>
    ) : null
}

export default Appointment