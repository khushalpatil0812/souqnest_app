import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, FiAlertCircle, FiPlus, FiTrash2, FiShoppingCart, 
  FiSearch, FiUser, FiMail, FiPhone, FiGlobe, FiMessageSquare,
  FiPackage, FiSend, FiShield, FiClock, FiAward, FiChevronDown,
  FiX, FiCheck, FiInfo, FiBriefcase, FiLayers
} from 'react-icons/fi';
import { useCreateRFQ } from '../../hooks/useRFQs';
import { productApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import './RFQForm.css';

const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com'];

const RFQForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const formRef = useRef(null);
  
  const productFromShop = location.state?.product;
  const quantityFromShop = location.state?.quantity;
  const fromCart = location.state?.fromCart;

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  // Cart items
  const [cartItems, setCartItems] = useState([]);

  // Contact form
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    description: '',
    targetPrice: '',
    deliveryDate: '',
  });

  const createRFQMutation = useCreateRFQ();

  // Steps configuration
  const steps = [
    { id: 1, label: 'Products', icon: FiPackage },
    { id: 2, label: 'Company', icon: FiBriefcase },
    { id: 3, label: 'Review', icon: FiCheckCircle },
  ];

  // Load available products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll({ isActive: true });
        const allProducts = res.data || res || [];
        setProducts(allProducts.filter(p => p.isActive !== false));
      } catch (err) {
        // Silently handle product fetch error
      }
    };
    fetchProducts();
  }, []);

  // Pre-fill from product detail page
  useEffect(() => {
    if (productFromShop && !fromCart) {
      const existing = cartItems.find(item => item.productId === productFromShop.id);
      if (!existing) {
        setCartItems([{
          productId: productFromShop.id,
          productName: productFromShop.name,
          quantity: quantityFromShop || 1,
          imageUrl: productFromShop.imageUrl,
        }]);
      }
    }
  }, [productFromShop]);

  // Pre-fill from shopping cart
  useEffect(() => {
    if (fromCart && cart.length > 0) {
      const cartProducts = cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        price: item.prices?.[0]?.amount,
        currency: item.prices?.[0]?.currency,
      }));
      setCartItems(cartProducts);
      clearCart();
    }
  }, [fromCart]);

  // Filtered products for search dropdown
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
    !cartItems.some(item => item.productId === p.id)
  );

  // Email validation
  const validateEmail = (email) => {
    if (!email) return '';
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && BLOCKED_DOMAINS.includes(domain)) {
      return 'Corporate email required. Personal emails (Gmail, Yahoo, etc.) are not accepted.';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    setEmailError(validateEmail(email));
  };

  const handleAddProduct = (product) => {
    setCartItems(prev => [...prev, {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      imageUrl: product.imageUrl,
    }]);
    setProductSearch('');
    setShowProductDropdown(false);
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    setCartItems(prev => prev.map(item =>
      item.productId === productId ? { ...item, quantity: qty } : item
    ));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fieldErrors = {
    companyName: showValidation && !formData.companyName.trim() ? 'Company name is required.' : '',
    contactPerson: showValidation && !formData.contactPerson.trim() ? 'Contact person is required.' : '',
    email: showValidation && !formData.email.trim() ? 'Corporate email is required.' : emailError,
    phone: showValidation && !formData.phone.trim() ? 'Phone number is required.' : '',
  };

  const canProceedToStep2 = cartItems.length > 0;
  const canProceedToStep3 = formData.companyName && formData.contactPerson && formData.email && formData.phone && !emailError;

  const handleNextStep = () => {
    if (currentStep === 1 && canProceedToStep2) {
      setShowValidation(false);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2 && canProceedToStep3) {
      setShowValidation(false);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      setShowValidation(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null);

    if (cartItems.length === 0) {
      setCurrentStep(1);
      return;
    }

    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      setCurrentStep(2);
      return;
    }

    if (emailError) {
      setCurrentStep(2);
      return;
    }

    try {
      // Submit each cart item as a separate RFQ (backend spec expects single product per RFQ)
      const submitPromises = cartItems.map(item => {
        const dataToSend = {
          productName: item.productName,
          quantity: item.quantity,
          companyName: formData.companyName.trim(),
          contactPerson: formData.contactPerson.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          country: formData.country.trim() || undefined,
          description: formData.description.trim() || undefined,
          targetPrice: formData.targetPrice.trim() || undefined,
          deliveryDate: formData.deliveryDate || undefined,
        };
        return createRFQMutation.mutateAsync(dataToSend);
      });

      await Promise.all(submitPromises);
      setSubmissionStatus('success');
      setCartItems([]);
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        country: '',
        description: '',
        targetPrice: '',
        deliveryDate: '',
      });
      setCurrentStep(1);
    } catch (error) {
      setSubmissionStatus('error');
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.rfq-product-search-wrapper')) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="rfq-page">
      {/* Hero Header */}
      <div className="rfq-hero">
        <div className="rfq-hero-bg">
          <div className="rfq-hero-pattern"></div>
        </div>
        <div className="rfq-hero-content">
          <div className="rfq-hero-badge">
            <FiShield size={14} />
            <span>Secure & Verified</span>
          </div>
          <h1 className="rfq-hero-title">
            Request for <span>Quotation</span>
          </h1>
          <p className="rfq-hero-subtitle">
            Select products, provide your details, and receive competitive quotes from verified suppliers
          </p>
          <div className="rfq-hero-stats">
            <div className="rfq-hero-stat">
              <FiAward size={16} />
              <span>Best Price Guarantee</span>
            </div>
            <div className="rfq-hero-stat">
              <FiShield size={16} />
              <span>Verified Suppliers</span>
            </div>
          </div>
        </div>
      </div>
            
      {/* Main Content */}
      <div className="rfq-main">
        {/* Success Modal */}
        {submissionStatus === 'success' && (
          <div className="rfq-success-overlay">
            <div className="rfq-success-modal">
              <div className="rfq-success-icon">
                <FiCheckCircle size={48} />
              </div>
              <h2>RFQ Submitted Successfully!</h2>
              <p>Thank you for your request. Our team will review and respond within 24-48 business hours.</p>
              <div className="rfq-success-actions">
                <button 
                  className="rfq-btn rfq-btn-primary"
                  onClick={() => setSubmissionStatus(null)}
                >
                  Submit Another RFQ
                </button>
                <button 
                  className="rfq-btn rfq-btn-secondary"
                  onClick={() => navigate('/products')}
                >
                  Browse Products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {submissionStatus === 'error' && (
          <div className="rfq-toast rfq-toast-error">
            <FiAlertCircle size={20} />
            <span>Submission failed. Please check your details and try again.</span>
            <button onClick={() => setSubmissionStatus(null)}>
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* Progress Steps */}
        <div className="rfq-steps-container">
          <div className="rfq-steps">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`rfq-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-current={currentStep === step.id ? 'step' : undefined}
                  onClick={() => {
                    if (step.id < currentStep) setCurrentStep(step.id);
                    else if (step.id === 2 && canProceedToStep2) setCurrentStep(2);
                    else if (step.id === 3 && canProceedToStep3) setCurrentStep(3);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (step.id < currentStep) setCurrentStep(step.id);
                      else if (step.id === 2 && canProceedToStep2) setCurrentStep(2);
                      else if (step.id === 3 && canProceedToStep3) setCurrentStep(3);
                    }
                  }}
                >
                  <div className="rfq-step-indicator">
                    {currentStep > step.id ? <FiCheck size={16} /> : <step.icon size={16} />}
                  </div>
                  <span className="rfq-step-label">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`rfq-step-line ${currentStep > step.id ? 'completed' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <form ref={formRef} onSubmit={handleSubmit} className="rfq-form-container">
          {/* Step 1: Products */}
          <div className={`rfq-form-step ${currentStep === 1 ? 'active' : ''}`}>
            <div className="rfq-form-card">
              <div className="rfq-form-header">
                <div className="rfq-form-header-icon">
                  <FiPackage size={24} />
                </div>
                <div>
                  <h2>Select Products</h2>
                  <p>Search and add products you want to request quotes for</p>
                </div>
              </div>

              {/* Product Search */}
              <div className="rfq-product-search-wrapper">
                <div className="rfq-product-search">
                  <FiSearch className="rfq-search-icon" size={20} />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductDropdown(true);
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    placeholder="Search products by name..."
                  />
                  {productSearch && (
                    <button 
                      type="button" 
                      className="rfq-search-clear"
                      onClick={() => {
                        setProductSearch('');
                        setShowProductDropdown(false);
                      }}
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>

                {/* Search Dropdown */}
                {showProductDropdown && productSearch && (
                  <div className="rfq-product-dropdown">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.slice(0, 8).map(product => (
                        <button
                          key={product.id}
                          type="button"
                          className="rfq-product-option"
                          onClick={() => handleAddProduct(product)}
                        >
                          <div className="rfq-product-option-img">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" />
                            ) : (
                              <FiPackage size={20} />
                            )}
                          </div>
                          <div className="rfq-product-option-info">
                            <span className="rfq-product-option-name">{product.name}</span>
                            <span className="rfq-product-option-category">
                              {product.category?.name || 'Uncategorized'}
                            </span>
                          </div>
                          <FiPlus className="rfq-product-option-add" size={18} />
                        </button>
                      ))
                    ) : (
                      <div className="rfq-product-empty">
                        <FiSearch size={24} />
                        <span>No products found matching "{productSearch}"</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Items */}
              {cartItems.length > 0 ? (
                <div className="rfq-cart">
                  <div className="rfq-cart-header">
                    <span>{cartItems.length} Product{cartItems.length !== 1 ? 's' : ''} Selected</span>
                    <span className="rfq-cart-total">
                      Total Qty: {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  </div>
                  <div className="rfq-cart-items">
                    {cartItems.map((item, idx) => (
                      <div key={item.productId} className="rfq-cart-item">
                        <div className="rfq-cart-item-img">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.productName} loading="lazy" decoding="async" />
                          ) : (
                            <FiPackage size={20} />
                          )}
                        </div>
                        <div className="rfq-cart-item-info">
                          <span className="rfq-cart-item-name">{item.productName}</span>
                          <span className="rfq-cart-item-idx">Item #{idx + 1}</span>
                        </div>
                        <div className="rfq-cart-item-qty">
                          <button 
                            type="button"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                          />
                          <button 
                            type="button"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="rfq-cart-item-remove"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rfq-cart-empty">
                  <FiShoppingCart size={48} />
                  <h3>No products selected</h3>
                  <p>Search products above or browse our catalog to add items to your quote request</p>
                  <button 
                    type="button" 
                    className="rfq-btn rfq-btn-browse"
                    onClick={() => navigate('/products')}
                  >
                    <FiPackage size={18} />
                    Browse Products
                  </button>
                </div>
              )}

              {/* Step Actions */}
              <div className="rfq-form-actions rfq-form-actions-end">
                <button
                  type="button"
                  className="rfq-btn rfq-btn-primary"
                  disabled={!canProceedToStep2}
                  onClick={handleNextStep}
                >
                  Continue to Details
                  <FiChevronDown className="rfq-btn-icon-right rfq-btn-icon-next" />
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Company Details */}
          <div className={`rfq-form-step ${currentStep === 2 ? 'active' : ''}`}>
            <div className="rfq-form-card">
              <div className="rfq-form-header">
                <div className="rfq-form-header-icon">
                  <FiBriefcase size={24} />
                </div>
                <div>
                  <h2>Company Details</h2>
                  <p>Tell us about yourself and how to reach you</p>
                </div>
              </div>

              {/* Email Notice */}
              <div className="rfq-notice">
                <FiInfo size={18} />
                <span>Please use your corporate email address. Personal emails (Gmail, Yahoo, etc.) are not accepted for business inquiries.</span>
              </div>

              <div className="rfq-required-note" role="note" aria-live="polite">
                <span className="rfq-required-star" aria-hidden="true">*</span> Required fields
              </div>

              {showValidation && !canProceedToStep3 && (
                <div className="rfq-validation-summary" role="alert" aria-live="assertive">
                  <FiAlertCircle size={16} />
                  <span>Please complete all required fields with valid details to continue.</span>
                </div>
              )}

              <div className="rfq-form-grid" role="group" aria-label="Company and contact details">
                <div className={`rfq-field-group ${fieldErrors.companyName ? 'error' : ''}`}>
                  <label htmlFor="companyName" className="rfq-field-label">
                    Company Name <span className="rfq-required-star" aria-hidden="true">*</span>
                  </label>
                  <div className="rfq-input-wrap">
                    <FiBriefcase className="rfq-field-icon" size={18} />
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      autoComplete="organization"
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.companyName)}
                      aria-describedby={fieldErrors.companyName ? 'companyName-error' : undefined}
                    />
                  </div>
                  {fieldErrors.companyName && <span id="companyName-error" className="rfq-field-error">{fieldErrors.companyName}</span>}
                </div>

                <div className={`rfq-field-group ${fieldErrors.contactPerson ? 'error' : ''}`}>
                  <label htmlFor="contactPerson" className="rfq-field-label">
                    Contact Person <span className="rfq-required-star" aria-hidden="true">*</span>
                  </label>
                  <div className="rfq-input-wrap">
                    <FiUser className="rfq-field-icon" size={18} />
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.contactPerson)}
                      aria-describedby={fieldErrors.contactPerson ? 'contactPerson-error' : undefined}
                    />
                  </div>
                  {fieldErrors.contactPerson && <span id="contactPerson-error" className="rfq-field-error">{fieldErrors.contactPerson}</span>}
                </div>

                <div className={`rfq-field-group ${fieldErrors.email ? 'error' : ''}`}>
                  <label htmlFor="email" className="rfq-field-label">
                    Corporate Email <span className="rfq-required-star" aria-hidden="true">*</span>
                  </label>
                  <div className="rfq-input-wrap">
                    <FiMail className="rfq-field-icon" size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleEmailChange}
                      required
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {fieldErrors.email && <span id="email-error" className="rfq-field-error">{fieldErrors.email}</span>}
                </div>

                <div className={`rfq-field-group ${fieldErrors.phone ? 'error' : ''}`}>
                  <label htmlFor="phone" className="rfq-field-label">
                    Phone Number <span className="rfq-required-star" aria-hidden="true">*</span>
                  </label>
                  <div className="rfq-input-wrap">
                    <FiPhone className="rfq-field-icon" size={18} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                  {fieldErrors.phone && <span id="phone-error" className="rfq-field-error">{fieldErrors.phone}</span>}
                </div>

                <div className="rfq-field-group rfq-field-full">
                  <label htmlFor="country" className="rfq-field-label">Country / Region</label>
                  <div className="rfq-input-wrap">
                    <FiGlobe className="rfq-field-icon" size={18} />
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      autoComplete="country-name"
                    />
                  </div>
                </div>

                <div className="rfq-field-group rfq-field-full rfq-field-textarea">
                  <label htmlFor="description" className="rfq-field-label">Additional Details / Description</label>
                  <div className="rfq-input-wrap">
                    <FiMessageSquare className="rfq-field-icon" size={18} />
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Any additional requirements or specifications..."
                    ></textarea>
                  </div>
                </div>

                <div className="rfq-field-group">
                  <label htmlFor="targetPrice" className="rfq-field-label">Target Price (Optional)</label>
                  <div className="rfq-input-wrap">
                    <FiGlobe className="rfq-field-icon" size={18} />
                    <input
                      type="text"
                      id="targetPrice"
                      name="targetPrice"
                      value={formData.targetPrice}
                      onChange={handleChange}
                      placeholder="e.g. $100"
                    />
                  </div>
                </div>

                <div className="rfq-field-group">
                  <label htmlFor="deliveryDate" className="rfq-field-label">Required Delivery Date (Optional)</label>
                  <div className="rfq-input-wrap">
                    <FiClock className="rfq-field-icon" size={18} />
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Step Actions */}
              <div className="rfq-form-actions">
                <button
                  type="button"
                  className="rfq-btn rfq-btn-secondary"
                  onClick={handlePrevStep}
                >
                  <FiChevronDown className="rfq-btn-icon-left rfq-btn-icon-prev" />
                  Back
                </button>
                <button
                  type="button"
                  className="rfq-btn rfq-btn-primary"
                  disabled={!canProceedToStep3}
                  onClick={handleNextStep}
                >
                  Review & Submit
                  <FiChevronDown className="rfq-btn-icon-right rfq-btn-icon-next" />
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Review */}
          <div className={`rfq-form-step ${currentStep === 3 ? 'active' : ''}`}>
            <div className="rfq-form-card">
              <div className="rfq-form-header">
                <div className="rfq-form-header-icon">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h2>Review Your Request</h2>
                  <p>Please verify all details before submission</p>
                </div>
              </div>

              {/* Review Summary */}
              <div className="rfq-review">
                {/* Products Summary */}
                <div className="rfq-review-section">
                  <div className="rfq-review-section-header">
                    <FiPackage size={18} />
                    <span>Products ({cartItems.length})</span>
                    <button type="button" onClick={() => setCurrentStep(1)}>Edit</button>
                  </div>
                  <div className="rfq-review-products">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="rfq-review-product">
                        <span className="rfq-review-product-name">{item.productName}</span>
                        <span className="rfq-review-product-qty">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Summary */}
                <div className="rfq-review-section">
                  <div className="rfq-review-section-header">
                    <FiBriefcase size={18} />
                    <span>Contact Information</span>
                    <button type="button" onClick={() => setCurrentStep(2)}>Edit</button>
                  </div>
                  <div className="rfq-review-details">
                    <div className="rfq-review-detail">
                      <span>Company</span>
                      <strong>{formData.companyName}</strong>
                    </div>
                    <div className="rfq-review-detail">
                      <span>Contact</span>
                      <strong>{formData.contactPerson}</strong>
                    </div>
                    <div className="rfq-review-detail">
                      <span>Email</span>
                      <strong>{formData.email}</strong>
                    </div>
                    <div className="rfq-review-detail">
                      <span>Phone</span>
                      <strong>{formData.phone}</strong>
                    </div>
                    {formData.country && (
                      <div className="rfq-review-detail">
                        <span>Country</span>
                        <strong>{formData.country}</strong>
                      </div>
                    )}
                    {formData.description && (
                      <div className="rfq-review-detail rfq-review-detail-full">
                        <span>Description</span>
                        <strong>{formData.description}</strong>
                      </div>
                    )}
                    {formData.targetPrice && (
                      <div className="rfq-review-detail">
                        <span>Target Price</span>
                        <strong>{formData.targetPrice}</strong>
                      </div>
                    )}
                    {formData.deliveryDate && (
                      <div className="rfq-review-detail">
                        <span>Delivery Date</span>
                        <strong>{formData.deliveryDate}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="rfq-terms">
                By submitting this request, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>. 
                We'll contact you within 24-48 business hours.
              </p>

              {/* Step Actions */}
              <div className="rfq-form-actions">
                <button
                  type="button"
                  className="rfq-btn rfq-btn-secondary"
                  onClick={handlePrevStep}
                >
                  <FiChevronDown className="rfq-btn-icon-left rfq-btn-icon-prev" />
                  Back
                </button>
                <button
                  type="submit"
                  className="rfq-btn rfq-btn-submit"
                  disabled={createRFQMutation.isPending}
                >
                  {createRFQMutation.isPending ? (
                    <>
                      <span className="rfq-btn-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend size={18} />
                      Submit RFQ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Trust Badges */}
        <div className="rfq-trust">
          <div className="rfq-trust-item">
            <FiShield size={20} />
            <span>SSL Secured</span>
          </div>
          <div className="rfq-trust-item">
            <FiAward size={20} />
            <span>Verified Suppliers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQForm;
