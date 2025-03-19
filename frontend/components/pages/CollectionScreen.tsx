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
import { RouteProp, useNavigation } from "@react-navigation/native";
import CreateCollection from "../widget/CreateCollection";
import { Feather } from "@expo/vector-icons";
import { useCollections } from "@/context/CollectionsContext";
import CollectionView from "./CollectionView";
import { EnrichedCollection } from "@/types.ts/collection";
import { enrichCollection } from "@/api/api";
import { deleteArtwork } from "@/api/backendFunctions";
import { RootStackParams } from "@/App";

type CollectionScreenProps = {
  route: RouteProp<RootStackParams, "Collections" | "Artwork">;
};

export default function CollectionScreen({ route }: CollectionScreenProps) {
  const user = "royal-user";
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const navigation = useNavigation();

  const {
    collections,
    setCollections,
    isLoadingCollections,
    refreshCollections,
  } = useCollections();

  const [enrichedCollection, setEnrichedCollection] =
    useState<EnrichedCollection | null>(null);
  const [isViewingCollection, setIsViewingCollection] = useState(false);

  const { width } = useWindowDimensions();
  const numColumns =
    width > 1500 ? 5 : width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const itemWidth = (width - (numColumns + 1) * 20) / numColumns - 20;

  const fetchEnrichedCollection = async (collectionId: string) => {
    const selectedCollection = collections.find(
      (collection) => collection.collectionId === collectionId
    );
    if (!selectedCollection) {
      return;
    }

    setEnrichedCollection({ ...selectedCollection, artworks: [] });

    return await enrichCollection(selectedCollection);
  };

  const handleCollectionClick = async (collectionId: string) => {
    try {
      const enrichedCollection = await fetchEnrichedCollection(collectionId);

      if (enrichedCollection) {
        setEnrichedCollection(enrichedCollection);
        setIsViewingCollection(true);
      }
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

  if (isLoadingCollections && !isViewingCollection) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#FFD425"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.overlayContainer}>
        {!isViewingCollection ? (
          <View style={styles.collectionContent}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setIsCreateVisible(true)}
            >
              <Feather
                name="plus"
                size={24}
                color={"rgb(7, 27, 48)"}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Create New Collection</Text>
            </TouchableOpacity>
            <View style={styles.collectionsList}>
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
                      <Text
                        style={styles.buttonText}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToCollections}
            >
              <Feather name="arrow-left" size={28} color="rgb(7, 27, 48)" />
            </TouchableOpacity>

            {enrichedCollection && (
              <CollectionView
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
  collectionContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  createButton: {
    marginTop: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD425",
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    paddingTop: 20,
    paddingHorizontal: 20,
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
  collectionHeader: {},
  collectionsList: {
    width: "100%",
    maxWidth: 1200,
    marginTop: 20,
  },
  collectionItem: {
    margin: 10,
    backgroundColor: "rgba(255, 212, 37, 0.05)",
    marginBottom: 15,
    borderRadius: 12,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(7, 27, 48)",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 8,
    height: 220,
  },
  viewButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
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
    color: "rgb(7, 27, 48)",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "System",
    letterSpacing: 1,
    textAlign: "center",
  },
  buttonIcon: {
    textAlign: "center",
    marginRight: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: "rgba(255, 212, 37, 0.01)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: "flex-start",
  },
  backButtonText: {
    marginLeft: 8,
    color: "rgb(7, 27, 48)",
    fontSize: 14,
    fontFamily: "System",
  },
});
