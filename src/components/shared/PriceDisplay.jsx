/**
 * PriceDisplay - Reusable price formatting component
 * Used in ProductDetail, ProductModal, CartDrawer, and product listings
 */

const PriceDisplay = ({ prices, currency = null, showCurrency = true, size = 'md', className = '' }) => {
  if (!prices || prices.length === 0) {
    return <span className={`price-display price-na ${className}`}>N/A</span>;
  }

  // Find price by currency or use first
  let price = prices[0];
  if (currency) {
    const match = prices.find(p => p.currency === currency);
    if (match) price = match;
  }

  if (!price || !price.amount) {
    return <span className={`price-display price-na ${className}`}>N/A</span>;
  }

  const symbol = {
    'INR': '₹',
    'SAR': 'ر.س',
    'USD': '$'
  }[price.currency] || price.currency;

  const amount = price.amount?.toLocaleString();

  return (
    <span className={`price-display price-${size} ${className}`}>
      {symbol}{amount}
      {showCurrency && <span className="price-currency"> {price.currency}</span>}
    </span>
  );
};

export default PriceDisplay;
