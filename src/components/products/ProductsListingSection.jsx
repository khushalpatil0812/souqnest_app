import { FiGrid, FiList, FiX } from 'react-icons/fi';
import ProductCard from '../shared/ProductCard';

const ProductsListingSection = ({
  isLoading,
  error,
  products,
  meta,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  activeFilters,
  onProductClick,
  onOrderClick,
  isInCart,
  formatPrice,
  onClearFilters,
  emptyMessage,
}) => {
  return (
    <>
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
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
          >
            <FiGrid size={18} />
          </button>
          <button
            className={`products-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List View"
          >
            <FiList size={18} />
          </button>

          <select
            className="products-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
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

      {activeFilters.length > 0 && (
        <div className="products-active-filters">
          {activeFilters.map((filter) => (
            <span key={filter.key} className="active-filter-tag">
              {filter.label}
              <button onClick={filter.onRemove}>
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && (
        <div className="products-empty-state">
          <div className="products-empty-icon">⚠️</div>
          <h3 className="products-empty-title">Unable to Load Products</h3>
          <p className="products-empty-text">
            {error?.response?.data?.message || 'Please try again later.'}
          </p>
        </div>
      )}

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

      {!isLoading && !error && products.length === 0 && (
        <div className="products-empty-state">
          <div className="products-empty-icon">📦</div>
          <h3 className="products-empty-title">No Products Found</h3>
          <p className="products-empty-text">{emptyMessage}</p>
          {activeFilters.length > 0 && (
            <button className="products-clear-btn" onClick={onClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenProduct={onProductClick}
              onOrderClick={onOrderClick}
              inCart={isInCart(product.id)}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProductsListingSection;
