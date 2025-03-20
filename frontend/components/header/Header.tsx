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
          <Text style={styles.searchButtonText}>Search</Text>
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
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: Platform.OS === "web" ? 64 : 56,
    borderBottomWidth: 1,
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
    fontFamily: "System",
    margin: 20,
  },
  searchText: {
    color: "white",
    fontSize: 14,
    fontFamily: "System",
  },
  searchButton: {
    width: 40,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: 8,
    marginRight: 12,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
    fontFamily: "System",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "System",
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
