import { FiFilter } from 'react-icons/fi';

const ProductsFilterSection = ({
  showFilters,
  onToggleFilters,
  hasActiveFilters,
  onClearFilters,
  categories,
  industries,
  selectedCategory,
  selectedIndustry,
  selectedCurrency,
  minPrice,
  maxPrice,
  onCategoryChange,
  onIndustryChange,
  onCurrencyChange,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyFilters,
}) => {
  return (
    <>
      <button
        className="products-mobile-filter-toggle"
        onClick={onToggleFilters}
        aria-expanded={showFilters}
        aria-controls="products-filters-sidebar"
      >
        <FiFilter size={18} />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <aside
        id="products-filters-sidebar"
        className={`products-sidebar ${showFilters ? 'open' : ''}`}
        aria-label="Product filters"
      >
        <div className="products-filter-card">
          <div className="products-filter-header">
            <h2 className="products-filter-title">
              <FiFilter size={18} /> Filters
            </h2>
            {hasActiveFilters && (
              <button className="products-filter-clear" onClick={onClearFilters}>
                Clear All
              </button>
            )}
          </div>

          <div className="products-filter-group">
            <label className="products-filter-label">Category</label>
            <select
              className="products-filter-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="products-filter-group">
            <label className="products-filter-label">Industry</label>
            <select
              className="products-filter-select"
              value={selectedIndustry}
              onChange={(e) => onIndustryChange(e.target.value)}
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>

          <div className="products-filter-group">
            <label className="products-filter-label">Price Range</label>
            <select
              className="products-filter-select"
              value={selectedCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
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
                  onChange={(e) => onMinPriceChange(e.target.value)}
                  className="products-price-input"
                />
                <span className="products-price-separator">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                  className="products-price-input"
                />
              </div>
            )}
          </div>

          <button className="products-apply-btn" onClick={onApplyFilters}>
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProductsFilterSection;
