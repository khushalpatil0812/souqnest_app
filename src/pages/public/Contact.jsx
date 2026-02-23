import React, { useState, useRef } from 'react';
import { 
  FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle, 
  FiSend, FiBriefcase, FiMessageSquare, FiAlertCircle,
  FiX, FiChevronDown, FiHelpCircle, FiUpload
} from 'react-icons/fi';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { enquiryApi } from '../../services/api';
import './Contact.css';

const ENQUIRY_TYPES = [
  'General Inquiry',
  'Product Inquiry',
  'Partnership',
  'Pricing',
  'Support',
  'Complaint'
];

const INCOTERMS = [
  'FOB - Free On Board',
  'CIF - Cost Insurance Freight',
  'EXW - Ex Works',
  'DDP - Delivered Duty Paid'
];

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    country: '',
    city: '',
    enquiryType: 'General Inquiry',
    message: '',
  });

  const [attachments, setAttachments] = useState([]);
  const [lineItems, setLineItems] = useState([
    { description: '', category: '', model: '', quantity: 1, unit: 'SETS' },
    { description: '', category: '', model: '', quantity: 1, unit: 'SETS' }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const newFiles = files.filter(f => f.size <= 10 * 1024 * 1024).map(f => ({
      file: f,
      name: f.name,
      id: Math.random()
    }));
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setAttachments(prev => prev.filter(f => f.id !== id));
  };

  const addLineItem = () => {
    setLineItems(prev => [...prev, { description: '', category: '', model: '', quantity: 1, unit: 'SETS' }]);
  };

  const removeLineItem = (index) => {
    setLineItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const duplicateLineItem = (index) => {
    setLineItems(prev => [
      ...prev.slice(0, index + 1),
      { ...prev[index] },
      ...prev.slice(index + 1)
    ]);
  };

  const updateLineItem = (index, field, value) => {
    setLineItems(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('contactName', formData.contactName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('enquiryType', formData.enquiryType);
      formDataToSend.append('description', formData.message);
      formDataToSend.append('lineItems', JSON.stringify(lineItems));

      attachments.forEach(att => {
        formDataToSend.append('attachments', att.file);
      });

      await enquiryApi.submit(formDataToSend);
      setSubmitted(true);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        country: '',
        city: '',
        enquiryType: '',
        message: '',
      });
      setAttachments([]);
    } catch (err) {
      console.error('Contact submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      country: '',
      city: '',
      enquiryType: 'General Inquiry',
      message: '',
    });
    setLineItems([
      { description: '', category: '', model: '', quantity: 1, unit: 'SETS' },
      { description: '', category: '', model: '', quantity: 1, unit: 'SETS' }
    ]);
    setAttachments([]);
    setError(null);
  };

  const isFormValid = formData.companyName && formData.contactName && formData.email && formData.message.length >= 10 && lineItems.some(item => item.description && item.category);

  return (
    <div className="rfq-page">
      {/* Success Modal */}
      {submitted && (
        <div className="rfq-success-overlay" onClick={() => setSubmitted(false)}>
          <div className="rfq-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rfq-success-icon">
              <FiCheckCircle size={48} />
            </div>
            <h2>Message Sent Successfully!</h2>
            <p>Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.</p>
            <div className="rfq-success-actions">
              <button 
                className="rfq-submit-btn"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="rfq-page-header">
        <div className="rfq-title-block">
          <div className="rfq-title-icon">📄</div>
          <div>
            <h1 className="rfq-title">Request for Quotation (RFQ)</h1>
            <p className="rfq-subtitle">
              Please fill out this RFQ form and our team will get back to you with a quotation.
            </p>
          </div>
        </div>
        <div className="rfq-meta-badge">
          <div className="rfq-meta-item">
            <span className="rfq-meta-label">RESPONSE TIME</span>
            <span className="rfq-meta-value">24-48 HRS</span>
          </div>
          <div className="rfq-meta-divider" />
          <div className="rfq-meta-item">
            <span className="rfq-meta-label">SUPPORT</span>
            <span className="rfq-meta-value rfq-meta-blue">🌐 24/7</span>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="rfq-page">
        {error && (
          <div className="rfq-toast rfq-toast-error">
            <FiAlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <FiX size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* RFQ Details Row */}
          <div className="rfq-section">
            <div className="rfq-fulfillment-row">
              <div className="rfq-field-group">
                <label>COMPANY NAME *</label>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your Company"
                  required
                />
              </div>
              <div className="rfq-field-group">
                <label>CONTACT PERSON *</label>
                <input 
                  type="text" 
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="rfq-field-group">
                <label>EMAIL ADDRESS *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@company.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Type Row */}
          <div className="rfq-section">
            <div className="rfq-fulfillment-row">
              <div className="rfq-field-group">
                <label>COUNTRY</label>
                <input 
                  type="text" 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. UAE"
                />
              </div>
              <div className="rfq-field-group">
                <label>CITY</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Dubai"
                />
              </div>
              <div className="rfq-field-group">
                <label>INCOTERMS 2020</label>
                <select>
                  <option>FOB - Free On Board</option>
                  <option>CIF - Cost Insurance Freight</option>
                  <option>EXW - Ex Works</option>
                  <option>DDP - Delivered Duty Paid</option>
                </select>
              </div>
              <div className="rfq-info-tip">
                ℹ️ Logistics data helps sellers calculate accurate freight and duty costs.
              </div>
            </div>
          </div>

          {/* Line Item Specifications Table */}
          <div className="rfq-section">
            <div className="rfq-table-header">
              <h3>LINE ITEM SPECIFICATIONS</h3>
              <span className="rfq-table-tag">ENTERPRISE PROCUREMENT GRID</span>
            </div>

            <div className="rfq-table-wrapper">
              <table className="rfq-table">
                <thead>
                  <tr>
                    <th>SR. NO</th>
                    <th>ITEM DESCRIPTION *</th>
                    <th>CATEGORY *</th>
                    <th>MODEL / REF</th>
                    <th>QUANTITY / UNIT</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={index}>
                      <td className="rfq-sr-no">{index + 1}</td>
                      <td>
                        <input
                          placeholder="e.g. Submersible Water Pump"
                          value={item.description}
                          onChange={e => updateLineItem(index, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <select 
                          value={item.category} 
                          onChange={e => updateLineItem(index, 'category', e.target.value)}
                        >
                          <option>Select Category</option>
                          <option>Bearings & Transmission</option>
                          <option>Pumps & Motors</option>
                          <option>Valves & Fittings</option>
                          <option>Electrical Equipment</option>
                          <option>Sensors & Controls</option>
                        </select>
                      </td>
                      <td>
                        <input
                          placeholder="e.g. XP-500 Series"
                          value={item.model}
                          onChange={e => updateLineItem(index, 'model', e.target.value)}
                        />
                      </td>
                      <td className="rfq-qty-cell">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                        <select 
                          value={item.unit} 
                          onChange={e => updateLineItem(index, 'unit', e.target.value)}
                        >
                          <option>SETS</option>
                          <option>PCS</option>
                          <option>KG</option>
                          <option>MTR</option>
                          <option>UNITS</option>
                        </select>
                      </td>
                      <td className="rfq-action-cell">
                        <button 
                          type="button"
                          onClick={() => duplicateLineItem(index)} 
                          title="Duplicate"
                          className="rfq-action-btn"
                        >
                          ⧉
                        </button>
                        <button 
                          type="button"
                          onClick={() => removeLineItem(index)} 
                          title="Delete"
                          className="rfq-action-btn rfq-delete-btn"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              type="button" 
              className="rfq-add-btn" 
              onClick={addLineItem}
            >
              + ADD MORE ITEMS
            </button>
          </div>

          {/* Message + Attachments (Bottom Row) */}
          <div className="rfq-bottom-row">
            {/* Message */}
            <div className="rfq-section rfq-remarks">
              <div className="rfq-section-label">
                📄 YOUR MESSAGE
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your inquiry, feedback, or requirements..."
                rows={6}
                required
                minLength={10}
              />
              <span className="rfq-char-count">{formData.message.length} characters</span>
            </div>

            {/* Attachments */}
            <div className="rfq-section rfq-attachments">
              <div className="rfq-section-label">
                📎 ATTACHMENTS (Optional)
              </div>
              <div 
                className="rfq-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                  onChange={handleFileChange}
                />
                <div className="rfq-dropzone-icon">☁️</div>
                <p>DROP FILES HERE OR CLICK TO UPLOAD</p>
                <span>(PDF, DOC, JPG, XLS — MAX 10MB)</span>
              </div>
              {attachments.map((f, i) => (
                <div key={f.id} className="rfq-file-item">
                  📄 {f.name}
                  <button type="button" onClick={() => removeFile(f.id)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="rfq-footer">
            <button 
              type="button" 
              className="rfq-discard-btn" 
              onClick={handleDiscard}
            >
              DISCARD CHANGES
            </button>
            <button
              type="submit"
              className="rfq-submit-btn"
              disabled={submitting || !isFormValid}
            >
              {submitting ? (
                <>
                  <span className="rfq-btn-spinner"></span>
                  SUBMITTING...
                </>
              ) : (
                <>
                  SUBMIT INQUIRY ›
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
