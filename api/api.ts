import { handleAxiosError } from "../utils/errorHandler";
import axios from "axios";

// V&A Museum API
export const vaApi = axios.create({
  baseURL: "https://api.vam.ac.uk/v2/objects",
});

export function fetchArtworksVA(query: string, currentPage: number = 1) {
  return vaApi
    .get(`/search?q=${query}&page=${currentPage}&page_size=10`)
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

export async function fetchArtworksMet(query: string, currentPage: number = 1) {
  try {
    const {
      data: { objectIDs },
    } = await metApi.get(`/search?q=${query}`);

    if (!objectIDs || objectIDs.length === 0) return [];

    if (objectIDs.length > 0) {
      const startIndex = currentPage * 10 - 10;
      const endIndex = currentPage * 10;

      const objectDetails = await Promise.all(
        objectIDs.slice(startIndex, endIndex).map(async (id: number) => {
          try {
            const { data } = await metApi.get(`/objects/${id}`);
            return data;
          } catch (err) {
            return null;
          }
        })
      );
      const validObjects = objectDetails.filter((item) => item !== null);
      return validObjects;
    }
  } catch (err) {
    throw handleAxiosError(err, "MET");
  }
}

// combined artworks

export async function fetchCombinedArtworks(
  query: string,
  currentPage: number = 1
) {
  try {
    const [vaData, metData] = await Promise.all([
      fetchArtworksVA(query, currentPage).catch((err) => {
        return null;
      }),
      fetchArtworksMet(query, currentPage).catch((err) => {
        return [];
      }),
    ]);
    const vaArtworks =
      vaData?.records?.map((item: any) => ({
        id: item.systemNumber,
        title: item._primaryTitle || "Untitled",
        artist: item._primaryMaker.name || "Unattributed or unknown",
        image: item._images?._iiif_image_base_url
          ? `${item._images._iiif_image_base_url}/full/!300,300/0/default.jpg`
          : null,
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

    const results = [...vaArtworks, ...metArtworks];
    return results;
  } catch (err) {
    throw handleAxiosError(err, "default");
  }
}
