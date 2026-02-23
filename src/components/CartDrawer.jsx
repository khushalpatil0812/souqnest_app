import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    closeCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    getCartCount,
  } = useCart();

  // Get price for a product
  const getPrice = (product) => {
    if (!product.prices || product.prices.length === 0) return 0;
    const price = product.prices[0];
    return price.amount || 0;
  };

  // Format currency
  const formatCurrency = (product) => {
    if (!product.prices || product.prices.length === 0) return '₹0';
    const price = product.prices[0];
    const symbol = price.currency === 'INR' ? '₹' : price.currency === 'SAR' ? 'ر.س' : '$';
    return `${symbol}${(price.amount || 0).toLocaleString()}`;
  };

  // Get category name
  const getCategoryName = (product) => {
    if (product.category?.name) return product.category.name;
    return 'Product';
  };

  // Calculate cart total with proper currency
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = getPrice(item);
      return total + (price * item.quantity);
    }, 0);
  };

  // Navigate to RFQ form with cart items
  const handleProceedToRFQ = () => {
    closeCart();
    // Navigate to RFQ form - cart items will be read from CartContext
    navigate('/rfq', { state: { fromCart: true } });
  };

  if (!isCartOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={closeCart}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="cart-modal-close" onClick={closeCart}>
          <FiX size={24} />
        </button>

        {/* Header */}
        <div className="cart-modal-header">
          <div className="cart-modal-title-section">
            <FiShoppingCart size={28} className="cart-icon" />
            <div>
              <h2 className="cart-modal-title">Shopping Cart</h2>
              <p className="cart-modal-count">
                {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} added
              </p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="cart-modal-body">
          {cart.length === 0 ? (
            <div className="cart-modal-empty">
              <FiShoppingCart size={64} />
              <h3>Your cart is empty</h3>
              <p>Add products to get started with your order</p>
              <button className="cart-empty-btn" onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-modal-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="cart-item-no-image">
                        <FiShoppingCart size={24} />
                      </div>
                    )}
                  </div>
                  
                  <div className="cart-item-details">
                    <span className="cart-item-category">{getCategoryName(item)}</span>
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">{formatCurrency(item)}</span>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-control">
                      <button 
                        onClick={() => decrementQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => incrementQuantity(item.id)}>
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button 
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-modal-total">
              <div className="total-info">
                <span className="total-label">Estimated Total</span>
                <span className="total-amount">₹{calculateTotal().toLocaleString()}</span>
              </div>
              <span className="total-note">Final price will be confirmed in quotation</span>
            </div>
            
            <div className="cart-modal-actions">
              <button className="cart-cancel-btn" onClick={closeCart}>
                <FiX size={18} />
                Continue Shopping
              </button>
              <button 
                className="cart-rfq-btn"
                onClick={handleProceedToRFQ}
              >
                <FiArrowRight size={18} />
                Proceed to RFQ
              </button>
            </div>
            
            <p className="cart-footer-note">
              You'll be asked for company details on the next page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
