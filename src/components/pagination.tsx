import { PiCaretLeftThin, PiCaretRightThin } from "react-icons/pi";

import { PaginationProps } from "@/types";

export const Pagination = ({ setPage, page, totalPage, isNumber = false, color }: PaginationProps) => {
  const maxVisiblePages = 5;

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPage));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    pages.push(1);

    if (page > half + 2) {
      pages.push("...");
    }

    const start = Math.max(2, page - half);
    const end = Math.min(totalPage - 1, page + half);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page + half < totalPage - 1) {
      pages.push("...");
    }

    // Add last page
    if (totalPage > 1) {
      pages.push(totalPage);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {/* Previous button */}
      <button
        className={`size-10 sm:size-12 flex items-center justify-center border rounded-lg bg-light duration-300 group ${page === 1 ? "border-gray" : `border-${color} hover:bg-${color}`}`}
        type="button"
        onClick={handlePreviousPage}
        disabled={page === 1}
      >
        <PiCaretLeftThin size={24} className={`duration-300 ${page === 1 ? "fill-gray" : `fill-${color} group-hover:fill-light`}`} />
      </button>

      {/* Pagination with ellipses */}
      {isNumber &&
        getPageNumbers().map((numberPage, index) =>
          typeof numberPage === "number" ? (
            <button key={index} type="button" onClick={() => setPage(numberPage)} className={`pagination-number ${numberPage === page ? `bg-${color} text-light` : "bg-light text-dark-blue"}`}>
              {numberPage}
            </button>
          ) : (
            <span key={index} className="p-0 sm:p-1 text-3xl">
              {numberPage}
            </span>
          )
        )}

      {/* Next button */}
      <button
        className={`size-10 sm:size-12 flex items-center justify-center border rounded-lg bg-light duration-300 group ${page === totalPage ? "border-gray" : `border-${color} hover:bg-${color}`}`}
        type="button"
        onClick={handleNextPage}
        disabled={page === totalPage}
      >
        <PiCaretRightThin size={24} className={`duration-300 ${page === totalPage ? "fill-gray" : `fill-${color} group-hover:fill-light`}`} />
      </button>
    </div>
  );
};
