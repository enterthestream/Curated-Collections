import { postArtwork } from "@/api/backendFunctions";
import { ArtworkRef, Artwork } from "@/types.ts/artworks";
import { Collection } from "@/types.ts/collection";
import { useState, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  useWindowDimensions,
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import CollectionSelector from "../widget/CollectionSelector";
import { ScrollView } from "react-native-gesture-handler";

type ArtworkDetailViewProps = {
  isDetailVisible: boolean;
  artwork: Artwork | null;
  collections: Collection[];
  onClose: () => void;
};

export default function ArtworkDetailView({
  isDetailVisible,
  artwork,
  collections,
  onClose,
}: ArtworkDetailViewProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);
  const { width, height } = useWindowDimensions();

  const logState = () => {
    console.log("Current state:", {
      selectedId,
      isAdding,
      addSuccess,
      artwork: artwork ? artwork.artworkId : null,
    });
  };

  useEffect(() => {
    console.log("Collections received:", collections);
    // Check if collections have valid ids
    const validIds = collections.every((c) => Boolean(c.collectionId));
    console.log("All collections have valid IDs:", validIds);
    if (!validIds) {
      console.warn(
        "Some collections are missing IDs:",
        collections.filter((c) => !c.collectionId).map((c) => c.name)
      );
    }
  }, [collections]);

  const handleAddToCollection = async () => {
    logState();

    if (!artwork) {
      console.error("No artwork to add");

      return;
    }

    if (!selectedId) {
      console.error("No collection selected");

      return;
    }

    setIsAdding(true);
    try {
      console.log("Attempting to add artwork", {
        collectionId: selectedId,
        artworkId: artwork.artworkId,
        source: artwork.source,
      });
      await postArtwork(selectedId, artwork.artworkId, artwork.source);
      setAddSuccess(true);
    } catch (err) {
      console.error("Failed to add artwork to collection", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSelectedId("");
    setAddSuccess(false);
    onClose();
  };
  const handleSelectCollection = (collectionId: string) => {
    console.log("Collection selected:", collectionId);
    setSelectedId(collectionId);
  };

  return (
    <Modal
      visible={isDetailVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.artworkOverlay}>
        <View
          style={[
            styles.artworkContent,
            { width: width > 800 ? "70%" : "90%", maxHeight: height * 0.8 },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {artwork && (
            <ScrollView
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.artworkTitle}>{artwork.title}</Text>
              <View style={styles.imageContainer}>
                {artwork.image ? (
                  <Image
                    source={{ uri: artwork.image }}
                    style={styles.artworkImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.noImage}>
                    <Text style={styles.noText}>No Image Available</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Artist:</Text>
                <Text style={styles.detailText}>{artwork.artist}</Text>

                <Text style={styles.detailLabel}>Source:</Text>
                <Text style={styles.detailText}>{artwork.source}</Text>

                {artwork.description && (
                  <>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailText}>{artwork.description}</Text>
                  </>
                )}
              </View>
              {collections.length > 0 ? (
                <View style={styles.collectionSection}>
                  <Text style={styles.sectionTitle}>Add to Collection</Text>

                  {addSuccess ? (
                    <View style={styles.successMessage}>
                      <AntDesign name="checkcircle" size={24} color="#4CAF50" />
                      <Text style={styles.successText}>
                        Added to collection
                      </Text>
                    </View>
                  ) : (
                    <>
                      <CollectionSelector
                        collections={collections}
                        selectedId={selectedId}
                        onSelect={handleSelectCollection}
                      />
                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          (!selectedId || isAdding) && styles.disabledButton,
                        ]}
                        onPress={handleAddToCollection}
                        disabled={!selectedId || isAdding}
                      >
                        {isAdding ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <View style={styles.addButton}>
                            <AntDesign name="plus" size={18} color="white" />
                          </View>
                        )}
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ) : (
                <View style={styles.noCollectionsMsg}>
                  <Text style={styles.noText}>
                    You don't have any collections yet. Create a collection to
                    save artworks.
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  artworkOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  artworkContent: {
    backgroundColor: "rgba(20, 24, 28, 0.95)",
    borderRadius: 10,
    padding: 20,
    maxHeight: "90%",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  closeButton: {
    padding: 5,
    right: 10,
    top: 10,
    position: "absolute",
    zIndex: 10,
  },
  artworkTitle: {
    padding: 5,
    color: "white",
    fontFamily: "Cochin",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  imageContainer: {
    width: "100%",
    height: 400,
    borderRadius: 8,
    overflow: "hidden",
  },
  artworkImage: {
    width: "100%",
    height: "100%",
  },
  noImage: {},
  noText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Cochin",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailLabel: {
    color: "rgba(255, 212, 37, 1)",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Cochin",
  },
  detailText: {
    padding: 5,
    color: "white",
    fontFamily: "Cochin",
    fontSize: 14,
  },
  collectionSection: {
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "Cochin",
  },
  addButton: {
    backgroundColor: "rgba(255, 212, 37, 1)",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "rgba(255, 212, 37, 1)",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 15,
  },
  noCollectionsMsg: {
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    alignItems: "center",
  },
  successText: {
    color: "#4CAF50",
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Cochin",
  },
  successMessage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
