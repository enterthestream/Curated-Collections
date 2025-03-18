import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Pagination from "../widget/Pagination";
import { Artwork } from "@/types.ts/artworks";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import ArtworkGrid from "../widget/ArtworkGrid";

type SearchResultsProps = {
  isLoading: boolean;
  error: Error | null;
  data: Artwork[];
  recordsCount: number;
  submittedQuery: string;
  itemWidth: number;
  numColumns: number;
  currentPage: number;
  hasMore: boolean;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  onArtworkSelect: (artwork: Artwork) => void;
  isDetailsVisible: boolean;
  handleCloseDetails: () => void;
  selectedArtwork: Artwork | null;
};

export default function SearchResults({
  isLoading,
  error,
  data,
  recordsCount,
  submittedQuery,
  itemWidth,
  numColumns,
  currentPage,
  hasMore,
  handleNextPage,
  handlePrevPage,
  onArtworkSelect,
  isDetailsVisible,
  selectedArtwork,
  handleCloseDetails,
}: SearchResultsProps) {
  const [filterQuery, setFilterQuery] = useState<string>("");

  const filteredData = filterQuery
    ? data.filter((artwork) =>
        artwork.artist.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : data;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#FFD425"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.text}>Error: {error.message}</Text>
      </View>
    );
  }

  if (!submittedQuery) {
    return null;
  }

  if (data.length === 0) {
    return (
      <Text style={styles.noResults}>
        No results found for "{submittedQuery}"
      </Text>
    );
  }

  return (
    <View style={styles.resultsContainer}>
      <ArtworkGrid
        data={filteredData}
        onArtworkSelect={onArtworkSelect}
        isLoading={isLoading}
        numColumns={numColumns}
        itemWidth={itemWidth}
        contentContainerStyle={styles.listContainer}
        selectedArtwork={selectedArtwork}
        isDetailsVisible={isDetailsVisible}
        handleCloseDetails={handleCloseDetails}
        header={
          <View>
            <Text style={styles.resultsCount}>
              {recordsCount} results found
            </Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Filter by artist..."
              value={filterQuery}
              onChangeText={setFilterQuery}
            />
          </View>
        }
        footer={
          <Pagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            currentPage={currentPage}
            hasMore={hasMore}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsCount: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  noResults: {
    padding: 20,
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  text: {
    padding: 20,
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
  filterInput: {
    height: 40,
    aspectRatio: 1 / 4,
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
