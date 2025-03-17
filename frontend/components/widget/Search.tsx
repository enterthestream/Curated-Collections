import {
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useArtworks } from "../hooks/useArtworks";
import { useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { Artwork } from "@/types.ts/artworks";
import SearchResults from "../pages/SearchResults";
import ArtworkDetailView from "../pages/ArtworkDetailView";
import { fetchArtworkBySource } from "@/api/api";

type SearchProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};
export default function Search({ searchQuery, setSearchQuery }: SearchProps) {
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  const { width } = useWindowDimensions();
  const numColumns = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const itemWidth = (width - (numColumns + 1) * 20) / numColumns - 20;

  const {
    currentPage,
    setCurrentPage,
    hasMore,
    handleNextPage,
    handlePrevPage,
  } = usePagination();

  const {
    data = [],
    recordsCount,
    isLoading,
    error,
  } = useArtworks(submittedQuery, currentPage);

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    setSubmittedQuery(searchQuery);
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  const handleArtworkSelect = async (artwork: Artwork) => {
    if (!artwork || !artwork.artworkId || !artwork.source) {
      console.error("Invalid artwork data:", artwork);
      return;
    }
    setSelectedArtwork(artwork);
    setIsDetailsVisible(true);

    try {
      const fullDetails = await fetchArtworkBySource(
        artwork.artworkId,
        artwork.source
      );
      setSelectedArtwork(fullDetails);
    } catch (err) {
      console.error(
        `Error in handleArtworkSelect for ${artwork?.artworkId}:`,
        err
      );
    }
  };

  const handleCloseDetails = () => {
    setIsDetailsVisible(false);
    setSelectedArtwork(null);
  };

  const handleNextPageWithClose = () => {
    setIsDetailsVisible(false);
    setSelectedArtwork(null);
    setTimeout(() => {
      handleNextPage();
    }, 50);
  };

  const handlePrevPageWithClose = () => {
    setIsDetailsVisible(false);
    setSelectedArtwork(null);
    setTimeout(() => {
      handlePrevPage();
    }, 50);
  };
  return (
    <View style={[styles.container, { width: width }]}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={[styles.input, { width: 0.3 * width }]}
          placeholder="Search artworks"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoFocus
        />
      </View>

      <SearchResults
        data={data}
        recordsCount={recordsCount}
        isLoading={isLoading}
        error={error}
        submittedQuery={submittedQuery}
        numColumns={numColumns}
        itemWidth={itemWidth}
        currentPage={currentPage}
        hasMore={hasMore}
        handleNextPage={handleNextPageWithClose}
        handlePrevPage={handlePrevPageWithClose}
        onArtworkSelect={handleArtworkSelect}
      />

      <ArtworkDetailView
        isDetailVisible={isDetailsVisible}
        artwork={selectedArtwork}
        onClose={handleCloseDetails}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(20, 24, 28, 0.95)",
  },
  searchBarContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 10,
    borderColor: "white",
    color: "white",
    fontFamily: "Cochin",
    fontSize: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
  },
});
