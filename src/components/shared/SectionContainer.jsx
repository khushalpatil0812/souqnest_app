/**
 * SectionContainer - Consistent section spacing and layout
 * Prevents overlapping sections and maintains proper spacing
 */
const SectionContainer = ({ 
  children, 
  spacing = 'normal', // 'compact' | 'normal' | 'large'
  bgColor = 'transparent',
  className = ''
}) => {
  const spacingMap = {
    compact: 'section-py-32',
    normal: 'section-py-48',
    large: 'section-py-64',
  };

  const bgColorMap = {
    transparent: 'bg-transparent',
    light: 'bg-gray-50',
    white: 'bg-white',
    gradient: 'bg-gradient-light',
  };

  return (
    <section className={`section-container ${spacingMap[spacing]} ${bgColorMap[bgColor]} ${className}`}>
      <div className="section-wrapper">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
