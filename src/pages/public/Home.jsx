import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUsers, FiGlobe, FiTrendingUp, FiAward, FiArrowRight, FiArrowLeft, FiCheck, FiShoppingCart, FiSearch, FiMapPin, FiStar, FiPackage, FiExternalLink, FiShield, FiZap, FiLayers } from 'react-icons/fi';
import { useCategories } from '../../hooks/useCategories';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useProducts } from '../../hooks/useProducts';
import { useIndustries } from '../../hooks/useIndustries';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const suppliersScrollRef = useRef(null);
  
  // Navbar scroll shrink effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.style.height = '56px';
        nav.style.transition = 'all 0.3s ease';
      } else {
        nav.style.height = '68px';
      }
      const navInner = document.querySelector('.nav-inner');
      if (navInner) {
        navInner.style.height = window.scrollY > 50 ? '56px' : '68px';
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch real data using React Query hooks
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: industries = [], isLoading: industriesLoading } = useIndustries();

  // Get featured products (limit to 6 for homepage)
  const featuredProducts = products.slice(0, 6);
  
  // Get featured industries (limit to 4 for homepage)
  const featuredIndustries = industries.slice(0, 4);

  // Get featured suppliers (limit to 3 for homepage)
  const featuredSuppliers = suppliers
    .filter(supplier => supplier.isFeatured)
    .slice(0, 3);

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
                {(supplier.companyName || supplier.name || 'S').charAt(0).toUpperCase()}
              </div>
              {supplier.isVerified && (
                <div className="supplier-verified-check">
                  <FiCheck size={10} />
                </div>
              )}
            </div>

            {supplier.isVerified && (
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

  // Dynamic stats based on real data
  const stats = [
    { number: `${suppliers.length}+`, label: 'Verified Suppliers', icon: <FiUsers size={28} />, highlight: true },
    { number: '5+', label: 'Countries', icon: <FiGlobe size={28} /> },
    { number: '10k+', label: 'Products', icon: <FiTrendingUp size={28} /> },
    { number: '100%', label: 'Verified', icon: <FiAward size={28} /> },
  ];

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchTerm.trim())}`);
    }
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

        {/* Floating cards removed as requested */}

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
          <form onSubmit={handleSearch} className="hero-search fade-up fade-up-delay-3">
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
        </div>
      </section>

      {/* Categories Section */}
      <section className="category-section section">
        <div className="container">
        <div className="category-section-header">
          <div className="section-label">EXPLORE BY INDUSTRY</div>
          <h2 className="section-title">Diverse Industries & Sectors</h2>
          <p className="section-subtitle">Discover suppliers across every major sector — from manufacturing to tech.</p>
        </div>
        
        {/* Loading State */}
        {categoriesLoading && (
          <div className="marquee-wrapper">
            <div className="marquee-row marquee-row-1">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="category-card skeleton" style={{ minWidth: '200px', height: '60px' }}></div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Static Grid */}
        {!categoriesLoading && categories.length > 0 && (
          <div className="categories-static-grid">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} to={`/listings?category=${category.id}`}>
                <div className="category-card category-card-static">
                  <div className="category-icon">
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <div className="category-name">{category.name}</div>
                    {category.supplierCount && (
                      <div className="category-count">{category.supplierCount} suppliers</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* See All Categories Button */}
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

        {/* Empty State */}
        {!categoriesLoading && categories.length === 0 && (
          <div className="text-center" style={{ padding: '60px 0', color: '#94A3B8' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏢</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>
              No Categories Yet
            </h3>
            <p style={{ fontSize: '16px', color: '#475569' }}>
              Categories are being updated. Please check back soon.
            </p>
          </div>
        )}
        </div>
      </section>

      {/* Featured Suppliers Section */}
      <section className="suppliers-section section">
        <div className="container">
        <div className="category-section-header">
          <div className="section-label">FEATURED SUPPLIERS</div>
          <h2 className="section-title">Top-Rated, Verified Businesses</h2>
          <p className="section-subtitle">Handpicked partners with proven track records and quality assurance.</p>
        </div>

        {/* Loading State */}
        {suppliersLoading && (
          <div className="suppliers-carousel">
            <div className="suppliers-scroll">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="supplier-card skeleton" style={{ minHeight: '220px' }}></div>
              ))}
            </div>
          </div>
        )}

        {/* Suppliers Carousel */}
        {!suppliersLoading && featuredSuppliers.length > 0 && (
          renderSuppliersCarousel(featuredSuppliers, false)
        )}

        {/* No Featured Suppliers - Show Regular Suppliers */}
        {!suppliersLoading && featuredSuppliers.length === 0 && suppliers.length > 0 && (
          renderSuppliersCarousel(suppliers.slice(0, 3), true)
        )}

        {/* Empty State */}
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

        {/* View All Suppliers */}
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

      {/* Stats Section */}
      <section className="stats-section section">
        <div className="container">
        <div className="stats-grid">
          {stats.slice(0, 2).map((stat, index) => (
            <div key={index} className={`stat-card ${stat.highlight ? 'stat-card-highlight' : ''}`}>
              <div className="stat-icon-ring">
                {stat.icon}
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="stats-grid" style={{ marginTop: '24px' }}>
          {stats.slice(2).map((stat, index) => (
            <div key={index + 2} className={`stat-card ${stat.highlight ? 'stat-card-highlight' : ''}`}>
              <div className="stat-icon-ring">
                {stat.icon}
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner section">
        <div className="container">
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
                <button className="btn-ghost btn-lg">
                  Submit RFQ
                </button>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};

export default Home;