import { StyleSheet, View, Text, ImageBackground } from "react-native";
import exhibitionImage from "../../assets/images/blank-854880_1920.jpg";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={exhibitionImage}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <Text style={styles.text}>Curated Collections</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
});
