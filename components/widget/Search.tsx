import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  Dimensions,
} from "react-native";
import { searchVARecordsQuery } from "@/api/api";
import { useState } from "react";

const { width } = Dimensions.get("window");

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { data, isLoading, error } = searchVARecordsQuery(submittedQuery);

  if (isLoading) return <ActivityIndicator size="large" color={"#00ff00"} />;
  if (error) return <Text style={styles.text}>Error: {error.message}</Text>;

  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search the collections"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
      />
      <FlatList
        data={data?.records}
        numColumns={2}
        keyExtractor={(item) => item.systemNumber}
        renderItem={({ item }) => (
          <View style={styles.content}>
            <Text style={styles.title}>{item._primaryTitle}</Text>
            {item._images?._primary_thumbnail && (
              <Image
                source={{ uri: item._images._primary_thumbnail }}
                style={{ width: "100%", height: 150 }}
                resizeMode="cover"
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  text: {
    padding: 20,
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderColor: "white",
    color: "white",
    fontFamily: "Cochin",
    fontSize: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    width: width / 2 - 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  title: {
    padding: 5,
    color: "black",
    fontFamily: "Cochin",
    fontSize: 14,
    textAlign: "center",
  },
});
