import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">A</span>
              <span className="footer-logo-text">ADMN</span>
            </Link>
            <p className="footer-desc">
              ADMN connects businesses with verified suppliers worldwide.<br />
              Your trusted B2B procurement platform.
            </p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/listings">Listings</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li>Email: info@admn.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Business St, City</li>
              <li>Hours: Mon-Fri 9AM-6PM</li>
            </ul>
          </div>
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="footer-social-row">
              <a href="#" aria-label="Facebook"><FiFacebook size={20} /></a>
              <a href="#" aria-label="Twitter"><FiTwitter size={20} /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin size={20} /></a>
              <a href="#" aria-label="Instagram"><FiInstagram size={20} /></a>
            </div>
            <div className="footer-cta-btns">
              <Link to="/rfq" className="footer-cta-btn">Get Quote</Link>
              <Link to="/contact" className="footer-cta-btn footer-cta-outline">Contact Us</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} ADMN. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
