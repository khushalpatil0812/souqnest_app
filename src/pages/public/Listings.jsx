import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiMapPin, 
  FiGlobe, 
  FiMail, 
  FiPhone,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiSend,
  FiUsers,
  FiCheck,
  FiStar,
  FiShield
} from 'react-icons/fi';
import { useSuppliersWithPagination } from '../../hooks/useSuppliers';
import { useCategories } from '../../hooks/useCategories';
import { useIndustries } from '../../hooks/useIndustries';
import './Listings.css';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedType, setSelectedType] = useState(searchParams.get('supplierType') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industryId') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const ITEMS_PER_PAGE = 12;
  
  // Build API params
  const apiParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort: sortBy,
    };
    if (searchTerm) params.search = searchTerm;
    if (selectedType) params.supplierType = selectedType;
    if (selectedIndustry) params.industryId = selectedIndustry;
    return params;
  }, [currentPage, sortBy, searchTerm, selectedType, selectedIndustry]);

  // Fetch data with pagination
  const { data: suppliersResponse, isLoading, error } = useSuppliersWithPagination(apiParams);
  const { data: categories = [] } = useCategories();
  const { data: industries = [] } = useIndustries();
  
  // Extract suppliers and pagination meta
  const suppliers = suppliersResponse?.data || [];
  const meta = suppliersResponse?.meta || { total: 0, page: 1, limit: ITEMS_PER_PAGE, totalPages: 1 };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedType) params.set('supplierType', selectedType);
    if (selectedIndustry) params.set('industryId', selectedIndustry);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedType, selectedIndustry, sortBy, currentPage, setSearchParams]);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Supplier types
  const supplierTypes = [
    { value: 'MANUFACTURER', label: 'Manufacturer' },
    { value: 'TRADER', label: 'Trader' },
    { value: 'CONTRACTOR', label: 'Contractor' },
    { value: 'SERVICE_PROVIDER', label: 'Service Provider' },
  ];

  // Handle type filter change
  const handleTypeChange = (type) => {
    setSelectedType(selectedType === type ? '' : type);
    handleFilterChange();
  };

  // Handle industry filter change
  const handleIndustryChange = (industryId) => {
    setSelectedIndustry(industryId);
    handleFilterChange();
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
    handleFilterChange();
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange();
  };

  // Format supplier type for display
  const formatSupplierType = (type) => {
    const labels = {
      MANUFACTURER: 'Manufacturer',
      TRADER: 'Trader',
      CONTRACTOR: 'Contractor',
      SERVICE_PROVIDER: 'Service Provider',
    };
    return labels[type] || 'Supplier';
  };

  // Generate pagination pages
  const generatePaginationPages = () => {
    const pages = [];
    const totalPages = meta.totalPages;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="listings-page">
      {/* Hero Section */}
      <section className="listings-hero">
        <div className="listings-hero-content">
          <nav className="listings-breadcrumb">
            <Link to="/">Home</Link> / <span>Suppliers Directory</span>
          </nav>
          
          <h1 className="listings-hero-title">
            Find <span>Verified Suppliers</span>
          </h1>
          
          <p className="listings-hero-subtitle">
            Connect with trusted B2B suppliers and manufacturers worldwide. 
            Browse our curated network of verified business partners.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="listings-search-bar">
            <FiSearch size={22} className="listings-search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company name, product, or industry..."
            />
            <button type="submit" className="listings-search-btn">
              Search Suppliers
            </button>
          </form>
          
          {/* Stats Row */}
          <div className="listings-stats-row">
            <div className="listings-stat">
              <span className="listings-stat-number">{meta.total || suppliers.length}+</span>
              <span className="listings-stat-label">Total Suppliers</span>
            </div>
            <div className="listings-stat">
              <span className="listings-stat-number">{industries.length}+</span>
              <span className="listings-stat-label">Industries</span>
            </div>
            <div className="listings-stat">
              <span className="listings-stat-number">{categories.length}+</span>
              <span className="listings-stat-label">Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="listings-content">
        {/* Mobile Filter Toggle */}
        <button 
          className="listings-mobile-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter size={18} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filter Sidebar */}
        <aside className={`listings-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="listings-filter-card">
            <div className="listings-filter-header">
              <h2 className="listings-filter-title">
                <FiFilter size={18} /> Filters
              </h2>
              <button 
                className="listings-filter-clear"
                onClick={() => {
                  setSelectedType('');
                  setSelectedIndustry('');
                  setSearchTerm('');
                  setSortBy('newest');
                  setCurrentPage(1);
                }}
              >
                Clear All
              </button>
            </div>

            {/* Business Type Filter */}
            <div className="listings-filter-group">
              <label className="listings-filter-label">Business Type</label>
              <div className="listings-filter-options">
                {supplierTypes.map((type) => (
                  <label key={type.value} className="listings-filter-option">
                    <input
                      type="radio"
                      name="supplierType"
                      checked={selectedType === type.value}
                      onChange={() => handleTypeChange(type.value)}
                    />
                    <span className="listings-filter-option-text">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Industry Filter */}
            <div className="listings-filter-group">
              <label className="listings-filter-label">Industry</label>
              <select 
                className="listings-filter-select"
                value={selectedIndustry}
                onChange={(e) => handleIndustryChange(e.target.value)}
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="listings-apply-btn"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Listings Area */}
        <main className="listings-main">
          {/* Toolbar */}
          <div className="listings-toolbar">
            <p className="listings-results-count">
              {isLoading ? (
                'Loading suppliers...'
              ) : (
                <>Showing <strong>{suppliers.length}</strong> of <strong>{meta.total}</strong> suppliers</>
              )}
            </p>
            
            <div className="listings-view-options">
              <button 
                className={`listings-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button 
                className={`listings-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FiList size={18} />
              </button>
              
              <select 
                className="listings-sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">Name (A-Z)</option>
                <option value="z-a">Name (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="listings-empty-state">
              <div className="listings-empty-icon">⚠️</div>
              <h3 className="listings-empty-title">Unable to Load Suppliers</h3>
              <p className="listings-empty-text">
                {error?.response?.data?.message || 'Please try again later.'}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className={`suppliers-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="supplier-card-skeleton">
                  <div className="skeleton-shimmer" style={{ width: '72px', height: '72px', marginBottom: '16px' }}></div>
                  <div className="skeleton-shimmer" style={{ width: '60%', height: '24px', marginBottom: '12px' }}></div>
                  <div className="skeleton-shimmer" style={{ width: '100%', height: '16px', marginBottom: '8px' }}></div>
                  <div className="skeleton-shimmer" style={{ width: '80%', height: '16px', marginBottom: '24px' }}></div>
                  <div className="skeleton-shimmer" style={{ width: '100%', height: '48px' }}></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && suppliers.length === 0 && (
            <div className="listings-empty-state">
              <div className="listings-empty-icon">🏢</div>
              <h3 className="listings-empty-title">No Suppliers Found</h3>
              <p className="listings-empty-text">
                {searchTerm || selectedType || selectedIndustry
                  ? 'Try adjusting your search or filters to find more suppliers.'
                  : 'Our supplier network is being updated. Check back soon!'}
              </p>
            </div>
          )}

          {/* Suppliers Grid */}
          {!isLoading && !error && suppliers.length > 0 && (
            <div className={`suppliers-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {suppliers.map((supplier, index) => (
                <div key={supplier.id} className="slc-card">
                  <div className="slc-header">
                    {/* Left Section - 70% */}
                    <div className="slc-left">
                      {/* Logo Box */}
                      <div className="slc-logo-box">
                        {supplier.logo ? (
                          <img src={supplier.logo} alt={supplier.companyName} />
                        ) : (
                          <span>{supplier.companyName?.charAt(0)?.toUpperCase() || 'S'}</span>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="slc-badges">
                        <div className="slc-auth-badge-black" title="Authorized Partner" style={{
                          display: 'flex', alignItems: 'center', gap: 4, background: '#111', color: '#fff', borderRadius: 6, fontWeight: 500, fontSize: 13, padding: '2px 10px', marginBottom: 2
                        }}>
                          <FiShield size={14} style={{ color: '#fff' }} />
                          <span>Authorized Partner</span>
                        </div>
                      </div>

                      {/* Identity */}
                      <div className="slc-identity">
                        <div className="slc-name">{supplier.companyName}</div>
                        {/* View Website button removed as requested */}
                        <div className="slc-location">

                          <FiMapPin size={12} />
                          <span>{supplier.location || 'Global'}</span>
                        </div>
                        {/* Products and Industries under location */}
                        {(supplier.products && supplier.products.length > 0) && (
                          <div style={{ marginTop: 4, fontSize: 13, color: '#444' }}>
                            <strong>Products:</strong> {supplier.products.map(p => typeof p === 'string' ? p : p.name).join(', ')}
                          </div>
                        )}
                        {(supplier.industries && supplier.industries.length > 0) && (
                          <div style={{ marginTop: 2, fontSize: 13, color: '#444' }}>
                            <strong>Industries:</strong> {supplier.industries.map(i => typeof i === 'string' ? i : i.name).join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="slc-tags">
                        {/* Products */}
                        {supplier.products && supplier.products.length > 0 && (
                          <div className="slc-tag-group">
                            {supplier.products.slice(0, 3).map((product, idx) => (
                              <span key={idx} className="slc-tag slc-tag-blue">
                                {typeof product === 'string' ? product : product.name}
                              </span>
                            ))}
                            {supplier.products.length > 3 && (
                              <span className="slc-tag slc-tag-more">+{supplier.products.length - 3}</span>
                            )}
                          </div>
                        )}
                        {/* Industries tags removed to avoid duplicate display */}
                      </div>
                    </div>

                    {/* Right Section - 30% */}
                    <div className="slc-right">
                      {/* Category Pill replaces Supplier Type */}
                      <span className="slc-type-pill">
                        {supplier.category
                          ? (typeof supplier.category === 'string' ? supplier.category : supplier.category.name)
                          : (supplier.supplierType || 'Supplier')}
                      </span>

                      {/* Action Buttons */}
                      <div className="slc-actions">
                        <Link to="/contact" className="slc-btn-link">
                          <button className="slc-btn">Contact</button>
                        </Link>
                        {supplier.websiteUrl && (
                          <a
                            href={supplier.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="slc-btn slc-btn-secondary"
                            style={{
                              display: 'block',
                              margin: '10px 0 0 0',
                              borderRadius: '22px',
                              fontWeight: 600,
                              fontSize: 14,
                              padding: '8px 0',
                              background: '#fff',
                              color: '#222',
                              border: '1.5px solid #1a73e8',
                              textAlign: 'center',
                              width: '100%'
                            }}
                          >
                            View Website
                          </a>
                        )}
                        <Link to={`/rfq?supplier=${supplier.id}`} className="slc-btn-link">
                          <button className="slc-btn slc-btn-rfq">Submit RFQ</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && suppliers.length > 0 && meta.totalPages > 1 && (
            <nav className="listings-pagination">
              <button 
                className="listings-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <FiChevronLeft size={18} />
              </button>
              
              {generatePaginationPages().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="listings-page-ellipsis">...</span>
                ) : (
                  <button 
                    key={page}
                    className={`listings-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button 
                className="listings-page-btn"
                disabled={currentPage === meta.totalPages}
                onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
              >
                <FiChevronRight size={18} />
              </button>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
};

export default Listings;
