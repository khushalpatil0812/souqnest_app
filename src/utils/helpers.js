/**
 * Utility functions shared across components
 */

/**
 * Format price with currency symbol
 */
export const formatPrice = (prices, currency = null) => {
  if (!prices || prices.length === 0) return null;

  let price = prices[0];
  if (currency) {
    const match = prices.find(p => p.currency === currency);
    if (match) price = match;
  }

  if (!price || !price.amount) return null;

  const symbol = {
    'INR': '₹',
    'SAR': 'ر.س',
    'USD': '$'
  }[price.currency] || price.currency;

  const amount = price.amount?.toLocaleString();
  return { symbol, amount, currency: price.currency };
};

/**
 * Get image array from product (handles null/undefined)
 */
export const getProductImages = (product) => {
  if (!product) return [];
  return [product.imageUrl, ...(product.images || [])].filter(Boolean);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Format category name
 */
export const getCategoryName = (category) => {
  if (!category) return 'Uncategorized';
  return typeof category === 'string' ? category : category.name || 'Uncategorized';
};

/**
 * Debounce function for search/filter inputs
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
