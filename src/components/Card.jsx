import React from 'react';

const Card = ({ children, className = '', hover = false, padding = 'normal', ...props }) => {
  const hoverEffect = hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer transition-all duration-200' : '';
  
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      className={`bg-white rounded-card shadow-card border border-neutral-200/50 ${paddingStyles[padding]} ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
