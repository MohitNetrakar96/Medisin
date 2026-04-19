import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/images/Medisin_Logo.png";
import SignUpImage from '../assets/LoginContainer_IMG.png';
import LoginImage from '../assets/SignUp_IMG.png';
import LoginPageBackground from '../assets/LoginPage_BG.jpg';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const endpoint = state === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = state === 'Sign Up' ? { name, email, password } : { email, password };
      
      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleForgotPassword = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/forgot-password', {
        email: forgotEmail
      });
      if (data.success) {
        toast.success('Password reset email sent!');
        setShowForgotPassword(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-8 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${LoginPageBackground})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative w-full max-w-4xl md:max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-lg overflow-hidden bg-white bg-opacity-90 backdrop-blur-md">
        
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={state === 'Sign Up' ? SignUpImage : LoginImage}
            alt="Login / Sign Up"
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-4 left-4">
            <img src={Logo} alt="Logo" className="h-10" />
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 bg-white bg-opacity-80 text-gray-800 font-semibold px-3 py-2 rounded-md shadow-md hover:bg-opacity-100 transition"
          >
            Home
          </button>
        </div>
        
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            {state === 'Sign Up' ? 'Create an account' : 'Login to your account'}
          </h2>
          <p className="text-gray-500 mb-6">
            {state === 'Sign Up' ? 'Sign up to book an appointment' : 'Enter your email below to login'}
          </p>
          
          <form onSubmit={onSubmitHandler} className="space-y-4 sm:space-y-5">
            {state === 'Sign Up' && (
              <div>
                <label className="block text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-md font-medium hover:bg-blue-700">
              {state === 'Sign Up' ? 'Create account' : 'Login'}
            </button>
            
            <p className="mt-4 text-center text-sm sm:text-base">
              {state === 'Sign Up' ? (
                <>
                  Already have an account?{' '}
                  <span onClick={() => setState('Login')} className="text-blue-500 cursor-pointer">
                    Log in
                  </span>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <span onClick={() => setState('Sign Up')} className="text-blue-500 cursor-pointer">
                    Sign up
                  </span>
                </>
              )}
            </p>
          </form>
          
          {!showForgotPassword ? (
            <button 
              type="button" 
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-500 hover:text-blue-700 mt-4"
            >
              Forgot Password?
            </button>
          ) : (
            <div className="mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleForgotPassword}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-500 ml-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
