import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiShoppingBag } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let scrollTimeout;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100; // Hide navbar only after scrolling past 100px
      
      // Scroll up: show navbar
      if (currentScrollY < lastScrollY || currentScrollY < scrollThreshold) {
        if (!isVisible) {
          setIsVisible(true);
        }
      } 
      // Scroll down: hide navbar (only if past threshold)
      else if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        if (isVisible) {
          setIsVisible(false);
          setIsMenuOpen(false); // Close mobile menu when navbar hides
        }
      }
      
      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true });
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [lastScrollY, isVisible]);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Suppliers', path: '/listings' },
    { name: 'Products', path: '/products' },
    { name: 'RFQ', path: '/contact' },
  ];

  return (
    <nav className={`navbar-container ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className="navbar-inner">
        <div className="navbar-content">
          {/* Logo - Premium Branding */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <span>S</span>
            </div>
            <span className="navbar-logo-text">
              SOUQNEST
            </span>
          </Link>

          {/* Desktop Menu - Clean Links */}
          <div className="navbar-menu-desktop">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="navbar-link"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="navbar-actions">
            <button className="navbar-icon-btn">
              <FiSearch size={20} />
            </button>
            <Link to="/products" className="navbar-icon-btn navbar-cart-btn">
              <FiShoppingBag size={20} />
            </Link>
            <Link to="/rfq">
              <button className="navbar-cta-btn">
                Contact Us
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="navbar-mobile-toggle">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="navbar-icon-btn"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Premium Dropdown */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-menu-inner">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="navbar-mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="navbar-mobile-cta">
              <Link
                to="/rfq"
                className="navbar-mobile-cta-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
