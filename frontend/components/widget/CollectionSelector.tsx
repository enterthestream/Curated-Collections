import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Collection } from "@/types.ts/collection";

type CollectionSelectorProps = {
  collections: Collection[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function CollectionSelector({
  collections,
  selectedId,
  onSelect,
}: CollectionSelectorProps) {
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
    </View>
  );
}
const styles = StyleSheet.create({
  selectorContainer: {
    padding: 10,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Cochin",
    color: "white",
  },
  collectionsContainer: {
    gap: 10,
  },
  collectionOption: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  selectedCollection: {
    backgroundColor: "rgba(255, 212, 37, 1)",
  },
  collectionName: {
    color: "white",
    fontSize: 15,
    fontFamily: "Cochin",
  },
  selectedCollectionName: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
});
