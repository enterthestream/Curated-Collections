import { Fragment } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ArtworkDetailProps = {
  label: string;
  value: string | number | null;
  isLink?: boolean;
  onPress?: () => void;
};
export default function ArtworkDetail({
  label,
  value,
  isLink,
  onPress,
}: ArtworkDetailProps) {
  if (!value) return null;

  if (!isLink) {
    return (
      <Fragment>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailText}>{value}</Text>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Text style={styles.detailLabel}>{label}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.detailText, styles.linkText]}>{value}</Text>
      </TouchableOpacity>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  detailLabel: {
    color: "rgba(255, 212, 37, 1)",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Cochin",
  },
  detailText: {
    padding: 5,
    color: "white",
    fontFamily: "Cochin",
    fontSize: 14,
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
