import { Fragment, useCallback, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CreateCollection from "../widget/CreateCollection";
import { Feather } from "@expo/vector-icons";
import { useCollections } from "@/context/CollectionsContext";
import CollectionView from "./CollectionView";
import { useArtworks } from "../hooks/useArtworks";
import { EnrichedCollection } from "@/types.ts/collection";
import { enrichCollection } from "@/api/api";
import { deleteArtwork } from "@/api/backendFunctions";

export default function CollectionScreen() {
  const user = "royal-user";
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const navigation = useNavigation();

  const {
    collections,
    setCollections,
    isLoadingCollections,
    refreshCollections,
  } = useCollections();
  const { data: artworks, isLoading: isLoadingArtworks } = useArtworks("");
  const [enrichedCollection, setEnrichedCollection] =
    useState<EnrichedCollection | null>(null);
  const [isViewingCollection, setIsViewingCollection] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currCollectionId, setCurrCollectionId] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const numColumns =
    width > 1500 ? 5 : width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const itemWidth = (width - (numColumns + 1) * 20) / numColumns - 20;
  const isLoading = isLoadingCollections || isLoadingArtworks;

  const handleCollectionClick = async (collectionId: string) => {
    setCurrCollectionId(collectionId);
    setIsRefreshing(true);

    try {
      await refreshCollections();

      const selectedCollection = collections.find(
        (collection) => collection.collectionId === collectionId
      );
      if (!selectedCollection) {
        setIsRefreshing(false);
        return;
      }

      setEnrichedCollection({ ...selectedCollection, artworks: [] });
      setIsViewingCollection(true);

      const enrichedCollection = await enrichCollection(selectedCollection);
      setEnrichedCollection(enrichedCollection);
    } catch (error) {
      console.error("Error enriching collection:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleBackToCollections = () => {
    setIsViewingCollection(false);
    setEnrichedCollection(null);
    setCurrCollectionId(null);
  };

  const handleCreateCollection = useCallback(
    (newCollection: any) => {
      setCollections((prevCollections) => [...prevCollections, newCollection]);
    },
    [setCollections]
  );

  const handleRemoveArtwork = async (artworkId: string, source: string) => {
    if (!enrichedCollection) return;

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
    try {
      await deleteArtwork(enrichedCollection?.collectionId, artworkId, source);
      await refreshCollections();
    } catch (err) {
      console.error("Error removing artwork");
    }
  };

  if (isLoading && !isViewingCollection) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#FFD425"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.overlayContainer}>
        <Text style={styles.title}>My collections</Text>

        {!isViewingCollection ? (
          <Fragment>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setIsCreateVisible(true)}
            >
              <Feather
                name="plus"
                size={24}
                color={"white"}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>

            <FlatList
              data={collections}
              numColumns={numColumns}
              key={numColumns}
              keyExtractor={(item) => item.collectionId}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <View style={[styles.collectionItem, { width: itemWidth }]}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleCollectionClick(item.collectionId)}
                  >
                    <Text style={styles.buttonText}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </Fragment>
        ) : (
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToCollections}
            >
              <Feather name="arrow-left" size={24} color="rgba(7, 27, 75)" />
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  createContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
  },
  createButton: {
    backgroundColor: "rgba(7, 27, 75, 0.95)",
    padding: 15,
    margin: 20,
    borderRadius: 16,
    alignItems: "center",
    width: 60,
    aspectRatio: 1 / 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2.5,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
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
    paddingTop: 40,
    paddingHorizontal: 20,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(225, 225, 221, 0.9)",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    margin: 20,
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: "rgb(7, 27, 48)",
  },
  collectionItem: {
    margin: 10,
    height: 200,
    backgroundColor: "rgb(7, 27, 48)",
    marginBottom: 15,
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2.5,
    shadowOpacity: 0.25,
    elevation: 5,
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
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "cochin",
    letterSpacing: 1.5,
  },
  buttonIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: 40,
    padding: 5,
  },
});
