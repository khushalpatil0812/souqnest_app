import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiPackage,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiShoppingCart,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { useProductsWithPagination } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useIndustries } from '../../hooks/useIndustries';
import { useCart } from '../../context/CartContext';
import ProductModal from '../../components/ProductModal';
import CartDrawer from '../../components/CartDrawer';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cart, addToCart, removeFromCart, getCartCount, openCart } = useCart();
  
  // State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industryId') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [selectedCurrency, setSelectedCurrency] = useState(searchParams.get('currency') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  
  // Modal state
  const [selectedProductSlug, setSelectedProductSlug] = useState(null);
  
  const ITEMS_PER_PAGE = 12;

  // Build API params
  const apiParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort: sortBy,
    };
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.categoryId = selectedCategory;
    if (selectedIndustry) params.industryId = selectedIndustry;
    if (selectedCurrency && (minPrice || maxPrice)) {
      params.currency = selectedCurrency;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
    }
    return params;
  }, [currentPage, sortBy, searchTerm, selectedCategory, selectedIndustry, selectedCurrency, minPrice, maxPrice]);

  // Fetch data
  const { data: productsResponse, isLoading, error } = useProductsWithPagination(apiParams);
  const { data: categories = [] } = useCategories();
  const { data: industries = [] } = useIndustries();

  // Extract products and meta
  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta || { total: 0, page: 1, limit: ITEMS_PER_PAGE, totalPages: 1 };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('categoryId', selectedCategory);
    if (selectedIndustry) params.set('industryId', selectedIndustry);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (selectedCurrency) params.set('currency', selectedCurrency);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, selectedIndustry, sortBy, currentPage, selectedCurrency, minPrice, maxPrice, setSearchParams]);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handler functions
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    handleFilterChange();
  };

  const handleIndustryChange = (industryId) => {
    setSelectedIndustry(industryId);
    handleFilterChange();
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    handleFilterChange();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange();
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedIndustry('');
    setSelectedCurrency('');
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleProductClick = (slug) => {
    setSelectedProductSlug(slug);
  };

  const handleCloseModal = () => {
    setSelectedProductSlug(null);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Handle order button click
  const handleOrderClick = (e, product) => {
    e.stopPropagation();
    
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        prices: product.prices,
        category: product.category,
      });
    }
  };

  // Format price
  const formatPrice = (prices) => {
    if (!prices || prices.length === 0) return null;
    const price = prices[0];
    const symbol = price.currency === 'INR' ? '₹' : price.currency === 'SAR' ? 'ر.س' : '$';
    return `${symbol}${price.amount?.toLocaleString()}`;
  };

  // Generate pagination
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

  // Check if any filter is active
  const hasActiveFilters = selectedCategory || selectedIndustry || selectedCurrency || minPrice || maxPrice;

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero-content">
          <nav className="products-breadcrumb">
            <Link to="/">Home</Link> / <span>Products</span>
          </nav>
          
          <h1 className="products-hero-title">
            Explore Our <span>Products</span>
          </h1>
          
          <p className="products-hero-subtitle">
            Browse through our extensive catalog of quality B2B products.
            Find what you need from verified suppliers.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="products-search-bar">
            <FiSearch size={22} className="products-search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name or description..."
            />
            <button type="submit" className="products-search-btn">
              Search Products
            </button>
          </form>

          {/* Quick Stats */}
          <div className="products-quick-stats">
            <div className="quick-stat">
              <span className="quick-stat-value">{meta.total || products.length}+</span>
              <span className="quick-stat-label">Products</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{categories.length}+</span>
              <span className="quick-stat-label">Categories</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{industries.length}+</span>
              <span className="quick-stat-label">Industries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="products-content">
        {/* Mobile Filter Toggle */}
        <button 
          className="products-mobile-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter size={18} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filter Sidebar */}
        <aside className={`products-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="products-filter-card">
            <div className="products-filter-header">
              <h2 className="products-filter-title">
                <FiFilter size={18} /> Filters
              </h2>
              {hasActiveFilters && (
                <button className="products-filter-clear" onClick={handleClearFilters}>
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="products-filter-group">
              <label className="products-filter-label">Category</label>
              <select
                className="products-filter-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry Filter */}
            <div className="products-filter-group">
              <label className="products-filter-label">Industry</label>
              <select
                className="products-filter-select"
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

            {/* Price Range */}
            <div className="products-filter-group">
              <label className="products-filter-label">Price Range</label>
              <select
                className="products-filter-select"
                value={selectedCurrency}
                onChange={(e) => {
                  setSelectedCurrency(e.target.value);
                  if (!e.target.value) {
                    setMinPrice('');
                    setMaxPrice('');
                  }
                  handleFilterChange();
                }}
              >
                <option value="">Select Currency</option>
                <option value="INR">₹ INR</option>
                <option value="SAR">ر.س SAR</option>
              </select>
              
              {selectedCurrency && (
                <div className="products-price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      handleFilterChange();
                    }}
                    className="products-price-input"
                  />
                  <span className="products-price-separator">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      handleFilterChange();
                    }}
                    className="products-price-input"
                  />
                </div>
              )}
            </div>

            <button 
              className="products-apply-btn"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Products Area */}
        <main className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <p className="products-results-count">
              {isLoading ? (
                'Loading products...'
              ) : (
                <>Showing <strong>{products.length}</strong> of <strong>{meta.total}</strong> products</>
              )}
            </p>
            
            <div className="products-view-options">
              <button 
                className={`products-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button 
                className={`products-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FiList size={18} />
              </button>
              
              <select 
                className="products-sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">Name (A-Z)</option>
                <option value="z-a">Name (Z-A)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="products-active-filters">
              {selectedCategory && (
                <span className="active-filter-tag">
                  {categories.find(c => c.id === selectedCategory)?.name || 'Category'}
                  <button onClick={() => setSelectedCategory('')}><FiX size={14} /></button>
                </span>
              )}
              {selectedIndustry && (
                <span className="active-filter-tag">
                  {industries.find(i => i.id === selectedIndustry)?.name || 'Industry'}
                  <button onClick={() => setSelectedIndustry('')}><FiX size={14} /></button>
                </span>
              )}
              {selectedCurrency && (minPrice || maxPrice) && (
                <span className="active-filter-tag">
                  {selectedCurrency}: {minPrice || '0'} - {maxPrice || '∞'}
                  <button onClick={() => {
                    setSelectedCurrency('');
                    setMinPrice('');
                    setMaxPrice('');
                  }}><FiX size={14} /></button>
                </span>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="products-empty-state">
              <div className="products-empty-icon">⚠️</div>
              <h3 className="products-empty-title">Unable to Load Products</h3>
              <p className="products-empty-text">
                {error?.response?.data?.message || 'Please try again later.'}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-price"></div>
                    <div className="skeleton-actions"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <div className="products-empty-state">
              <div className="products-empty-icon">📦</div>
              <h3 className="products-empty-title">No Products Found</h3>
              <p className="products-empty-text">
                {searchTerm || hasActiveFilters
                  ? 'Try adjusting your search or filters to find more products.'
                  : 'Check back soon for new products!'}
              </p>
              {hasActiveFilters && (
                <button className="products-clear-btn" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && products.length > 0 && (
            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {products.map((product) => (
                <article 
                  key={product.id} 
                  className="product-card"
                  onClick={() => handleProductClick(product.slug)}
                >
                  {/* Product Image */}
                  <div className="product-card-image">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="product-card-no-image">
                        <FiPackage size={40} />
                      </div>
                    )}
                    
                    {/* Quick View Overlay */}
                    <div className="product-card-overlay">
                      <span className="product-quick-view">
                        <FiEye size={20} />
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="product-card-content">
                    {/* Category Tag */}
                    {product.category && (
                      <span className="product-card-category">
                        <FiTag size={12} />
                        {product.category.name}
                      </span>
                    )}

                    {/* Product Name */}
                    <h3 className="product-card-name">{product.name}</h3>

                    {/* Overview */}
                    <p className="product-card-overview">
                      {product.overview?.slice(0, 80)}
                      {product.overview?.length > 80 ? '...' : ''}
                    </p>

                    {/* Price */}
                    {product.prices?.length > 0 && (
                      <div className="product-card-price">
                        <span className="price-from">From</span>
                        <span className="price-amount">{formatPrice(product.prices)}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="product-card-actions">
                      <button 
                        className="product-card-btn view"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.slug);
                        }}
                      >
                        <FiEye size={16} /> View
                      </button>
                      <button 
                        className={`product-card-btn order ${isInCart(product.id) ? 'in-cart' : ''}`}
                        onClick={(e) => handleOrderClick(e, product)}
                      >
                        {isInCart(product.id) ? (
                          <><FiCheck size={16} /> Added</>
                        ) : (
                          <><FiShoppingCart size={16} /> Order</>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && products.length > 0 && meta.totalPages > 1 && (
            <nav className="products-pagination">
              <button 
                className="products-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <FiChevronLeft size={18} />
              </button>
              
              {generatePaginationPages().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="products-page-ellipsis">...</span>
                ) : (
                  <button 
                    key={page}
                    className={`products-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button 
                className="products-page-btn"
                disabled={currentPage === meta.totalPages}
                onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
              >
                <FiChevronRight size={18} />
              </button>
            </nav>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {selectedProductSlug && (
        <ProductModal 
          productSlug={selectedProductSlug} 
          onClose={handleCloseModal} 
        />
      )}

      {/* Floating Cart Button */}
      {getCartCount() > 0 && (
        <button className="products-floating-cart" onClick={openCart}>
          <FiShoppingCart size={24} />
          <span className="cart-count">{getCartCount()}</span>
          <span className="cart-label">View Cart</span>
        </button>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default Products;
