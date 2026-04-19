import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import logoImage from '../assets/images/Medisin_Logo.png';

const DURATION = 0.25;
const STAGGER = 0.025;

// FlipLink component for the animated links
const FlipLink = ({ children, to, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `relative mx-4 py-2 text-base font-medium ${isActive ? 'text-black' : 'text-gray-600'} ${className || ''}`
      }
    >
      {({ isActive }) => (
        <motion.div
          initial="initial"
          whileHover="hovered"
          className="group relative overflow-hidden"
        >
          {/* Original text (moves up on hover) */}
          <div>
            {children.split("").map((letter, i) => (
              <motion.span
                key={i}
                variants={{
                  initial: { y: 0 },
                  hovered: { y: "-100%" }
                }}
                transition={{
                  duration: DURATION,
                  ease: "easeInOut",
                  delay: STAGGER * i,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>
          
          {/* Clone text (moves up from below on hover) */}
          <div className="absolute inset-0">
            {children.split("").map((letter, i) => (
              <motion.span
                key={i}
                variants={{
                  initial: { y: "100%" },
                  hovered: { y: 0 }
                }}
                transition={{
                  duration: DURATION,
                  ease: "easeInOut",
                  delay: STAGGER * i,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>
          
          {/* Active indicator line */}
          {isActive && <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black" />}
          
          {/* Hover background effect */}
          <motion.div 
            className="absolute -inset-1 rounded-lg bg-gray-100/50 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-300"
            whileHover={{ 
              scale: 1.05,
              rotate: [0, 1, -1, 1, 0],
            }}
            transition={{
              rotate: { duration: 0.5, repeat: 0 },
              scale: { duration: 0.2 }
            }}
          />
        </motion.div>
      )}
    </NavLink>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Medisin AI', path: '/medisin-ai' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      
      setIsVisible(visible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    if (!isDropdownOpen) return;
    
    const handleClickOutside = (event) => {
      // Check if the click was outside the dropdown area
      if (isDropdownOpen && !event.target.closest('.avatar-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className="backdrop-blur-sm shadow-sm">
            <div className="container mx-auto px-8 lg:px-28 py-4">
              <div className="flex justify-between items-center">
                {/* Logo - Extreme Left */}
                <div>
                  <img
                    src={logoImage}
                    alt="Logo"
                    className="w-28 h-10 md:w-36 md:h-12 cursor-pointer"
                    onClick={() => navigate('/')}
                  />
                </div>

                {/* Navigation Links - Center (Desktop Only) - Now with FlipLink */}
                <div className="hidden md:flex items-center justify-center">
                  {links.map(({ name, path }) => (
                    <FlipLink key={name} to={path}>
                      {name}
                    </FlipLink>
                  ))}
                </div>

                {/* Desktop Sign In / Profile - Extreme Right */}
                <div className="hidden md:block">
                  {token ? (
                    <div className="relative avatar-dropdown-container">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 cursor-pointer focus:outline-none"
                      >
                        <p className="md:hidden lg:block text-base font-medium truncate max-w-[150px]">
                          {userData?.name || "User"}
                        </p>
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            className="w-full h-full object-cover"
                            src={userData?.image} 
                            alt="Profile"
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
                            transition={{ duration: 0.2 }}
                            style={{ transformOrigin: "top center" }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                          >
                            <div className="py-1">
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                              >
                                <NavLink
                                  to="/my-profile"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  onClick={() => setIsDropdownOpen(false)}
                                >
                                  My Profile
                                </NavLink>
                              </motion.div>
                              
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <NavLink
                                  to="/my-appointments"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  onClick={() => setIsDropdownOpen(false)}
                                >
                                  My Appointments
                                </NavLink>
                              </motion.div>
                              
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="my-1 border-t border-gray-200"
                              />
                              
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <button
                                  onClick={() => {
                                    logout();
                                    setIsDropdownOpen(false);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                                >
                                  Logout
                                </button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/login')}
                      className="bg-black text-white px-6 py-2.5 rounded-full text-sm hover:bg-gray-800 shadow-md transition-colors"
                    >
                      Create Account
                    </motion.button>
                  )}
                </div>

                {/* Mobile Menu Button*/}
                <div className="md:hidden">
                  <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <Dialog.Trigger asChild>
                      <div className="flex items-center gap-2">
                        {token && (
                          <img className="w-8 h-8 rounded-full" src={userData?.image} alt="Profile" />
                        )}
                        <button className="p-1 text-gray-600 hover:text-black">
                          <img src={assets.menu_icon} className="w-6" alt="menu" />
                        </button>
                      </div>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                      <Dialog.Content className="fixed right-4 top-4 z-50 w-64">
                        <div className="bg-white rounded-xl shadow-lg">
                          <div className="flex items-center justify-between p-4 border-b">
                            <Dialog.Title className="text-lg font-medium">Menu</Dialog.Title>
                            <Dialog.Close className="rounded-sm opacity-70 hover:opacity-100">
                              <X className="h-5 w-5" />
                            </Dialog.Close>
                          </div>
                          <div className="p-4">
                            {/* User Profile Section in Mobile Menu */}
                            {token && (
                              <div className="mb-4 pb-4 border-b">
                                <div className="flex items-center gap-3 mb-4">
                                  <img className="w-10 h-10 rounded-full" src={userData?.image} alt="Profile" />
                                  <div>
                                    <p className="font-medium text-sm">{userData?.name || "User"}</p>
                                    <p className="text-gray-500 text-xs">{userData?.email || ""}</p>
                                  </div>
                                </div>
                                <NavLink
                                  to="/my-profile"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mb-2"
                                >
                                  My Profile
                                </NavLink>
                                <NavLink
                                  to="/my-appointments"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                  My Appointments
                                </NavLink>
                              </div>
                            )}

                            {/* Navigation Links */}
                            {links.map(({ name, path }) => (
                              <NavLink
                                key={name}
                                to={path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                  `block px-4 py-3 text-sm font-medium ${isActive ? 'text-black bg-primary/10' : 'text-gray-600 hover:bg-gray-50'
                                  } rounded-lg mb-2`
                                }
                              >
                                {name}
                              </NavLink>
                            ))}

                            {/* Login/Logout Button */}
                            {token ? (
                              <button
                                onClick={() => {
                                  logout();
                                  setIsMenuOpen(false);
                                }}
                                className="w-full mt-4 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-center"
                              >
                                Logout
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  navigate('/login');
                                  setIsMenuOpen(false);
                                }}
                                className="w-full mt-4 bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-primary-dark"
                              >
                                Create Account
                              </button>
                            )}
                          </div>
                        </div>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
