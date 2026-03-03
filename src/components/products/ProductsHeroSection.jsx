import { FiSearch } from 'react-icons/fi';

const ProductsHeroSection = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  productsCount,
  categoriesCount,
  industriesCount,
}) => {
  return (
    <>
      <h1 id="products-hero-title" className="products-hero-title">
        Explore Our <span>Products</span>
      </h1>

      <p className="products-hero-subtitle">
        Browse through our extensive catalog of quality B2B products.
        Find what you need from verified suppliers.
      </p>

      <form onSubmit={onSearchSubmit} className="products-search-bar" role="search">
        <FiSearch size={22} className="products-search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products by name or description..."
          aria-label="Search products"
        />
        <button type="submit" className="products-search-btn">
          Search Products
        </button>
      </form>

      <div className="products-quick-stats">
        <div className="quick-stat">
          <span className="quick-stat-value">{productsCount}+</span>
          <span className="quick-stat-label">Products</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-value">{categoriesCount}+</span>
          <span className="quick-stat-label">Categories</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-value">{industriesCount}+</span>
          <span className="quick-stat-label">Industries</span>
        </div>
      </div>
    </>
  );
};

export default ProductsHeroSection;
