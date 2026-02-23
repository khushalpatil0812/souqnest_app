import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200',
    primary: 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
    info: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    // Business specific
    featured: 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 ring-1 ring-inset ring-primary-200',
    verified: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    manufacturer: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    trader: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
