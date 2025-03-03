import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import ArtworkCard from "./ArtworksCard";
import { Feather } from "@expo/vector-icons";
import { Collection, EnrichedCollection } from "@/types.ts/collection";
import { useState } from "react";
import { Artwork, ArtworkRef } from "@/types.ts/artworks";

type CollectionViewProps = {
  isLoading: boolean;
  collection: EnrichedCollection;
  onRemoveArtwork?: (collectionId: string, artworkId: string) => void;
};

export default function CollectionView({
  isLoading,
  collection,
  onRemoveArtwork,
}: CollectionViewProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  const { width } = useWindowDimensions();
  const numColumns = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const itemWidth = (width - (numColumns + 1) * 20) / numColumns - 20;

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
      <FlatList
        data={[collection]}
        numColumns={numColumns}
        key={`columns-${numColumns}`}
        keyExtractor={(item) => item.collectionId}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: collection }) => (
          <View>
            <Text>{collection.name}</Text>
            {collection.artworks &&
              collection.artworks.map((artwork) => (
                <View key={artwork.artworkId} style={styles.collectionItem}>
                  <ArtworkCard
                    artwork={artwork}
                    width={120}
                    onPress={handleArtworkSelect}
                  />
                  {onRemoveArtwork && (
                    <TouchableOpacity
                      onPress={() =>
                        onRemoveArtwork(artwork.artworkId, artwork.source)
                      }
                      style={styles.removeButton}
                    >
                      <Feather name="trash-2" size={18} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
          </View>
        )}
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
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsCount: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
    justifyContent: "center",
  },
  noResults: {
    padding: 20,
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  collectionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(7, 27, 48)",
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
  },
  removeButton: {
    marginLeft: 10,
    padding: 5,
  },
});
