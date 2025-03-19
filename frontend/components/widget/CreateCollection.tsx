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

    try {
      const createdCollection = await postUserCollection(user, name);
      onCreate(createdCollection);
      setName("");
    } catch (err) {
      console.error("Error creating collection", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new exhibiton collection</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name..."
          placeholderTextColor="rgba(255, 255, 255, 0.77)"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateCollection}
        >
          <AntDesign
            name="plus"
            size={22}
            color="rgb(7, 27, 48)"
            style={{
              fontWeight: "bold",
              textShadowColor: "black",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
          />
        </TouchableOpacity>
      </View>
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
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50,
    width: "100%",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    marginRight: 12,
    fontSize: 18,
    padding: 12,
    borderRadius: 4,

    color: "white",
  },
  button: {
    backgroundColor: "#FFD425",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
