import { postUserCollection } from "@/api/backendFunctions";
import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type CreateCollectionProps = {
  user: string;
  onCreate: (collection: { name: string; user: string }) => void;
};

export default function CreateCollection({
  user,
  onCreate,
}: CreateCollectionProps) {
  const [name, setName] = useState("");
  const handleCreateCollection = async () => {
    if (!name) {
      alert("Please provide a name for your collection!");
      return;
    }

    const newCollection = { user, name };
    try {
      await postUserCollection(user, name);
      onCreate(newCollection);
      setName("");
    } catch (err) {
      console.error("Error creating collection", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new exhibiton collection</Text>
      <TextInput
        style={styles.input}
        placeholder="Name..."
        placeholderTextColor="rgba(255,255,255,0.5)"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateCollection}>
        <AntDesign name="pluscircleo" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "50%",
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    marginBottom: 24,
    fontSize: 18,
    padding: 12,
    borderRadius: 4,
    fontFamily: "Cochin",
  },
  button: {
    backgroundColor: "#FFD425",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
});
