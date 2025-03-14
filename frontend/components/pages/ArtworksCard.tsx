import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Artwork } from "@/types.ts/artworks";

type ArtworkCardProps = {
  artwork: Artwork;
  width: number;
  onPress: (artwork: Artwork) => void;
};

export default function ArtworkCard({
  artwork,
  width,
  onPress,
}: ArtworkCardProps) {
  return (
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
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <Text style={styles.artist}>{artwork.artist}</Text>
      <Text style={styles.source}>{artwork.source}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  content: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    padding: 5,
    color: "white",
    fontFamily: "Cochin",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  artist: {
    padding: 5,
    color: "white",
    fontFamily: "Cochin",
    fontSize: 14,
  },
  source: {
    padding: 5,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Cochin",
    fontSize: 12,
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
  viewDetailsButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "rgba(255, 212, 37, 0.7)",
    borderRadius: 4,
    alignItems: "center",
  },
});
