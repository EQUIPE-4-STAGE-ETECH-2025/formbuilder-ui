import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./Button";
import { Dropdown } from "./Dropdown";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-5 border border-surface-700/50 bg-surface-900 rounded-2xl">
      {/* Items per page selector */}
      <div className="flex items-center gap-3 text-sm text-surface-400">
        <span className="font-medium">Afficher</span>
        <Dropdown
          value={itemsPerPage.toString()}
          options={[
            { value: "5", label: "5" },
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          onChange={(value) => onItemsPerPageChange(Number(value))}
          size="sm"
          className="min-w-[80px]"
        />
        <span className="font-medium">par page</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-surface-400 font-medium">
        <span className="text-text-100">
          {startItem}-{endItem}
        </span>{" "}
        sur <span className="text-text-100">{totalItems}</span> résultats
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-surface-500">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onPageChange(page as number)}
                className={clsx(
                  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-0 select-none rounded-xl active:scale-[0.98] px-3 py-2 min-w-[40px] text-sm",
                  currentPage === page
                    ? "bg-accent-500 text-white hover:bg-accent-500"
                    : "text-surface-300 hover:bg-surface-800 hover:text-text-100"
                )}
              >
                {page}
              </button>
            )}
          </div>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
