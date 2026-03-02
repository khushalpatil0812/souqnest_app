import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * ImageGallery - Reusable image carousel component
 * Used in ProductDetail and ProductModal
 */
const ImageGallery = ({ images = [], productName = 'Product', onImageClick = null }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter valid images
  const validImages = images.filter(img => img && img.trim());
  
  if (!validImages.length) {
    return (
      <div className="image-gallery-placeholder">
        <div className="image-placeholder-icon">📦</div>
        <p>No image available</p>
      </div>
    );
  }

  const currentImage = validImages[selectedIndex];

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleImageClick = () => {
    if (onImageClick) onImageClick(selectedIndex);
  };

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div className="image-gallery-main" onClick={handleImageClick} role="button" tabIndex={0}>
        <img 
          src={currentImage} 
          alt={productName}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
          }}
        />
        {validImages.length > 1 && (
          <>
            <button className="image-nav-btn image-nav-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous image">
              <FiChevronLeft size={24} />
            </button>
            <button className="image-nav-btn image-nav-next" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next image">
              <FiChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="image-gallery-thumbnails">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              className={`image-thumbnail ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View image ${idx + 1}`}
            >
              <img src={img} alt={`${productName} ${idx + 1}`} loading="lazy" decoding="async" onError={(e) => e.target.src = 'https://via.placeholder.com/80x80'} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
