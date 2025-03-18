import React, { Dispatch, SetStateAction, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useCollections } from "@/context/CollectionsContext";
import { postArtwork } from "@/api/backendFunctions";
import { Artwork } from "@/types.ts/artworks";
import { AntDesign } from "@expo/vector-icons";

type CollectionSelectorProps = {
  artwork: Artwork | null;
  selectedId: string;
  onSelect: (id: string) => void;
  setAddSuccess: Dispatch<SetStateAction<boolean>>;
};

export default function CollectionSelector({
  artwork,
  selectedId,
  onSelect,
  setAddSuccess,
}: CollectionSelectorProps) {
  const { collections, setCollections, refreshCollections } = useCollections();
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleAddToCollection = async () => {
    if (!artwork || !selectedId) return;

    setIsAdding(true);

    setCollections((prev) =>
      prev.map((collection) =>
        collection.collectionId === selectedId
          ? { ...collection, artworks: [...collection.artworks, artwork] }
          : collection
      )
    );

    try {
      await postArtwork(selectedId, artwork.artworkId, artwork.source);

      await refreshCollections();

      setAddSuccess(true);
    } catch (err) {
      console.error("Failed to add artwork to collection", err);
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>Select a collection</Text>
      <FlatList
        data={collections}
        contentContainerStyle={styles.collectionsContainer}
        keyExtractor={(item) => item.collectionId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.collectionOption,
              item.collectionId === selectedId && styles.selectedCollection,
            ]}
            onPress={() => onSelect(item.collectionId)}
          >
            <Text
              style={[
                styles.collectionName,
                item.collectionId === selectedId &&
                  styles.selectedCollectionName,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={{ padding: 15 }}>
        <TouchableOpacity
          style={[
            styles.addButton,
            { opacity: !selectedId || isAdding ? 0.5 : 1 },
          ]}
          onPress={handleAddToCollection}
          disabled={!selectedId || isAdding}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <View style={styles.addButton}>
              <AntDesign
                name="plus"
                size={22}
                color="white"
                style={{
                  fontWeight: "bold",
                  textShadowColor: "black",
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  selectorContainer: {
    padding: 10,
    alignItems: "center",
  },
  selectorLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Cochin",
    color: "white",
    padding: 10,
  },
  collectionsContainer: {
    gap: 10,
  },
  collectionOption: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: "rgba(9, 22, 35, 0.9)",
    alignSelf: "center",
  },
  selectedCollection: {
    backgroundColor: "rgba(255, 212, 37, 1)",
  },
  collectionName: {
    color: "white",
    fontSize: 17,
    fontFamily: "Cochin",
    alignSelf: "center",
    letterSpacing: 0.5,
  },
  selectedCollectionName: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Cochin",
    letterSpacing: 1,
  },
  addButton: {
    backgroundColor: "rgba(255, 212, 37, 1)",
    padding: 8,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
