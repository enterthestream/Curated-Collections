import { useQuery } from "@tanstack/react-query";
import { fetchCombinedArtworks } from "@/api/api";
import { useEffect, useState } from "react";
import { usePagination } from "./usePagination";

export function useArtworksQuery(query: string, currentPage: number = 1) {
  return useQuery({
    queryKey: ["artworks", query, currentPage],
    queryFn: () => fetchCombinedArtworks(query, currentPage),
  });
}

export function useArtworks(query: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentPage, setHasMore } = usePagination();

  const pageSize = 10;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchCombinedArtworks(query, currentPage)
      .then((artworks) => {
        setData(artworks);
        setHasMore(artworks.length > pageSize);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, currentPage]);

  return { data, isLoading, error };
}
