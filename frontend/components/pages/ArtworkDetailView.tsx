import { Artwork } from "@/types.ts/artworks";
import { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  useWindowDimensions,
  View,
  StyleSheet,
  Text,
  Image,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import CollectionSelector from "../widget/CollectionSelector";
import { ScrollView } from "react-native-gesture-handler";
import { useCollections } from "@/context/CollectionsContext";
import ArtworkDetail from "../widget/ArtworkDetail";

type ArtworkDetailViewProps = {
  isDetailsVisible: boolean;
  artwork: Artwork | null;
  onClose: () => void;
  inCollectionView?: boolean;
};

export default function ArtworkDetailView({
  isDetailsVisible,
  inCollectionView,
  artwork,
  onClose,
}: ArtworkDetailViewProps) {
  const { collections } = useCollections();
  const [selectedId, setSelectedId] = useState<string>("");
  const [addSuccess, setAddSuccess] = useState<boolean>(false);
  const { width, height } = useWindowDimensions();

  const handleClose = () => {
    setSelectedId("");
    setAddSuccess(false);
    onClose();
  };
  const handleSelectCollection = (collectionId: string) => {
    setSelectedId(collectionId);
  };

  return (
    <Modal
      visible={isDetailsVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.artworkOverlay}>
        <View
          style={[
            styles.artworkContent,
            { width: width > 800 ? "50%" : "100%" },
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
                <ArtworkDetail label="Artist" value={artwork.artist} />
                <ArtworkDetail label="Artist Bio" value={artwork.artistBio} />
                <ArtworkDetail label="Medium" value={artwork.medium} />
                <ArtworkDetail label="Place of Origin" value={artwork.origin} />
                <ArtworkDetail
                  label="Date Produced"
                  value={artwork.dateProduced}
                />
                <ArtworkDetail
                  label="Description"
                  value={artwork.description}
                />
                <ArtworkDetail label="Source" value={artwork.source} />
                <ArtworkDetail
                  label="Source Reference"
                  value={artwork.detailsURL}
                  isLink={true}
                  onPress={() =>
                    artwork.detailsURL
                      ? Linking.openURL(artwork.detailsURL)
                      : null
                  }
                />
                <ArtworkDetail
                  label="Accession Number"
                  value={artwork.accessionNumber}
                />
              </View>
              {!inCollectionView &&
                (collections.length > 0 ? (
                  <View style={styles.collectionSection}>
                    <Text style={styles.sectionTitle}>Add to Collection</Text>

                    {addSuccess ? (
                      <View style={styles.successMessage}>
                        <AntDesign
                          name="checkcircle"
                          size={24}
                          color="#4CAF50"
                        />
                        <Text style={styles.successText}>
                          Added to collection
                        </Text>
                      </View>
                    ) : (
                      <CollectionSelector
                        artwork={artwork}
                        selectedId={selectedId}
                        onSelect={handleSelectCollection}
                        setAddSuccess={setAddSuccess}
                      />
                    )}
                  </View>
                ) : (
                  <View style={styles.noCollectionsMsg}>
                    <Text style={styles.noText}>
                      You don't have any collections yet. Create a collection to
                      save artworks.
                    </Text>
                  </View>
                ))}
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
    backgroundColor: "rgba(0,0,0,0.4)",
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
    fontSize: 18,
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
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
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
