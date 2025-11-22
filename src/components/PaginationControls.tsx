import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  showInfo?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalResults,
  itemsPerPage,
  onPageChange,
  disabled = false,
  showInfo = true,
}) => {
  // Don't render if there's only one page or no results
  if (totalPages <= 1) {
    return null;
  }

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const visiblePages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show (reduced from 7)

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Always show first page
      visiblePages.push(1);

      // Calculate start and end of the middle range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range if we're near the beginning
      if (currentPage <= 3) {
        start = 2;
        end = Math.min(3, totalPages - 1);
      }

      // Adjust range if we're near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 2, 2);
        end = totalPages - 1;
      }

      // Add ellipsis before middle range if needed
      if (start > 2) {
        visiblePages.push('ellipsis');
      }

      // Add middle range
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }

      // Add ellipsis after middle range if needed
      if (end < totalPages - 1) {
        visiblePages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        visiblePages.push(totalPages);
      }
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  // Calculate the range of items being shown
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Pagination controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || disabled}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-9 h-9"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              );
            }

            return (
              <Button
                key={`page-${page}`}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                disabled={disabled}
                className="w-9 h-9"
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || disabled}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Results info */}
      {showInfo && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {startItem} to {endItem} of {totalResults} results
        </div>
      )}
    </div>
  );
};

export default PaginationControls;