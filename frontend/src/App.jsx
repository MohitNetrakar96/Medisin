import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactLenis, useLenis } from 'lenis/react';
import LoadingSpinner from './components/LoadingSpinner'; 
import MyProfile from './pages/MyProfile';
import Verify from './pages/Verify';
import ResetPassword from './pages/ResetPassword';
import MyAppointments from './pages/MyAppointments';

// Keep lazy loading for less critical components
const Doctors = lazy(() => import('./pages/Doctors'));
const Login = lazy(() => import('./pages/Login'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Appointment = lazy(() => import('./pages/Appointment'));
const MedisinAI = lazy(() => import('./pages/MedisinAI'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const App = () => {
  // Configure Lenis for smooth scrolling with performance options
  const lenisOptions = {
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1.0, // Lower value for better performance
    smoothTouch: false, 
  };

  const lenis = useLenis();

  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isMyProfile = location.pathname === '/my-profile';

  const hideFooterPages = ['/login', '/about', '/contact', '/my-appointments', '/my-profile', '/verify', '/medisin-ai'];
  const isFooterHidden = hideFooterPages.includes(location.pathname) || location.pathname.startsWith('/doctors') || location.pathname.startsWith('/appointment');

 
  React.useEffect(() => {
    // Preload routes based on current location
    if (location.pathname === '/') {
      import('./pages/Doctors');
      import('./pages/About');
    } else if (location.pathname.startsWith('/doctors')) {
      import('./pages/Appointment');
    }
  }, [location.pathname]);

  return (
    <ReactLenis root options={lenisOptions}>
      <div className="w-full min-h-screen flex flex-col">
        {!isLoginPage && (
          <div className="container mx-auto px-4 sm:px-8 lg:px-16">
            <Navbar />
          </div>
        )}

        {/* Configure ToastContainer for better performance */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false} // Improve performance
          draggable={false} // Improve performance
          pauseOnHover
          limit={3} // Limit concurrent toasts
        />

        <div className={`flex-grow ${isLoginPage || isMyProfile ? '' : 'container mx-auto px-4 sm:px-8 lg:px-16'}`}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/doctors' element={<Doctors />} />
              <Route path='/doctors/:speciality' element={<Doctors />} />
              <Route path='/login' element={<Login />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path='/appointment/:docId' element={<Appointment />} />
                <Route path='/my-appointments' element={<MyAppointments />} />
                <Route path='/my-profile' element={<MyProfile />} />
                <Route path='/verify' element={<Verify />} />
              </Route>
              
              <Route path="/medisin-ai" element={<MedisinAI />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </div>

        {!isFooterHidden && <Footer />}
      </div>
    </ReactLenis>
  );
};

// Add this for component memoization to prevent unnecessary re-renders
export default React.memo(App);
