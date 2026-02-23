import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiPackage,
  FiTag,
  FiLayers,
  FiList,
  FiHelpCircle,
  FiSend,
  FiExternalLink
} from 'react-icons/fi';
import { useProduct } from '../hooks/useProducts';
import './ProductModal.css';

const ProductModal = ({ productSlug, onClose }) => {
  const { data: product, isLoading, error } = useProduct(productSlug);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Get all images (main + gallery)
  const allImages = product ? [product.imageUrl, ...(product.images || [])].filter(Boolean) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Format price with currency symbol
  const formatPrice = (price) => {
    if (!price) return null;
    const symbol = price.currency === 'INR' ? '₹' : price.currency === 'SAR' ? 'ر.س' : '$';
    return `${symbol}${price.amount?.toLocaleString()}`;
  };

  // Get display price
  const getDisplayPrice = () => {
    if (!product?.prices || product.prices.length === 0) return null;
    return product.prices[0];
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiPackage },
    { id: 'features', label: 'Features', icon: FiList },
    { id: 'specs', label: 'Specifications', icon: FiLayers },
    { id: 'faqs', label: 'FAQs', icon: FiHelpCircle },
  ];

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="product-modal-close" onClick={onClose}>
          <FiX size={24} />
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="product-modal-loading">
            <div className="product-modal-spinner"></div>
            <p>Loading product details...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="product-modal-error">
            <p>Failed to load product details</p>
            <button onClick={onClose}>Close</button>
          </div>
        )}

        {/* Product Content */}
        {product && !isLoading && (
          <>
            {/* Header Section */}
            <div className="product-modal-header">
              {/* Image Gallery */}
              <div className="product-modal-gallery">
                <div className="product-modal-image-main">
                  {allImages.length > 0 ? (
                    <img 
                      src={allImages[currentImageIndex]} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="product-modal-no-image">
                      <FiPackage size={64} />
                      <span>No Image</span>
                    </div>
                  )}
                  
                  {allImages.length > 1 && (
                    <>
                      <button className="gallery-nav prev" onClick={prevImage}>
                        <FiChevronLeft size={24} />
                      </button>
                      <button className="gallery-nav next" onClick={nextImage}>
                        <FiChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {allImages.length > 1 && (
                  <div className="product-modal-thumbnails">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img src={img} alt={`${product.name} ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="product-modal-info">
                {/* Category & Industry Tags */}
                <div className="product-modal-tags">
                  {product.category && (
                    <span className="product-tag category">
                      <FiTag size={12} />
                      {product.category.name}
                    </span>
                  )}
                  {product.industries?.slice(0, 2).map((ind, idx) => (
                    <span key={idx} className="product-tag industry">
                      {ind.industry?.name || ind.name}
                    </span>
                  ))}
                </div>

                <h1 className="product-modal-title">{product.name}</h1>

                {/* Price */}
                {getDisplayPrice() && (
                  <div className="product-modal-price">
                    <span className="price-label">Starting from</span>
                    <span className="price-value">{formatPrice(getDisplayPrice())}</span>
                    {product.prices?.length > 1 && (
                      <span className="price-more">
                        +{product.prices.length - 1} more currencies
                      </span>
                    )}
                  </div>
                )}

                {/* All Prices */}
                {product.prices?.length > 0 && (
                  <div className="product-modal-all-prices">
                    {product.prices.map((price, idx) => (
                      <div key={idx} className="price-item">
                        <span className="price-currency">{price.currency}</span>
                        <span className="price-amount">{formatPrice(price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="product-modal-actions">
                  <Link to="/rfq" className="product-modal-btn primary">
                    <FiSend size={18} />
                    Request Quote
                  </Link>
                  <Link to={`/products/${product.slug}`} className="product-modal-btn secondary">
                    <FiExternalLink size={18} />
                    Full Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="product-modal-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`product-modal-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="product-modal-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="tab-content overview">
                  <p className="product-overview-text">
                    {product.overview || 'No overview available for this product.'}
                  </p>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="tab-content features">
                  {product.features?.length > 0 ? (
                    <ul className="features-list">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="feature-item">
                          <span className="feature-bullet"></span>
                          <span className="feature-text">{feature.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-tab">No features listed for this product.</p>
                  )}
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specs' && (
                <div className="tab-content specifications">
                  {product.specifications?.length > 0 ? (
                    <table className="specs-table">
                      <tbody>
                        {product.specifications.map((spec, idx) => (
                          <tr key={idx}>
                            <td className="spec-param">{spec.parameter}</td>
                            <td className="spec-value">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="empty-tab">No specifications available.</p>
                  )}
                </div>
              )}

              {/* FAQs Tab */}
              {activeTab === 'faqs' && (
                <div className="tab-content faqs">
                  {product.faqs?.length > 0 ? (
                    <div className="faqs-list">
                      {product.faqs.map((faq, idx) => (
                        <div key={idx} className="faq-item">
                          <h4 className="faq-question">{faq.question}</h4>
                          <p className="faq-answer">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-tab">No FAQs available for this product.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
