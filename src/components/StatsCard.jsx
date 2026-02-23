import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-primary-600',
    success: 'text-accent-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };

  return (
    <div className="relative bg-white p-6 rounded-card shadow-card border border-neutral-200/50 hover:shadow-card-hover transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-3">
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-accent-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? '↗' : '↘'}
              </span>
              <span className={`text-sm ${
                trend === 'up' ? 'text-accent-600' : 'text-red-600'
              }`}>
                {trendValue}
              </span>
              <span className="text-sm text-neutral-500">vs last period</span>
            </div>
          )}
        </div>
        <div className={`${colorClasses[color]} text-4xl opacity-10 group-hover:opacity-20 transition-opacity`}>
          {icon}
        </div>
      </div>
      {/* Subtle gradient accent */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-b-card opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default StatsCard;
