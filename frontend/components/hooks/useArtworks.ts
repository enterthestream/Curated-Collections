import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCombinedArtworks } from "@/api/api";
import { usePagination } from "./usePagination";
import { useEffect } from "react";

export function useArtworks(query: string, currentPage: number = 1) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["artworks", query, currentPage],
    queryFn: () => fetchCombinedArtworks(query, currentPage),
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
    enabled: !!query,
  });
  const { setHasMore } = usePagination();

  useEffect(() => {
    if (data) {
      setHasMore(data.records.length > 0);
    }
  }, [data, setHasMore]);

  return {
    data: data?.records || [],
    recordsCount: data?.totalRecordsCount || 0,
    isLoading,
    error,
  };
}
