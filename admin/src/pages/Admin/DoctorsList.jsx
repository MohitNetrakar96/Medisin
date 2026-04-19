import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { CheckCircle, XCircle } from 'lucide-react'; // Using Lucide icons

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-blue-50">
      <h1 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Our Medical Professionals</h1>
      
      {/* Grid layout that adapts to different screen sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {doctors.map((doctor, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full"
          >
            <div className="relative overflow-hidden h-48">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className={`absolute top-0 right-0 m-2 px-2 py-1 rounded-full text-xs font-medium ${doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {doctor.available ? 'Available' : 'Unavailable'}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{doctor.name}</h3>
              <p className="text-blue-600 text-sm font-medium mb-3">{doctor.speciality}</p>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doctor.available}
                    onChange={() => changeAvailability(doctor._id)}
                    className="sr-only"
                  />
                  <div className={`relative flex items-center ${doctor.available ? 'text-green-500' : 'text-gray-400'}`}>
                    {doctor.available ? 
                      <CheckCircle className="w-5 h-5 mr-1" /> : 
                      <XCircle className="w-5 h-5 mr-1" />
                    }
                    <span className="text-sm">
                      {doctor.available ? 'On duty' : 'Off duty'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {doctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No doctors available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;