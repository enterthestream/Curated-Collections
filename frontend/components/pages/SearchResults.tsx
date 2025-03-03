import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Pagination from "../widget/Pagination";
import { Artwork } from "@/types.ts/artworks";
import ArtworkCard from "./ArtworksCard";

type SearchResultsProps = {
  isLoading: boolean;
  error: Error | null;
  data: Artwork[];
  submittedQuery: string;
  itemWidth: number;
  numColumns: number;
  currentPage: number;
  hasMore: boolean;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  onArtworkSelect: (artwork: Artwork) => void;
};

export default function SearchResults({
  isLoading,
  error,
  data,
  submittedQuery,
  itemWidth,
  numColumns,
  currentPage,
  hasMore,
  handleNextPage,
  handlePrevPage,
  onArtworkSelect,
}: SearchResultsProps) {
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
      <Text style={styles.resultsCount}>{data.length} results found</Text>
      <FlatList
        data={data}
        numColumns={numColumns}
        keyExtractor={(item) => item.artworkId}
        key={`columns-${numColumns}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ArtworkCard
            artwork={item}
            width={itemWidth}
            onPress={onArtworkSelect}
          />
        )}
      />
      <Pagination
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        currentPage={currentPage}
        hasMore={hasMore}
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
});
