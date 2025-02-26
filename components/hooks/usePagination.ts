import { useState } from "react";

export function usePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  function handleNextPage() {
    setCurrentPage((prev) => prev + 1);
  }
  function handlePrevPage() {
    setCurrentPage((prev) => prev - 1);
  }

  return {
    currentPage,
    setCurrentPage,
    hasMore,
    setHasMore,
    handleNextPage,
    handlePrevPage,
  };
}
