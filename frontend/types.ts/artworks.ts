export type Artwork = {
  artworkId: string;
  title: string;
  artist: string;
  image: string | null;
  source: string;
  description?: string;
};

export type ArtworkRef = {
  artworkId: string;
  source: string;
};
