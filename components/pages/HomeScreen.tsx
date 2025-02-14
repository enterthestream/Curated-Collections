import { StyleSheet, View, Text, ImageBackground } from "react-native";
import exhibitionImage from "../../assets/images/blank-854880_1920.jpg";
import Search from "../widget/Search";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={exhibitionImage}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.content}>
          <Text style={styles.text}>Curated Collections</Text>
          <Search />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    padding: 20,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Cochin",
  },
});
