import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCode, 
  FaDumbbell, 
  FaBrain, 
  FaTasks, 
  FaUser 
} from 'react-icons/fa';

const BottomNav = () => {
  const location = useLocation();
  
  // Define navigation items with their icons
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <FaHome className="bottom-nav-icon" /> },
    { path: '/dsa', label: 'DSA', icon: <FaCode className="bottom-nav-icon" /> },
    { path: '/fitness', label: 'Fitness', icon: <FaDumbbell className="bottom-nav-icon" /> },
    { path: '/wellbeing', label: 'Wellbeing', icon: <FaBrain className="bottom-nav-icon" /> },
    { path: '/tasks', label: 'Tasks', icon: <FaTasks className="bottom-nav-icon" /> },
    { path: '/profile', label: 'Profile', icon: <FaUser className="bottom-nav-icon" /> },
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-container">
        {navItems.map((item, index) => (
          <NavLink 
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `bottom-nav-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;