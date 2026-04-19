import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 relative animate-[spin2s_2s_linear_infinite]">
        <div className="w-5 h-5 bg-gray-800 rounded-full absolute top-0 left-0"></div>
        <div className="w-5 h-5 bg-gray-800 rounded-full absolute top-0 right-0"></div>
        <div className="w-5 h-5 bg-gray-800 rounded-full absolute bottom-0 left-0"></div>
        <div className="w-5 h-5 bg-gray-800 rounded-full absolute bottom-0 right-0"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
