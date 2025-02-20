import { handleAxiosError } from "@/utils/errorHandler";
import axios from "axios";

// V&A Museum API
export const vaApi = axios.create({
  baseURL: "https://api.vam.ac.uk/v2/objects/",
});

export function fetchArtworksVA(query: string) {
  return vaApi
    .get(`/search?q=${query}&page_size=10`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      throw handleAxiosError(err, "VA");
    });
}

export function getVAImageURL(imageId: number, size: number) {
  return `https://framemark.vam.ac.uk/collections/${imageId}/full/!${size},${size}/0/default.jpg`;
}

// MET Museum of Art API

export const metApi = axios.create({
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1/",
});

export async function fetchArtworksMet(query: string) {
  try {
    const {
      data: { objectIDs },
    } = await metApi.get(`/search?q=${query}`);

    if (objectIDs) {
      const objectDetails = await Promise.all(
        objectIDs.slice(0, 10).map(async (id: number) => {
          const { data } = await metApi.get(`/objects/${id}`);
          return data;
        })
      );

      return objectDetails;
    }
  } catch (err) {
    throw handleAxiosError(err, "MET");
  }
}
