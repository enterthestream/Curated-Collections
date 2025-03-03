import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import exhibitionImage from "../../assets/images/blank-854880_1920.jpg";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CreateCollection from "../widget/CreateCollection";
import { Feather } from "@expo/vector-icons";
import { useCollections } from "@/context/CollectionsContext";
import CollectionView from "./CollectionView";
import { useArtworksQuery } from "../hooks/useArtworks";
import { EnrichedCollection } from "@/types.ts/collection";
import { enrichCollection } from "@/api/api";
import { deleteArtwork } from "@/api/backendFunctions";

export default function CollectionScreen() {
  const user = "royal-user";
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const navigation = useNavigation();

  const { collections, setCollections, isLoadingCollections } =
    useCollections();
  const { data: artworks, isLoading: isLoadingArtworks } = useArtworksQuery("");
  const [enrichedCollection, setEnrichedCollection] =
    useState<EnrichedCollection | null>(null);
  const [isViewingCollection, setIsViewingCollection] = useState(false);

  const isLoading = isLoadingCollections || isLoadingArtworks;

  const handleCollectionClick = async (collectionId: string) => {
    const selectedCollection = collections.find(
      (collection) => collection.collectionId === collectionId
    );
    if (!selectedCollection) {
      console.log("Collection not found");
      return;
    }

    setEnrichedCollection({ ...selectedCollection, artworks: [] });
    setIsViewingCollection(true);

    try {
      const enrichedCollection = await enrichCollection(selectedCollection);

      setEnrichedCollection(enrichedCollection);
    } catch (error) {
      console.error("Error enriching collection:", error);
    }
  };
  const handleBackToCollections = () => {
    setIsViewingCollection(false);
    setEnrichedCollection(null);
  };

  const handleCreateCollection = useCallback(
    (newCollection: any) => {
      setCollections((prevCollections) => [...prevCollections, newCollection]);
    },
    [setCollections]
  );

  const handleRemoveArtwork = async (artworkId: string, source: string) => {
    if (!enrichCollection) return;

    try {
      await deleteArtwork(enrichedCollection?.collectionId, artworkId, source);

      setEnrichedCollection((prev) =>
        prev
          ? {
              ...prev,
              artworks: prev.artworks.filter(
                (art) => art.artworkId !== artworkId
              ),
            }
          : null
      );
    } catch (err) {
      console.error("Error removing artwork");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#FFD425"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={exhibitionImage}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.overlayContainer}>
          <Text style={styles.title}>Your Curated Collections</Text>

          {!isViewingCollection ? (
            <>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => setIsCreateVisible(true)}
              >
                <Feather
                  name="plus"
                  size={18}
                  color={"white"}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>

              <FlatList
                data={collections}
                keyExtractor={(item) => item.collectionId}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                  <View style={styles.collectionItem}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handleCollectionClick(item.collectionId)}
                    >
                      <Text style={styles.buttonText}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              <Text>Collections loaded: {collections.length}</Text>
            </>
          ) : (
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToCollections}
              >
                <Feather name="arrow-left" size={24} color="white" />
                <Text style={styles.buttonText}>Back to Collections</Text>
              </TouchableOpacity>
              {enrichedCollection && (
                <CollectionView
                  isLoading={isLoading}
                  collection={enrichedCollection}
                  onRemoveArtwork={handleRemoveArtwork}
                />
              )}
            </View>
          )}

          <Modal
            visible={isCreateVisible}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.createContainer}>
              <CreateCollection user={user} onCreate={handleCreateCollection} />
              <TouchableOpacity
                onPress={() => {
                  setIsCreateVisible(false);
                }}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color={"white"} />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  createContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  createButton: {
    backgroundColor: "rgba(208, 205, 0, 0.6)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlayContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    color: "white",
    fontFamily: "Cochin",
    fontWeight: "bold",
  },
  collectionItem: {
    backgroundColor: "rgb(7, 27, 48)",
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  viewButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    left: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonIcon: {},
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});
