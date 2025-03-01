import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useArtworksQuery } from "../hooks/useArtworks";
import { useState } from "react";
import { usePagination } from "../hooks/usePagination";
import Pagination from "./Pagination";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
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
    isLoading,
    error,
  } = useArtworksQuery(submittedQuery, currentPage);

  if (isLoading) return <ActivityIndicator size="large" color={"#FFD425"} />;
  if (error) return <Text style={styles.text}>Error: {error.message}</Text>;

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    setSubmittedQuery(searchQuery);
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={[styles.container, { width: width }]}>
      <TextInput
        style={[styles.input, { width: 0.3 * width }]}
        placeholder="Search the collections"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
      />
      {submittedQuery && data.length > 0 && (
        <>
          <FlatList
            data={data}
            numColumns={numColumns}
            keyExtractor={(item) => item.id}
            key={`columns-${numColumns}`}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={[styles.content, { width: itemWidth }]}>
                <Text style={styles.title}>{item.title}</Text>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                )}
              </View>
            )}
          />
          <Pagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            currentPage={currentPage}
            hasMore={hasMore}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "web" ? 40 : 20,
    alignItems: "center",
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    padding: 20,
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
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
  },
  content: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  title: {
    padding: 5,
    color: "black",
    fontFamily: "Cochin",
    fontSize: 16,
    textAlign: "center",
  },
});
