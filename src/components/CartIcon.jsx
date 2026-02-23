import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartIcon = () => {
  const { getCartCount, toggleCart } = useCart();
  const itemCount = getCartCount();

  return (
    <button
      onClick={toggleCart}
      className="cart-icon-btn relative p-2.5 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-all"
      aria-label="Shopping Cart"
    >
      <FiShoppingCart size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
