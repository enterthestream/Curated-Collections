import { Collection } from "@/types.ts/collection";
import { handleAxiosError } from "../utils/errorHandler";
import axios from "axios";

// V&A Museum API
export const vaApi = axios.create({
  baseURL: "https://api.vam.ac.uk/v2",
});

export function fetchArtworksVA(query: string, currentPage: number = 1) {
  return vaApi
    .get(`/objects/search?q=${query}&page=${currentPage}&page_size=10`)
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
        artworkId: item.systemNumber,
        title: item._primaryTitle || "Untitled",
        artist: item._primaryMaker.name || "Unattributed or unknown",
        image: item._images?._iiif_image_base_url
          ? `${item._images._iiif_image_base_url}/full/!300,300/0/default.jpg`
          : null,
        source: "Victoria and Albert Museum",
      })) || [];

    const metArtworks =
      metData?.map((item: any) => ({
        artworkId: item.objectID.toString(),
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

export async function fetchArtworkDetailsVA(artworkId: string) {
  try {
    const { data } = await vaApi.get(`/museumobject/${artworkId}`);
    console.log(data, "VA data");
    return {
      artworkId: data.record.systemNumber,
      title: data.record.titles[0].title || "Untitled",
      artist:
        data.record.artistMakerPerson[0].name.text || "Unattributed or unknown",
      image: data.meta.images?._iiif_image
        ? `${data.meta.images?._iiif_image}/full/!300,300/0/default.jpg`
        : null,
      source: "Victoria and Albert Museum",
    };
  } catch (err) {
    throw handleAxiosError(err, "VA");
  }
}

export async function fetchArtworkDetailsMet(artworkId: string) {
  try {
    const { data } = await metApi.get(`/objects/${artworkId}`);
    return {
      artworkId: data.objectID.toString(),
      title: data.title || "Untitled",
      artist: data.artistDisplayName || "Unattributed or unknown",
      image: data.primaryImageSmall || null,
      source: "The Metropolitan Museum of Art",
    };
  } catch (err) {
    throw handleAxiosError(err, "MET");
  }
}

export async function fetchArtworkBySource(artworkId: string, source: string) {
  try {
    if (source === "Victoria and Albert Museum") {
      return await fetchArtworkDetailsVA(artworkId);
    } else if (source === "The Metropolitan Museum of Art") {
      return await fetchArtworkDetailsMet(artworkId);
    } else {
      throw new Error("Unknown source: " + source);
    }
  } catch (error) {
    console.error(`Error fetching artwork ${artworkId}:`, error);

    return {
      artworkId: artworkId,
      title: "Error loading artwork",
      artist: "Unknown",
      image: null,
      source: source,
    };
  }
}

export async function enrichCollection(collection: Collection) {
  if (!collection || collection.artworks.length === 0) {
    return { ...collection, artworks: [] };
  }

  const enrichedArtworks = await Promise.all(
    collection.artworks.map((ref) =>
      fetchArtworkBySource(ref.artworkId, ref.source)
    )
  );

  return {
    ...collection,
    artworks: enrichedArtworks,
  };
}
