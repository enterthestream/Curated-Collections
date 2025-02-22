import { handleAxiosError } from "../utils/errorHandler";
import axios from "axios";

// V&A Museum API
export const vaApi = axios.create({
  baseURL: "https://api.vam.ac.uk/v2/objects",
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
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
});

export async function fetchArtworksMet(query: string) {
  try {
    const {
      data: { objectIDs },
    } = await metApi.get(`/search?q=${query}`);

    if (objectIDs.length > 0) {
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

// combined artworks

export async function fetchCombinedArtworks(query: string) {
  try {
    const [vaData, metData] = await Promise.all([
      fetchArtworksVA(query).catch((err) => {
        return null;
      }),
      fetchArtworksMet(query).catch((err) => {
        return null;
      }),
    ]);

    const vaArtworks =
      vaData?.records?.map((item: any) => ({
        id: item.systemNumber,
        title: item._primaryTitle || "Untitled",
        artist: item._primaryMaker || "Unattributed or unknown",
        image: item._images._primary_thumbnail || null,
        source: "Victoria and Albert Museum",
      })) || [];

    const metArtworks =
      metData?.map((item: any) => ({
        id: item.objectID.toString(),
        title: item.title || "Untitled",
        artist: item.artistDisplayName || "Unattributed or unknown",
        image: item.primaryImageSmall || null,
        source: "The Metropolitan Museum of Art",
      })) || [];
    return [...vaArtworks, ...metArtworks];
  } catch (err) {
    throw handleAxiosError(err, "default");
  }
}
