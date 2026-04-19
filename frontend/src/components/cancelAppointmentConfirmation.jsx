import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, appointmentDetails }) => {
  if (!isOpen) return null;

  // Format the date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const dateParts = dateStr.split('_');
    if (dateParts.length !== 3) return dateStr;
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = dateParts[0];
    const month = months[parseInt(dateParts[1]) - 1];
    const year = dateParts[2];
    
    return `${day} ${month} ${year}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-red-50 p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-semibold text-red-600">Cancel Appointment</h3>
            </div>
            
            {/* Body */}
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Are you sure you want to cancel your appointment with{' '}
                <span className="font-semibold">{appointmentDetails?.doctorName}</span>?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Appointment Details</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">
                      {appointmentDetails?.date && formatDate(appointmentDetails.date)}
                    </p>
                    <p className="text-sm font-medium text-red-600 mt-1">
                      {appointmentDetails?.time}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                This action cannot be undone. The appointment slot will be released and available to other patients.
              </p>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-100 p-4 sm:p-5 flex gap-3 justify-end">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep Appointment
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Appointment
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;