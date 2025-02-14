import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.vam.ac.uk/v2/objects/",
});

export function fetchRecords(query: string) {
  return api.get(`/search?q=${query}&page_size=10`).then(({ data }) => {
    return data;
  });
}

export function fetchRecordsQuery(query: string) {
  return useQuery({
    queryKey: ["records", query],
    queryFn: () => fetchRecords(query),
  });
}

export function getImageURL(imageId: number, size: number) {
  return `https://framemark.vam.ac.uk/collections/${imageId}/full/!${size},${size}/0/default.jpg`;
}
