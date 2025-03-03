import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../../App";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Search from "../widget/Search";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle={"light-content"} />
      <TouchableOpacity
        style={styles.logoContainer}
        onPress={() => navigation.navigate("Collections")}
      >
        <Text style={styles.logoText}>Curated Collections</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={toggleSearch} style={styles.searchButton}>
          <Feather name="search" size={20} color={"white"} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={searchVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={toggleSearch}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search</Text>
            <TouchableOpacity onPress={toggleSearch} style={styles.closeButton}>
              <Feather name="x" size={20} color={"white"} />
            </TouchableOpacity>
          </View>
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#14181c",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: Platform.OS === "web" ? 64 : 56,
    borderBottomWidth: 1,
    borderBottomColor: "#2c3440",
    width: "100%",
    zIndex: 100,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
  searchText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Cochin",
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#14181c",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2c3440",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
