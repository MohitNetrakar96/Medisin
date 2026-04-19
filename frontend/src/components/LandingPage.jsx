import React, { useState } from 'react';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: '/images/healthcare-1.jpg',
      number: '01',
      total: '03',
      title: 'We want to heal the patient with services.',
      description: 'We offer personalized services designed to support and enhance your path to optimal wellness.',
      buttonText: 'Learn More'
    },
    {
      id: 2,
      image: '/images/healthcare-2.jpg',
      number: '02',
      total: '03',
      title: 'Advanced technology meets compassionate care.',
      description: 'Our state-of-the-art facilities combined with our expert team provide the highest standard of treatment.',
      buttonText: 'Our Services'
    },
    {
      id: 3,
      image: '/images/healthcare-3.jpg',
      number: '03',
      total: '03',
      title: 'Patient-centered approach to healthcare.',
      description: 'We put your needs first, creating customized treatment plans for your unique health journey.',
      buttonText: 'Contact Us'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${slides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative h-full w-full">
        {/* Left side content */}
        <div className="absolute inset-y-0 left-0 w-2/3 flex flex-col justify-center px-16 z-10">
          <div className="text-white mb-2">
            <span className="text-5xl font-light">{slides[currentSlide].number}</span>
            <span className="text-xl text-gray-300 font-light">/{slides[currentSlide].total}</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white leading-tight mb-6 max-w-2xl">
            {slides[currentSlide].title}
          </h1>
          
          <p className="text-lg text-gray-200 mb-12 max-w-xl">
            {slides[currentSlide].description}
          </p>
          
          <div className="flex space-x-4">
            <a 
              href="#learn-more" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded text-sm font-medium flex items-center transition-colors"
            >
              {slides[currentSlide].buttonText}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            
            <a 
              href="#contact" 
              className="border border-white text-white px-8 py-3 rounded text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-10 left-16 flex items-center space-x-4 z-10">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Watch Video Button */}
        <div className="absolute bottom-10 right-16 z-10">
          <button className="flex items-center space-x-2 bg-gray-900 bg-opacity-70 text-white px-5 py-2 rounded-full text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Watch Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;