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
  isLoading?: boolean;
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
  inCollectionView?: boolean;
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
  inCollectionView,
}: ArtworkGridProps) {
  const { width } = useWindowDimensions();

  const numColumns =
    propNumColumns ||
    (width > 1800
      ? 6
      : width > 1500
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
        inCollectionView={inCollectionView}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "rgb(225, 225, 221)",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#666",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 4,
    marginBottom: 18,
    marginHorizontal: 6,
  },
});
