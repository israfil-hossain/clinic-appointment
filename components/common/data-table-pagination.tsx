'use client'; 
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export function DataTablePagination({ pagination, table }:{pagination: any, table: any}) {
  const { limit, currentPage, setCurrentPage, totalData } = pagination;

  const totalPageCount = Math.ceil(totalData / limit);
  const isPreviousPageAvailable = currentPage > 1;
  const isNextPageAvailable = currentPage < totalPageCount;

  useEffect(() => {
    table.setPageSize(limit);
  }, [limit, table]);

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPageCount <= 3) {
      for (let i = 1; i <= totalPageCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      if (currentPage > 1 && currentPage < totalPageCount) {
        pages.push(currentPage);
      }

      if (currentPage < totalPageCount - 2) {
        pages.push("...");
      }

      pages.push(totalPageCount);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex items-center justify-between overflow-auto px-4 py-3 border-t">
      <div className="min-w-fit flex items-center flex-nowrap gap-1.5 text-base">
        <p className="inline-flex items-center flex-nowrap gap-1">
          Showing {Math.min(limit * currentPage, totalData) || 0} /{" "}
          <span className="text-muted-foreground">{totalData || 0}</span>
        </p>
        <p className="inline-flex items-center flex-nowrap gap-1">
          (Page {currentPage || 0} of{" "}
          <span className="text-muted-foreground">{totalPageCount || 1}</span>)
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {/* Previous Page Button */}
        <Button
          variant="outline"
          className="h-8 w-8 p-1"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={!isPreviousPageAvailable}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {pages.map((page, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "h-8 w-8 p-1 text-gray-600",
              currentPage === page && "border-gray-600 text-black"
            )}
            onClick={() => {
              if (page !== "...") setCurrentPage(page);
            }}
            disabled={page === "..."}
          >
            {page}
          </Button>
        ))}

        {/* Next Page Button */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!isNextPageAvailable}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}