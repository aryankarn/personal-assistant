import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBars, FaTimes, FaCode, FaDumbbell, FaBrain, FaTasks, FaCog, FaBell, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, loading, logout, user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const guestLinks = (
    <>
      <li>
        <Link 
          to="/register" 
          className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
          onClick={closeMenu}
        >
          Register
        </Link>
      </li>
      <li>
        <Link 
          to="/login" 
          className="block py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={closeMenu}
        >
          Login
        </Link>
      </li>
    </>
  );

  const authLinks = (
    <>
      <li>
        <Link 
          to="/dashboard" 
          className={`nav-link flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
            isActive('/dashboard') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={closeMenu}
        >
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/dsa" 
          className={`nav-link flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
            isActive('/dsa') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={closeMenu}
        >
          <FaCode className="mr-2" /> <span>DSA</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/fitness" 
          className={`nav-link flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
            isActive('/fitness') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={closeMenu}
        >
          <FaDumbbell className="mr-2" /> <span>Fitness</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/wellbeing" 
          className={`nav-link flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
            isActive('/wellbeing') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={closeMenu}
        >
          <FaBrain className="mr-2" /> <span>Wellbeing</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/tasks" 
          className={`nav-link flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
            isActive('/tasks') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={closeMenu}
        >
          <FaTasks className="mr-2" /> <span>Tasks</span>
        </Link>
      </li>
      <li className="md:hidden">
        <Link 
          to="/notifications" 
          className={`nav-link flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
            isActive('/notifications') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={closeMenu}
        >
          <FaBell className="mr-2" /> <span>Notifications</span>
        </Link>
      </li>
      <li className="md:hidden">
        <Link 
          to="/profile" 
          className={`nav-link flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
            isActive('/profile') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={closeMenu}
        >
          <FaCog className="mr-2" /> <span>Profile</span>
        </Link>
      </li>
      <li className="md:hidden">
        <button
          className="nav-link flex items-center text-red-600 hover:bg-red-50 w-full py-2.5 px-4 rounded-lg transition-all duration-200"
          onClick={() => {
            closeMenu();
            logout();
          }}
        >
          <span>Logout</span>
        </button>
      </li>
    </>
  );

  return (
    <nav className={`${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'} sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 rounded-lg mr-2 shadow-lg transform transition-all duration-300 group-hover:scale-110">
                <FaBrain className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500">
                Personal Growth
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <ul className="flex space-x-2">
              {!loading && (isAuthenticated ? authLinks : guestLinks)}
            </ul>
            
            {/* Desktop User Menu */}
            {isAuthenticated && !loading && (
              <div className="ml-6 flex items-center">
                <Link to="/notifications" className="p-2 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600 mr-3 transition-all duration-200 relative">
                  <FaBell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">2</span>
                </Link>
                
                <div className="relative group">
                  <Link to="/profile" className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-500 group-hover:shadow-lg">
                      <FaUser className="h-4 w-4" />
                    </div>
                    <span className="ml-2 font-medium hidden lg:block group-hover:text-blue-600 transition-colors duration-200">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </Link>
                  
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150">
                      Your Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150">
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {!loading && (
              <ul className="space-y-1">
                {isAuthenticated ? authLinks : guestLinks}
              </ul>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;