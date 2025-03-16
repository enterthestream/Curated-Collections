export type Artwork = {
  artworkId: string;
  title: string;
  artist: string;
  artistBio: string | null;
  image: string | null;
  source: string;
  medium: string | null;
  accessionNumber: number | null;
  description: string | null;
  detailsURL: string | null;
  origin: string | null;
  dateProduced: string | null;
};

export type ArtworkRef = {
  artworkId: string;
  source: string;
};
