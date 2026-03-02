import { memo } from 'react';
import {
  FiPackage,
  FiTag,
  FiEye,
  FiShoppingCart,
  FiCheck
} from 'react-icons/fi';

const ProductCard = ({
  product,
  onOpenProduct,
  onOrderClick,
  inCart,
  formatPrice,
}) => {
  return (
    <article
      className="product-card"
      onClick={() => onOpenProduct(product.slug)}
    >
      <div className="product-card-image">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        ) : (
          <div className="product-card-no-image">
            <FiPackage size={40} />
          </div>
        )}

        <div className="product-card-overlay">
          <span className="product-quick-view">
            <FiEye size={20} />
            Quick View
          </span>
        </div>
      </div>

      <div className="product-card-content">
        {product.category && (
          <span className="product-card-category">
            <FiTag size={12} />
            {product.category.name}
          </span>
        )}

        <h3 className="product-card-name">{product.name}</h3>

        <p className="product-card-overview">
          {product.overview?.slice(0, 80)}
          {product.overview?.length > 80 ? '...' : ''}
        </p>

        {product.prices?.length > 0 && (
          <div className="product-card-price">
            <span className="price-from">From</span>
            <span className="price-amount">{formatPrice(product.prices)}</span>
          </div>
        )}

        <div className="product-card-actions">
          <button
            className="product-card-btn view"
            onClick={(e) => {
              e.stopPropagation();
              onOpenProduct(product.slug);
            }}
          >
            <FiEye size={16} /> View
          </button>
          <button
            className={`product-card-btn order ${inCart ? 'in-cart' : ''}`}
            onClick={(e) => onOrderClick(e, product)}
          >
            {inCart ? (
              <><FiCheck size={16} /> Added</>
            ) : (
              <><FiShoppingCart size={16} /> Order</>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default memo(ProductCard);
