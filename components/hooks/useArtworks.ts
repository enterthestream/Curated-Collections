import { useQuery } from "@tanstack/react-query";
import { fetchArtworksVA, fetchArtworksMet } from "@/api/api";

export function useArtworksQuery(query: string) {
  return useQuery({
    queryKey: ["va_records", query],
    queryFn: () => fetchArtworksVA(query),
  });
}
