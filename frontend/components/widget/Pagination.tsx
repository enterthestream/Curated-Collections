import { Button, View, StyleSheet } from "react-native";

type PaginationProps = {
  currentPage: number;
  hasMore: boolean;
  handleNextPage: () => void;
  handlePrevPage: () => void;
};

export default function Pagination({
  currentPage,
  hasMore,
  handleNextPage,
  handlePrevPage,
}: PaginationProps) {
  return (
    <View style={styles.container}>
      <Button
        title="Previous"
        disabled={currentPage === 1}
        onPress={handlePrevPage}
        color={"#A1861B"}
      />
      <Button
        title="Next"
        disabled={!hasMore}
        onPress={handleNextPage}
        color={"#A1861B"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 8,
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
});
