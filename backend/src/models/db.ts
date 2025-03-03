import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

type DatabaseSchema = {
  collections: Array<{
    user: string;
    collectionId: string;
    name: string;
    artworks: { artworkId: string; source: string }[];
  }>;
};

type Collection = {
  user: string;
  collectionId: string;
  name: string;
  artworks: { artworkId: string; source: string }[];
};

type Artwork = {
  artworkId: string;
  source: string;
};

type ArtworkError = {
  errorCode: string;
  msg: string;
};

const adapter = new JSONFile<DatabaseSchema>("db.json");
const db = new Low(adapter, { collections: [] });

export async function fetchAllCollections() {
  await db.read();
  return db.data.collections;
}

export async function fetchCollectionById(collectionId: string) {
  await db.read();
  return db.data.collections.find(
    (collection) => collection.collectionId === collectionId
  );
}
export async function addCollection(collection: Collection) {
  await db.read();
  db.data.collections.push(collection);
  await db.write();
}

export async function addArtwork(collectionId: string, artwork: Artwork) {
  await db.read();
  const foundCollection = db.data.collections.find(
    (collection) => collection.collectionId === collectionId
  );
  if (!foundCollection) {
    return null;
  }

  const isDuplicate = foundCollection.artworks.some(
    (a) => a.artworkId === artwork.artworkId && a.source === artwork.source
  );

  if (isDuplicate) {
    return "duplicate";
  }

  const updatedCollection = {
    ...foundCollection,
    artworks: [...foundCollection.artworks, artwork],
  };

  db.data.collections = db.data.collections.map((collection) =>
    collection.collectionId === collectionId ? updatedCollection : collection
  );

  await db.write();

  return updatedCollection;
}

export async function removeArtwork(
  collectionId: string,
  artworkId: string
): Promise<Collection | ArtworkError | null> {
  await db.read();

  const foundCollection = db.data.collections.find(
    (collection) => collection.collectionId === collectionId
  );
  if (!foundCollection) {
    return null;
  }

  const artworkExists = foundCollection.artworks.some(
    (a) => a.artworkId === artworkId
  );

  if (!artworkExists) {
    return { errorCode: "ARTWORK_NOT_FOUND", msg: "Artwork not found" };
  }

  const updatedCollectionArtworks = foundCollection?.artworks.filter(
    (a) => a.artworkId !== artworkId
  );

  const updatedCollection = {
    ...foundCollection,
    artworks: updatedCollectionArtworks,
  };

  db.data.collections = db.data.collections.map((collection) =>
    collection.collectionId === collectionId ? updatedCollection : collection
  );

  await db.write();

  return updatedCollection;
}

export default db;
