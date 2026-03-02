import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Listings', to: '/listings' },
    { label: 'Products', to: '/products' },
    { label: 'Contact', to: '/contact' },
  ];

  const categories = [
    { label: 'Manufacturing', to: '/products' },
    { label: 'Electronics', to: '/products' },
    { label: 'Machinery', to: '/products' },
    { label: 'Construction', to: '/products' },
  ];

  const socialLinks = [
    { label: 'Facebook', href: '#', icon: <FiFacebook size={18} /> },
    { label: 'Twitter', href: '#', icon: <FiTwitter size={18} /> },
    { label: 'LinkedIn', href: '#', icon: <FiLinkedin size={18} /> },
    { label: 'Instagram', href: '#', icon: <FiInstagram size={18} /> },
  ];

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
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} onClick={scrollTop}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-categories">
            <h4>Categories</h4>
            <ul>
              {categories.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} onClick={scrollTop}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li><FiMail size={14} /> <span>info@admn.com</span></li>
              <li><FiPhone size={14} /> <span>+1 (555) 123-4567</span></li>
              <li><FiMapPin size={14} /> <span>123 Business St, City</span></li>
              <li><FiClock size={14} /> <span>Mon–Fri 9AM–6PM</span></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="footer-social-row">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} aria-label={social.label} title={social.label}>
                  {social.icon}
                </a>
              ))}
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
