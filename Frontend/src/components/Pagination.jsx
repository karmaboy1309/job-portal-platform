import React from 'react';

/**
 * Reusable Pagination component
 * @param {Object} props
 * @param {number} props.currentPage - Currently active page (1-indexed)
 * @param {number} props.totalPages - Total number of pages available
 * @param {function} props.onPageChange - Callback when a page is clicked
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination-container" aria-label="Job listings pagination" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 32,
      marginBottom: 32
    }}>
      {/* Prev Button */}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          padding: '6px 12px',
          opacity: currentPage <= 1 ? 0.45 : 1,
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          fontSize: 13
        }}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} style={{
                padding: '4px 8px',
                color: 'var(--clr-text-muted)',
                fontSize: 13,
                userSelect: 'none'
              }}>
                …
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onPageChange(p)}
              style={{
                minWidth: 34,
                height: 34,
                padding: '0 8px',
                borderRadius: 'var(--radius-md, 8px)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                border: isActive ? 'none' : '1px solid var(--clr-border)'
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          padding: '6px 12px',
          opacity: currentPage >= totalPages ? 0.45 : 1,
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          fontSize: 13
        }}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
};

export default Pagination;
