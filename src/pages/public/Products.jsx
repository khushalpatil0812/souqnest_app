import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useProductsWithPagination } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useIndustries } from '../../hooks/useIndustries';
import { useCart } from '../../context/CartContext';
import PageSection from '../../components/shared/PageSection';
import ProductsHeroSection from '../../components/products/ProductsHeroSection';
import ProductsFilterSection from '../../components/products/ProductsFilterSection';
import ProductsListingSection from '../../components/products/ProductsListingSection';
import PaginationSection from '../../components/products/PaginationSection';
import './Products.css';

const ProductModal = lazy(() => import('../../components/ProductModal'));
const CartDrawer = lazy(() => import('../../components/CartDrawer'));

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cart, isCartOpen, addToCart, removeFromCart, getCartCount, openCart } = useCart();
  
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
      isActive: true,
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

  // Extract products and meta — filter to only active products (safety net if backend doesn't filter)
  const allProducts = productsResponse?.data || [];
  const products = allProducts.filter(p => p.isActive !== false);
  const rawMeta = productsResponse?.meta || { total: 0, page: 1, limit: ITEMS_PER_PAGE, totalPages: 1 };
  // Adjust meta counts to reflect only active products
  const activeTotal = rawMeta.total ? rawMeta.total - (allProducts.length - products.length) : products.length;
  const meta = {
    ...rawMeta,
    total: Math.max(0, activeTotal),
    totalPages: Math.max(1, Math.ceil(Math.max(0, activeTotal) / ITEMS_PER_PAGE)),
  };

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

  // Format price based on selected currency (fallback to first price)
  const formatPrice = (prices) => {
    if (!prices || prices.length === 0) return null;

    let price = prices[0];
    if (selectedCurrency) {
      const match = prices.find(p => p.currency === selectedCurrency);
      if (match) price = match;
    }

    const symbol = price.currency === 'INR' ? '₹' : price.currency === 'SAR' ? 'ر.س' : '$';
    return `${symbol}${price.amount?.toLocaleString()}`;
  };

  const paginationPages = useMemo(() => {
    const pages = [];
    const totalPages = meta.totalPages;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return pages;
  }, [meta.totalPages, currentPage]);

  // Check if any filter is active
  const hasActiveFilters = selectedCategory || selectedIndustry || selectedCurrency || minPrice || maxPrice;

  const activeFilters = useMemo(() => {
    const items = [];

    if (selectedCategory) {
      items.push({
        key: 'category',
        label: categories.find(c => c.id === selectedCategory)?.name || 'Category',
        onRemove: () => setSelectedCategory(''),
      });
    }

    if (selectedIndustry) {
      items.push({
        key: 'industry',
        label: industries.find(i => i.id === selectedIndustry)?.name || 'Industry',
        onRemove: () => setSelectedIndustry(''),
      });
    }

    if (selectedCurrency && (minPrice || maxPrice)) {
      items.push({
        key: 'price',
        label: `${selectedCurrency}: ${minPrice || '0'} - ${maxPrice || '∞'}`,
        onRemove: () => {
          setSelectedCurrency('');
          setMinPrice('');
          setMaxPrice('');
        },
      });
    }

    return items;
  }, [selectedCategory, selectedIndustry, selectedCurrency, minPrice, maxPrice, categories, industries]);

  return (
    <div className="products-page">
      <PageSection
        as="section"
        sectionClassName="products-hero products-hero-section"
        containerClassName="products-hero-content"
        aria-labelledby="products-hero-title"
      >
        <ProductsHeroSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          productsCount={meta.total || products.length}
          categoriesCount={categories.length}
          industriesCount={industries.length}
        />
      </PageSection>

      <PageSection
        as="section"
        sectionClassName="products-list-section"
        containerClassName="products-content"
        aria-label="Products listing section"
      >
        <ProductsFilterSection
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          hasActiveFilters={Boolean(hasActiveFilters)}
          onClearFilters={handleClearFilters}
          categories={categories}
          industries={industries}
          selectedCategory={selectedCategory}
          selectedIndustry={selectedIndustry}
          selectedCurrency={selectedCurrency}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCategoryChange={handleCategoryChange}
          onIndustryChange={handleIndustryChange}
          onCurrencyChange={(value) => {
            setSelectedCurrency(value);
            if (!value) {
              setMinPrice('');
              setMaxPrice('');
            }
            handleFilterChange();
          }}
          onMinPriceChange={(value) => {
            setMinPrice(value);
            handleFilterChange();
          }}
          onMaxPriceChange={(value) => {
            setMaxPrice(value);
            handleFilterChange();
          }}
          onApplyFilters={() => setShowFilters(false)}
        />

        <main className="products-main" aria-live="polite">
          <ProductsListingSection
            isLoading={isLoading}
            error={error}
            products={products}
            meta={meta}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            activeFilters={activeFilters}
            onProductClick={handleProductClick}
            onOrderClick={handleOrderClick}
            isInCart={isInCart}
            formatPrice={formatPrice}
            onClearFilters={handleClearFilters}
            emptyMessage={
              searchTerm || hasActiveFilters
                ? 'Try adjusting your search or filters to find more products.'
                : 'Check back soon for new products!'
            }
          />

          <PaginationSection
            isLoading={isLoading}
            hasItems={products.length > 0}
            totalPages={meta.totalPages}
            currentPage={currentPage}
            pages={paginationPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </PageSection>

      {/* Product Modal */}
      {selectedProductSlug && (
        <Suspense fallback={null}>
          <ProductModal 
            productSlug={selectedProductSlug} 
            onClose={handleCloseModal} 
          />
        </Suspense>
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
      {(isCartOpen || getCartCount() > 0) && (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      )}
    </div>
  );
};

export default Products;
