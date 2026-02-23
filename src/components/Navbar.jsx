import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiShoppingBag } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Suppliers', path: '/listings' },
    { name: 'Products', path: '/products' },
    { name: 'RFQ', path: '/contact' },
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        <div className="navbar-content">
          {/* Logo - Premium Branding */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <span>A</span>
            </div>
            <span className="navbar-logo-text">
              ADMN
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
                Quote
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
