import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://medizen-backend.vercel.app'

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Using isFlipped to determine the login type
    const loginType = isFlipped ? 'Admin' : 'Doctor';
    console.log(`${loginType} login:`, { email, password });

    if (loginType === 'Admin') {
      try {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
          toast.success('Admin login successful')
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed')
      }
    } else {
      try {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
          toast.success('Doctor login successful')
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed')
      }
    }
  }

  const flipCard = () => {
    setIsFlipped(prev => !prev);
    // Reset form when flipping
    setEmail('');
    setPassword('');
  };


  return (
    <div className="min-h-[35vh] flex items-center justify-center bg-gray-50 p-4">
      <div className={`flip-card w-full max-w-md ${isFlipped ? 'flipped' : ''}`} style={{ perspective: '1000px' }}>
        <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Doctor Side (Front) */}
          <div className={`flip-card-front absolute w-full rounded-xl shadow-2xl 
                        ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
               style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
            <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-xl border border-indigo-100">
              <div className="absolute top-4 right-4 flex">
                <span className="h-3 w-3 rounded-full bg-red-400 mr-1"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-400 mr-1"></span>
                <span className="h-3 w-3 rounded-full bg-green-400"></span>
              </div>
              
              <div className="text-center mb-6">
                <div className="inline-block p-4 rounded-full bg-indigo-50 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Doctor Login</h2>
                <p className="text-sm text-gray-500 mt-1">Access your patient dashboard</p>
              </div>
              
              <div className="space-y-4">
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="doctor@gmail.com"
                        required
                      />
                    </div>
                
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                
                    <button 
                      type="submit"
                      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200"
                    >
                      Sign In
                    </button>

                    <div className="text-center mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        Admin Login? 
                        <button 
                          type="button"
                          onClick={flipCard} 
                          className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
                        >
                          Switch to Admin
                        </button>
                      </p>
                    </div>
                  </>
              </div>
            </form>
          </div>
          
          {/* Admin Side (Back) */}
          <div className={`flip-card-back absolute w-full rounded-xl shadow-2xl 
                          ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
               style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <form onSubmit={onSubmitHandler} className="bg-gray-800 p-8 rounded-xl text-white border border-gray-700">
              <div className="absolute top-4 right-4 flex">
                <span className="h-3 w-3 rounded-full bg-red-400 mr-1"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-400 mr-1"></span>
                <span className="h-3 w-3 rounded-full bg-green-400"></span>
              </div>
              
              <div className="text-center mb-6">
                <div className="inline-block p-4 rounded-full bg-gray-700 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                <p className="text-sm text-gray-400 mt-1">System administration portal</p>
              </div>
              
              <div className="space-y-4">
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white transition-colors"
                        placeholder="admin@gmail.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white transition-colors"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg shadow-md transition-colors duration-200"
                    >
                      Authenticate
                    </button>
                    
                    <div className="text-center mt-4 space-y-2">                      
                      <p className="text-sm text-gray-400">
                        Doctor Login? 
                        <button 
                          type="button"
                          onClick={flipCard} 
                          className="ml-1 text-indigo-400 hover:text-indigo-300 font-medium focus:outline-none"
                        >
                          Switch to Doctor
                        </button>
                      </p>
                    </div>
                  </>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CSS for flip effect*/}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .flip-card-front {
          transform: rotateY(0deg);
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
        .flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Login;
