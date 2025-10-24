import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../button/Button';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

// Define our navigation links as an array of objects
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  // State to manage the mobile menu's open/closed status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle function for the hamburger button
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="container">
        {/* --- Desktop Navigation --- */}
        <div className="nav-desktop">
          <ul className="nav-links-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink 
                  to={link.to}
                  // This 'className' prop from NavLink gives us the active state
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button to="/contact" variant="dark">
            Inquire Now
          </Button>
        </div>

        {/* --- Mobile Navigation --- */}
        <div className="nav-mobile">
          <span className="nav-mobile-title">Menu</span>
          {/* Hamburger Menu Button */}
          <button onClick={toggleMobileMenu} className="menu-toggle-btn">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Dropdown (Animated) --- */}
      {/* This is the sliding panel. We apply the 'open' class based on state
        to trigger the CSS animation.
      */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-links-list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink 
                to={link.to}
                className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
                onClick={handleLinkClick} // Close menu on click
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Button to="/contact" variant="dark" className="mobile-menu-btn">
          Inquire Now
        </Button>
      </div>
    </nav>
  );
};


export default Navbar