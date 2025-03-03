import { ArtworkRef, Artwork } from "./artworks";

export type Collection = {
  collectionId: string;
  name: string;
  user: string;
  artworks: ArtworkRef[];
};

export type EnrichedCollection = {
  collectionId: string;
  name: string;
  user: string;
  artworks: Artwork[];
};
