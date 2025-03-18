import axios from "axios";
const api = axios.create({
  baseURL: "https://curated-collections.onrender.com",
});

type Collection = {
  user: string;
  collectionId: string;
  name: string;
  artworks: { artworkId: string; source: string }[];
};

export async function getUserCollections() {
  try {
    const { data } = await api.get(`/collections`);
    return data;
  } catch (err) {
    console.error("Error fetching user collections", err);
    throw err;
  }
}

export async function postUserCollection(
  user: string,
  name: string,
  artworks: Array<{ artworkId: string; source: string }> = []
) {
  try {
    const { data } = await api.post(`/collections`, {
      user,
      name,
      artworks,
    });
    return data;
  } catch (err) {
    console.error("Error posting new  collection", err);
    throw err;
  }
}

export async function postArtwork(
  collectionId: string,
  artworkId: string,
  source: string
) {
  try {
    const { data } = await api.post(`/collections/${collectionId}/artworks`, {
      artwork: { artworkId, source },
    });
    return data;
  } catch (err) {
    console.error("Error posting artwork to collection", err);
    throw err;
  }
}

export async function deleteArtwork(
  collectionId: string | undefined,
  artworkId: string,
  source: string
) {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }
  const encodedSource = encodeURIComponent(source);
  const requestUrl = `/collections/${collectionId}/artworks/${artworkId}?source=${encodedSource}`;
  try {
    const { data } = await api.delete(requestUrl);
    return data;
  } catch (err) {
    console.error("Error posting artwork to collection", err);
    throw err;
  }
}
