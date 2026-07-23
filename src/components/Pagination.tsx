import Icon from './Icon';

interface PaginationProps {
  currentPage: number;
  resultsCount: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  resultsCount,
  resultsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(resultsCount / resultsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination" aria-label="Search results pages">
      {currentPage > 1 && (
        <button
          className="btn--inline pagination__btn--prev"
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon name="arrow-left" />
          <span>Page {currentPage - 1}</span>
        </button>
      )}
      {currentPage < totalPages && (
        <button
          className="btn--inline pagination__btn--next"
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span>Page {currentPage + 1}</span>
          <Icon name="arrow-right" />
        </button>
      )}
    </div>
  );
}
