import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import { EnrichedCollection } from "@/types.ts/collection";
import { useState } from "react";
import { Artwork } from "@/types.ts/artworks";
import ArtworkGrid from "../widget/ArtworkGrid";

type CollectionViewProps = {
  isLoading: boolean;
  collection: EnrichedCollection;
  onRemoveArtwork?: (artworkId: string, source: string) => void;
};

export default function CollectionView({
  isLoading,
  collection,
  onRemoveArtwork,
}: CollectionViewProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#FFD425"} />
      </View>
    );
  }

  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsDetailsVisible(true);
  };

  return (
    <View style={styles.container}>
      <ArtworkGrid
        data={collection.artworks}
        onArtworkSelect={handleArtworkSelect}
        contentContainerStyle={styles.listContainer}
        isLoading={isLoading}
        onRemoveArtwork={onRemoveArtwork}
        header={<Text style={styles.collectionName}>{collection.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
    justifyContent: "center",
  },
  collectionName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "rgb(7, 27, 48)",
    padding: 10,
  },
});
