import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUsers, FiGlobe, FiTrendingUp, FiAward, FiArrowRight, FiArrowLeft, FiCheck, FiSearch, FiMapPin, FiPackage, FiExternalLink, FiShield, FiZap, FiLayers, FiStar } from 'react-icons/fi';
import { useCategories } from '../../hooks/useCategories';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useProducts } from '../../hooks/useProducts';
import { useSupplierEnrichment } from '../../hooks/useSupplierEnrichment';
import ProductModal from '../../components/ProductModal';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductSlug, setSelectedProductSlug] = useState(null);
  const suppliersScrollRef = useRef(null);
  
  // Navbar scroll shrink effect
  useEffect(() => {
    const nav = document.querySelector('nav');
    const navInner = document.querySelector('.nav-inner');
    if (!nav && !navInner) return undefined;

    let ticking = false;

    const updateNav = () => {
      const isCompact = window.scrollY > 50;
      if (nav) {
        nav.style.height = isCompact ? '56px' : '68px';
        nav.style.transition = 'all 0.3s ease';
      }
      if (navInner) {
        navInner.style.height = isCompact ? '56px' : '68px';
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateNav();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fetch real data using React Query hooks
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  // Use custom hook to enrich suppliers with industries (consolidated from both Home & Listings)
  const { suppliers: suppliersSource = [] } = useSupplierEnrichment(suppliers);

  // Get featured products (limit to 6 for homepage) - only active products
  const featuredProducts = useMemo(
    () => products.filter((p) => p.isActive !== false).slice(0, 6),
    [products]
  );
  
  // Get featured suppliers (limit to 3 for homepage)
  const featuredSuppliers = useMemo(
    () => suppliersSource.filter((supplier) => supplier.isFeatured).slice(0, 3),
    [suppliersSource]
  );

  const scrollSuppliers = (direction) => {
    const scrollAmount = 300;
    if (suppliersScrollRef.current) {
      suppliersScrollRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const renderSuppliersCarousel = (list, useExternalLinks) => (
    <div className="suppliers-carousel">
      <button
        type="button"
        className="suppliers-scroll-btn suppliers-scroll-btn-left"
        onClick={() => scrollSuppliers(-1)}
        aria-label="Scroll suppliers left"
      >
        <FiArrowLeft size={16} />
      </button>
      <div className="suppliers-scroll" ref={suppliersScrollRef}>
        {list.map((supplier) => (
          <div key={supplier.id} className="supplier-card">
            <div className="supplier-avatar-wrapper">
              <div className="supplier-avatar orange-avatar">
                {supplier.logoUrl || supplier.logo ? (
                  <img
                    src={supplier.logoUrl || supplier.logo}
                    alt={supplier.companyName || supplier.name}
                    className="supplier-logo"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  (supplier.companyName || supplier.name || 'S').charAt(0).toUpperCase()
                )}
              </div>
              {supplier.isVerified && (
                <div className="supplier-verified-check">
                  <FiCheck size={10} />
                </div>
              )}
            </div>

              {supplier.isAuthorizedPartner && (
              <div className="supplier-verified-badge authorized-blue">
                <FiShield size={16} style={{ color: '#18181B', marginRight: 4 }} />
                <span style={{ color: '#2563EB' }}>Authorized Partner</span>
              </div>
            )}

            {useExternalLinks && supplier.website ? (
              <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="supplier-name-link">
                <h3 className="supplier-name">
                  {supplier.companyName || supplier.name}
                  <FiExternalLink size={12} className="external-link-icon" />
                </h3>
              </a>
            ) : (
              <h3 className="supplier-name">
                {supplier.companyName || supplier.name}
              </h3>
            )}

            <div className="supplier-location">
              <FiMapPin size={12} />
              {supplier.location || supplier.address || 'Global'}
            </div>

            {/* Star Rating and Reviews */}
            {supplier.rating && (
              <div className="supplier-rating-section">
                <div className="supplier-stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className={i < Math.floor(supplier.rating) ? 'star-filled' : (i < supplier.rating ? 'star-half' : 'star-empty')}
                    />
                  ))}
                  <span className="supplier-rating-value">{supplier.rating}</span>
                </div>
                {supplier.reviewCount && (
                  <span className="supplier-review-count">({supplier.reviewCount} reviews)</span>
                )}
              </div>
            )}

            <p className="supplier-desc">
              {(supplier.description || supplier.businessDescription || 'Verified supplier with quality products and competitive pricing.').slice(0, 100)}...
            </p>

            <div className="supplier-tags">
              {supplier.type && (
                <span className="supplier-tag">{supplier.type}</span>
              )}
              {supplier.isFeatured && (
                <span className="supplier-tag featured">Featured</span>
              )}
              {supplier.industries && supplier.industries.length > 0 &&
                supplier.industries.slice(0, 2).map((ind, idx) => {
                  const name =
                    ind.industry?.name ||
                    ind.name ||
                    (typeof ind === 'string' ? ind : 'Industry');
                  const key = ind.id || ind.industryId || idx;
                  return (
                    <span key={key} className="supplier-tag">
                      {name}
                    </span>
                  );
                })}
            </div>

            {/* Reviews removed as requested */}

            <Link to="/listings" className="supplier-card-hover-btn">
              View Profile <FiArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="suppliers-scroll-btn suppliers-scroll-btn-right"
        onClick={() => scrollSuppliers(1)}
        aria-label="Scroll suppliers right"
      >
        <FiArrowRight size={16} />
      </button>
    </div>
  );

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleOpenProductView = (slug) => {
    setSelectedProductSlug(slug);
  };

  const handleCloseProductView = () => {
    setSelectedProductSlug(null);
  };

  // Get category icon (fallback for categories without icons)
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Manufacturing': '🏭',
      'Electronics': '💻', 
      'Chemicals': '⚗️',
      'Textiles': '🧵',
      'Machinery': '⚙️',
      'Automotive': '🚗',
      'Food & Beverage': '🍽️',
      'Construction': '🏗️',
    };
    return category.icon || iconMap[category.name] || '🏢';
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero section">
        <div className="container">
        {/* Aurora background effects */}
        <div className="hero-aurora-2"></div>
        <div className="hero-aurora-3"></div>
        
        {/* Floating particles */}
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
        <div className="particle p4"></div>
        <div className="particle p5"></div>
        <div className="particle p6"></div>

        {/* Floating decorative orbs */}
        <div className="hero-orb-rotator">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>

        {/* Floating KPI Cards (Hero) */}
        <div className="floating-card fc-left fade-up-delay-1">
          <div className="icon-wrapper">📈</div>
          <div className="card-label">Revenue Growth</div>
          <div className="card-value">+45.2%</div>
          <div className="card-badge">This Month</div>
          <div className="checkmark">✓</div>
        </div>

        <div className="floating-card fc-right-top fade-up-delay-2">
          <div className="icon-wrapper">📦</div>
          <div className="card-label">Total Orders</div>
          <div className="card-value">2,847</div>
          <div className="card-badge">Active</div>
          <div className="checkmark">✓</div>
        </div>

        <div className="floating-card fc-right-bottom fade-up-delay-3">
          <div className="icon-wrapper">👥</div>
          <div className="card-label">Active Users</div>
          <div className="card-value">12.5K+</div>
          <div className="card-badge">Online</div>
          <div className="checkmark">✓</div>
        </div>

        <div className="hero-content">
          {/* Badge */}
          <div className="hero-eyebrow fade-up">
            <FiShield size={14} />
            Trusted B2B Procurement Platform
          </div>

          <h1 className="hero-headline fade-up fade-up-delay-1">
            Procure <span className="text-accent-blue">Smarter.</span> Scale <span className="text-accent-orange">Faster.</span>
          </h1>
          
          <p className="hero-subheadline fade-up fade-up-delay-2">
            Connect with verified suppliers worldwide. Get competitive pricing.
          </p>

          {/* Search Bar */}
          <div className="hero-search-row fade-up fade-up-delay-3">
            <form onSubmit={handleSearch} className="hero-search">
              <FiSearch size={20} className="hero-search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search suppliers, products, or categories..."
              />
              <button type="submit">
                Search
              </button>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta-row fade-up fade-up-delay-4">
            <Link to="/listings">
              <button className="btn-primary">
                <FiLayers size={16} />
                Browse Suppliers
              </button>
            </Link>
            <Link to="/rfq">
              <button className="btn-outline">
                <FiZap size={16} />
                Get Quote
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hero-trust fade-up fade-up-delay-4">
            <div className="hero-trust-item">
              <FiShield size={14} />
              <span>Verified Suppliers</span>
            </div>
            <div className="hero-trust-divider"></div>
            <div className="hero-trust-item">
              <FiCheck size={14} />
              <span>Quality Assured</span>
            </div>
            <div className="hero-trust-divider"></div>
            <div className="hero-trust-item">
              <FiGlobe size={14} />
              <span>Global Reach</span>
            </div>
          </div>
        </div>

        {/* Floating Visitors Card (right middle of hero) */}
        <div className="hero-visitor-card">
          <div className="hero-visitor-header">
            <span className="hero-visitor-icon"><FiUsers size={16} /></span>
            <span className="hero-visitor-label">Total Visitors</span>
          </div>
          <div className="hero-visitor-value">24.3K</div>
          <div className="hero-visitor-trend">
            <FiTrendingUp size={14} />
            <span>+18% this month</span>
          </div>
        </div>

        {/* Floating Sales Growth chip (bottom-left hero) */}
        <div className="hero-sales-card">
          <div className="hero-sales-icon">
            <FiTrendingUp size={14} />
          </div>
          <div className="hero-sales-text">
            <span className="hero-sales-label">Sales Growth</span>
            <span className="hero-sales-value">+32.4%</span>
          </div>
        </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="category-section section home-section-block">
        <div className="container home-section-container">
          <div className="category-section-header">
            <div className="section-label">EXPLORE BY INDUSTRY</div>
            <h2 className="section-title">Diverse Industries & Sectors</h2>
            <p className="section-subtitle">Discover suppliers across every major sector — from manufacturing to tech.</p>
          </div>

          {categoriesLoading && (
            <div className="categories-static-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="category-card category-card-static skeleton"></div>
              ))}
            </div>
          )}

          {!categoriesLoading && categories.length > 0 && (
            <div className="categories-static-grid">
              {categories.slice(0, 6).map((category) => (
                <Link key={category.id} to={`/listings?category=${category.id}`} className="category-link">
                  <div className="category-card category-card-static category-card-centered">
                    <div className="category-icon">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="category-name">{category.name}</div>
                    {category.supplierCount && (
                      <div className="category-count">{category.supplierCount} suppliers</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!categoriesLoading && categories.length > 0 && (
            <div className="categories-see-all-wrapper">
              <Link to="/listings">
                <button className="btn-see-all-categories">
                  See All Categories
                  <FiArrowRight size={16} />
                </button>
              </Link>
            </div>
          )}

          {!categoriesLoading && categories.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🏢</div>
              <h3 className="empty-state-title">No Categories Yet</h3>
              <p className="empty-state-desc">Categories are being updated. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Suppliers Section */}
      <section className="suppliers-section section home-section-block">
        <div className="container home-section-container">
          <div className="category-section-header">
            <div className="section-label">FEATURED SUPPLIERS</div>
            <h2 className="section-title">Top-Rated, Verified Businesses</h2>
            <p className="section-subtitle">Handpicked partners with proven track records and quality assurance.</p>
          </div>

          {suppliersLoading && (
            <div className="suppliers-carousel">
              <div className="suppliers-scroll">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="supplier-card skeleton"></div>
                ))}
              </div>
            </div>
          )}

          {!suppliersLoading && featuredSuppliers.length > 0 && renderSuppliersCarousel(featuredSuppliers, false)}

          {!suppliersLoading && featuredSuppliers.length === 0 && suppliers.length > 0 && (
            renderSuppliersCarousel(suppliersSource.slice(0, 3), true)
          )}

          {!suppliersLoading && suppliers.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🏢</div>
              <h3 className="empty-state-title">No Suppliers Available</h3>
              <p className="empty-state-desc">Our supplier network is being updated. Please check back soon.</p>
              <Link to="/contact">
                <button className="btn-primary">Become Our First Partner</button>
              </Link>
            </div>
          )}

          {!suppliersLoading && suppliers.length > 3 && (
            <div className="section-cta-center">
              <Link to="/listings">
                <button className="btn-secondary">
                  View All {suppliers.length} Suppliers <FiArrowRight size={16} />
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="featured-products-section section home-section-block">
        <div className="container home-section-container">
          <div className="category-section-header">
            <div className="section-label">FEATURED PRODUCTS</div>
            <h2 className="section-title">Curated High-Demand Products</h2>
            <p className="section-subtitle">Explore top products from trusted suppliers, selected for quality and relevance.</p>
          </div>

          {productsLoading && (
            <div className="home-featured-products-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="home-product-card skeleton"></div>
              ))}
            </div>
          )}

          {!productsLoading && featuredProducts.length > 0 && (
            <div className="home-featured-products-grid">
              {featuredProducts.map((product) => (
                <article
                  key={product.id}
                  className="home-product-card home-product-link"
                  onClick={() => handleOpenProductView(product.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenProductView(product.slug);
                    }
                  }}
                >
                    <div className="home-product-image-wrap">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="home-product-image" loading="lazy" decoding="async" />
                      ) : (
                        <div className="home-product-image home-product-image-fallback">
                          <FiPackage size={24} />
                        </div>
                      )}
                    </div>
                    <div className="home-product-content">
                      <p className="home-product-category">{product.category?.name || 'General'}</p>
                      <h3 className="home-product-name">{product.name}</h3>
                      <p className="home-product-overview">
                        {(product.overview || 'Quality product from verified supplier.').slice(0, 95)}
                        {(product.overview || '').length > 95 ? '...' : ''}
                      </p>
                      <div className="home-product-cta">
                        <span>Quick View</span>
                        <FiArrowRight size={14} />
                      </div>
                    </div>
                  </article>
              ))}
            </div>
          )}

          {!productsLoading && featuredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No Featured Products Yet</h3>
              <p className="empty-state-desc">Products are being updated. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner section home-section-block">
        <div className="container home-section-container">
          <div className="cta-banner-inner">
            <div className="cta-banner-orb cta-orb-1"></div>
            <div className="cta-banner-orb cta-orb-2"></div>
            <div className="cta-banner-content">
              <div className="cta-badge">
                <FiZap size={14} />
                Ready to get started?
              </div>
              <h2 className="cta-banner-title">
                Start Procuring Better, Today.
              </h2>
              <p className="cta-banner-sub">
                Join hundreds of businesses already sourcing smarter with ADMN.
              </p>
              <div className="cta-banner-buttons">
                <Link to="/contact">
                  <button className="btn-primary btn-lg">
                    Contact Us <FiArrowRight size={16} />
                  </button>
                </Link>
                <Link to="/rfq">
                  <button className="btn-primary btn-lg">
                    Submit RFQ
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProductSlug && (
        <ProductModal productSlug={selectedProductSlug} onClose={handleCloseProductView} />
      )}
    </div>
  );
};

export default Home;