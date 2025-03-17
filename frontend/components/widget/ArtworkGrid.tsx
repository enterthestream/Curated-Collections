import { Artwork } from "@/types.ts/artworks";
import {
  useWindowDimensions,
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import ArtworkCard from "../pages/ArtworksCard";
import ArtworkDetailView from "../pages/ArtworkDetailView";
import { Fragment, ReactNode } from "react";

type ArtworkGridProps = {
  isLoading: boolean;
  data: Artwork[];
  numColumns?: number;
  itemWidth?: number;
  onArtworkSelect: (artwork: Artwork) => void;
  contentContainerStyle?: object;
  header?: React.ReactElement | null;
  footer?: React.ReactElement | null;
  renderItemExtra?: (artwork: Artwork) => ReactNode;
  onRemoveArtwork?: (artworkId: string, source: string) => void;
  isDetailsVisible: boolean;
  selectedArtwork: Artwork | null;
  handleCloseDetails: () => void;
};

export default function ArtworkGrid({
  isLoading,
  data,
  numColumns: propNumColumns,
  itemWidth: propItemWidth,
  onArtworkSelect,
  onRemoveArtwork,
  contentContainerStyle,
  header,
  footer,
  isDetailsVisible,
  renderItemExtra,
  selectedArtwork,
  handleCloseDetails,
}: ArtworkGridProps) {
  const { width } = useWindowDimensions();

  const numColumns =
    propNumColumns ||
    (width > 1500
      ? 5
      : width > 1200
      ? 4
      : width > 900
      ? 3
      : width > 600
      ? 2
      : 1);

  const itemWidth =
    propItemWidth || (width - (numColumns + 1) * 20) / numColumns - 20;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#FFD425"} />
      </View>
    );
  }

  return (
    <Fragment>
      <FlatList
        data={data}
        numColumns={numColumns}
        keyExtractor={(item) => item.artworkId}
        key={`columns-${numColumns}`}
        contentContainerStyle={[styles.listContainer, contentContainerStyle]}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <ArtworkCard
              artwork={item}
              width={itemWidth}
              onPress={onArtworkSelect}
              renderItemExtra={renderItemExtra}
              onRemoveArtwork={onRemoveArtwork}
            />
            {renderItemExtra && renderItemExtra(item)}
          </View>
        )}
      />
      <ArtworkDetailView
        isDetailsVisible={isDetailsVisible}
        artwork={selectedArtwork}
        onClose={handleCloseDetails}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
