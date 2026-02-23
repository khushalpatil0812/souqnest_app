/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Prestige B2B Theme - Navy + Teal + Gold
        'primary': {
          50: '#F0FDFF',    // Lightest cyan tint
          100: '#E0F7FA',
          200: '#B2EBF2',
          300: '#80DEEA',
          400: '#26C6DA',
          500: '#0891B2',   // Main Teal
          600: '#0E7490',   // Deep Teal
          700: '#155E75',
          800: '#164E63',
          900: '#0F172A',   // Deep Navy
          DEFAULT: '#0891B2',
        },
        'accent': {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',   // Warm Gold
          600: '#D97706',   // Main Gold
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          DEFAULT: '#D97706',
        },
        'secondary': {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',   // Sky Blue
          600: '#0284C7',   // Main secondary
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          DEFAULT: '#0284C7',
        },
        'neutral': {
          50: '#F8FAFC',    // Almost white
          100: '#F1F5F9',   // Very light slate
          200: '#E2E8F0',   // Light border
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',   // Medium slate
          600: '#475569',   // Dark slate text
          700: '#334155',   // Darker text
          800: '#1E293B',   // Very dark text
          900: '#0F172A',   // Navy
          DEFAULT: '#64748B',
        },
        // Semantic Colors
        'success': '#059669',      // Emerald
        'warning': '#D97706',      // Gold
        'error': '#DC2626',        // Red
        'info': '#0891B2',         // Teal
        
        // B2B Specific
        'sidebar': '#FFFFFF',       // White sidebar
        'sidebar-hover': '#F0F9FF', // Light blue tint hover
        'card': '#FFFFFF',
        'background': '#F0F9FF',    // Light blue-tinted background
        'border': '#E2E8F0',        // Slate borders
        
        // Text Hierarchy
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        'text-tertiary': '#94A3B8',
        
        // Additional B2B colors
        'navy': '#1E3A5F',
        'teal': '#0891B2',
        'gold': '#D97706',
        'cyan': '#06B6D4',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'card': '0.75rem',    // 12px
        'button': '0.5rem',   // 8px
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
