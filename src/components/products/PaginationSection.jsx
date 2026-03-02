import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PaginationSection = ({
  isLoading,
  hasItems,
  totalPages,
  currentPage,
  pages,
  onPageChange,
}) => {
  if (isLoading || !hasItems || totalPages <= 1) {
    return null;
  }

  return (
    <nav className="products-pagination" aria-label="Products pagination">
      <button
        className="products-page-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <FiChevronLeft size={18} />
      </button>

      {pages.map((page, idx) => (
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="products-page-ellipsis">...</span>
        ) : (
          <button
            key={page}
            className={`products-page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      ))}

      <button
        className="products-page-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
};

export default PaginationSection;
