import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Artwork } from "@/types.ts/artworks";
import { ReactNode } from "react";
import { Feather } from "@expo/vector-icons";

type ArtworkCardProps = {
  artwork: Artwork;
  width: number;
  onPress: (artwork: Artwork) => void;
  onRemoveArtwork?: (artworkId: string, source: string) => void;
  renderItemExtra?: (artwork: Artwork) => ReactNode;
};

export default function ArtworkCard({
  artwork,
  width,
  onPress,
  onRemoveArtwork,
}: ArtworkCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <View style={[styles.container, { width }]}>
      <TouchableOpacity
        style={[styles.content, { width }]}
        onPress={() => onPress(artwork)}
      >
        <Text style={styles.title}>{artwork.title}</Text>
        {artwork.image ? (
          <Image
            source={{ uri: artwork.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}></Text>
          </View>
        )}
        <Text style={styles.artist}>{artwork.artist}</Text>
        <Text style={styles.source}>{artwork.source}</Text>
      </TouchableOpacity>
      {onRemoveArtwork && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => setShowOptions(!showOptions)}
            style={styles.optionsButton}
          >
            <Feather name="more-vertical" size={18} color="white" />
          </TouchableOpacity>
          {showOptions && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                onPress={() => {
                  onRemoveArtwork(artwork.artworkId, artwork.source);
                  setShowOptions(false);
                }}
                style={styles.removeButton}
              >
                <Feather name="trash-2" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 10,
    overflow: "hidden",
  },
  content: {
    width: "100%",
    padding: 10,
  },
  optionsContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
  optionsButton: {
    borderRadius: 4,
    padding: 4,
  },
  dropdownMenu: {
    position: "absolute",
    top: 28,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.90)",
    borderRadius: 4,
    width: 40,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    elevation: 3,
  },
  title: {
    padding: 5,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
    letterSpacing: 1,
  },
  artist: {
    padding: 5,
    color: "white",
    fontSize: 16,
  },
  source: {
    padding: 5,
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontStyle: "italic",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 4,
  },
  noImage: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  noImageText: {
    color: "white",
    fontSize: 14,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
