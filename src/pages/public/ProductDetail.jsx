import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiShoppingCart,
  FiSend,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiPackage,
  FiTag,
  FiList,
  FiLayers,
  FiHelpCircle,
  FiX
} from 'react-icons/fi';
import { useProducts, useProduct } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [showImageModal, setShowImageModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product data
  const { data: product, isLoading, error } = useProduct(id);
  const { data: relatedProducts = [] } = useProducts({
    categoryId: product?.category?.id,
    limit: 4,
    exclude: id
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-loading">
          <div className="product-detail-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-error">
          <div className="error-icon">📦</div>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/products')} className="error-btn">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Product images
  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  
  // Get price
  const formatPrice = (prices) => {
    if (!prices || prices.length === 0) return null;
    const price = prices[0];
    const symbol = price.currency === 'INR' ? '₹' : price.currency === 'SAR' ? 'ر.س' : '$';
    return { symbol, amount: price.amount?.toLocaleString(), currency: price.currency };
  };

  const priceInfo = formatPrice(product.prices);

  // Handle add to cart
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        price: product.prices?.[0]?.amount || 0,
        currency: product.prices?.[0]?.currency || 'INR',
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Image navigation
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiPackage },
    { id: 'features', label: 'Features', icon: FiList },
    { id: 'specs', label: 'Specifications', icon: FiLayers },
    { id: 'faqs', label: 'FAQs', icon: FiHelpCircle },
  ];

  return (
    <div className="product-detail-page">
      {/* Hero Section with Breadcrumb */}
      <section className="product-detail-hero">
        <div className="product-detail-hero-content">
          <nav className="product-detail-breadcrumb">
            <Link to="/">Home</Link> / 
            <Link to="/products">Products</Link> / 
            {product.category && (
              <><Link to={`/products?categoryId=${product.category.id}`}>{product.category.name}</Link> / </>
            )}
            <span>{product.name}</span>
          </nav>
          
          <button onClick={() => navigate(-1)} className="product-detail-back-btn">
            <FiArrowLeft size={18} />
            Back to Products
          </button>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="product-detail-main">
        <div className="product-detail-container">
          <div className="product-detail-grid">
            {/* Image Gallery */}
            <div className="product-detail-gallery">
              <div className="product-detail-main-image" onClick={() => setShowImageModal(true)}>
                {allImages.length > 0 ? (
                  <img 
                    src={allImages[selectedImageIndex]} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="product-detail-no-image">
                    <FiPackage size={80} />
                    <span>No Image Available</span>
                  </div>
                )}
                
                {allImages.length > 1 && (
                  <>
                    <button className="gallery-nav-btn prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                      <FiChevronLeft size={24} />
                    </button>
                    <button className="gallery-nav-btn next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                      <FiChevronRight size={24} />
                    </button>
                  </>
                )}
                
                <div className="image-counter">
                  {selectedImageIndex + 1} / {allImages.length || 1}
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="product-detail-thumbnails">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumbnail-btn ${idx === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-detail-info">
              {/* Tags */}
              <div className="product-detail-tags">
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

              {/* Title */}
              <h1 className="product-detail-title">{product.name}</h1>

              {/* Price Section */}
              {priceInfo && (
                <div className="product-detail-price-section">
                  <div className="product-detail-price">
                    <span className="price-label">Price</span>
                    <span className="price-value">{priceInfo.symbol}{priceInfo.amount}</span>
                  </div>
                  
                  {product.prices?.length > 1 && (
                    <div className="product-detail-all-prices">
                      <span className="price-heading">Available in:</span>
                      <div className="price-list">
                        {product.prices.map((price, idx) => (
                          <div key={idx} className="price-item">
                            <span className="price-currency">{price.currency}</span>
                            <span className="price-amount">
                              {price.currency === 'INR' ? '₹' : price.currency === 'SAR' ? 'ر.س' : '$'}
                              {price.amount?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="product-detail-quantity">
                <label className="quantity-label">Quantity</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="quantity-input"
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-detail-actions">
                <button 
                  className={`product-action-btn add-to-cart ${addedToCart ? 'added' : ''}`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <FiCheck size={20} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <FiShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
                <Link to="/rfq" state={{ product, quantity }} className="product-action-btn request-quote">
                  <FiSend size={20} />
                  Request Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="product-detail-tabs-section">
        <div className="product-detail-container">
          {/* Tab Navigation */}
          <div className="product-detail-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`product-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="product-detail-tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-panel overview">
                <h2>Product Overview</h2>
                <p>{product.overview || product.description || 'No overview available for this product.'}</p>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="tab-panel features">
                <h2>Key Features</h2>
                {product.features?.length > 0 ? (
                  <ul className="features-list">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="feature-item">
                        <span className="feature-bullet"></span>
                        <div className="feature-content">
                          <span className="feature-title">{feature.title || feature.feature}</span>
                          {feature.description && (
                            <span className="feature-desc">{feature.description}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-content">No features listed for this product.</p>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="tab-panel specs">
                <h2>Specifications</h2>
                {product.specifications?.length > 0 ? (
                  <table className="specs-table">
                    <tbody>
                      {product.specifications.map((spec, idx) => (
                        <tr key={idx}>
                          <td className="spec-param">{spec.parameter || spec.key}</td>
                          <td className="spec-value">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty-content">No specifications available.</p>
                )}
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="tab-panel faqs">
                <h2>Frequently Asked Questions</h2>
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
                  <p className="empty-content">No FAQs available for this product.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="product-detail-related">
          <div className="product-detail-container">
            <h2 className="related-title">Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  to={`/products/${relatedProduct.slug || relatedProduct.id}`}
                  className="related-product-card"
                >
                  <div className="related-product-image">
                    {relatedProduct.imageUrl ? (
                      <img src={relatedProduct.imageUrl} alt={relatedProduct.name} />
                    ) : (
                      <div className="related-no-image">
                        <FiPackage size={32} />
                      </div>
                    )}
                  </div>
                  <div className="related-product-info">
                    {relatedProduct.category && (
                      <span className="related-category">{relatedProduct.category.name}</span>
                    )}
                    <h4 className="related-name">{relatedProduct.name}</h4>
                    {relatedProduct.prices?.[0] && (
                      <span className="related-price">
                        {relatedProduct.prices[0].currency === 'INR' ? '₹' : 
                         relatedProduct.prices[0].currency === 'SAR' ? 'ر.س' : '$'}
                        {relatedProduct.prices[0].amount?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="product-image-modal" onClick={() => setShowImageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowImageModal(false)}>
              <FiX size={24} />
            </button>
            
            {allImages.length > 0 && (
              <img 
                src={allImages[selectedImageIndex]} 
                alt={product.name}
                className="modal-image"
              />
            )}
            
            {allImages.length > 1 && (
              <>
                <button className="modal-nav prev" onClick={prevImage}>
                  <FiChevronLeft size={32} />
                </button>
                <button className="modal-nav next" onClick={nextImage}>
                  <FiChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
