import { RootStackParams } from "@/App";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function LandingPage() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const { width } = useWindowDimensions();

  const handleGetStarted = () => {
    navigation.navigate("Collections");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Welcome to Curated Collections</Text>
          <Text style={styles.heroSubtitle}>
            Curate your own virtual art exhibitions
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
        <Feather
          name="arrow-right"
          size={20}
          color="white"
          style={styles.buttonIcon}
        />
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>

        <View style={styles.featureRow}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Feather name="plus" size={24} color="rgb(7, 27, 48)" />
            </View>
            <Text style={styles.featureTitle}>Create Collections</Text>
            <Text style={styles.featureDesc}>
              Create personalised exhibition collections with artworks you
              discover
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Feather name="search" size={24} color="rgb(7, 27, 48)" />
            </View>
            <Text style={styles.featureTitle}>Search Artworks</Text>
            <Text style={styles.featureDesc}>
              Discover artworks from the Victoria & Albert Museum and The
              Metropolitan Museum of Art
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Feather name="eye" size={24} color="rgb(7, 27, 48)" />
            </View>
            <Text style={styles.featureTitle}>View & Manage</Text>
            <Text style={styles.featureDesc}>
              View detailed information on each artwork. Add and remove artworks
              to and from your collections
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.buttonAlt} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Start Curating</Text>
          <Feather
            name="arrow-right"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 Curated Collections • MIT License
        </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>
            https://github.com/enterthestream/Curated-Collections
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  hero: {
    backgroundColor: "rgba(7, 27, 48, 0.95)",
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  heroContent: {
    maxWidth: 800,
    alignItems: "center",
    width: "80%",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "System",
  },
  heroSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 32,
    fontFamily: "System",
  },
  button: {
    backgroundColor: "#FFD425",
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonAlt: {
    backgroundColor: "#FFD425",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 40,
    alignSelf: "center",
  },
  buttonText: {
    color: "rgb(7, 27, 48)",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
    fontFamily: "System",
  },
  buttonIcon: {
    color: "rgb(7, 27, 48)",
  },
  section: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  sectionDesktop: {
    paddingHorizontal: 40,
  },
  darkSection: {
    backgroundColor: "rgb(7, 27, 48)",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "rgb(7, 27, 48)",
    fontFamily: "System",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    maxWidth: 1000,
  },
  featureCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 212, 37, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "rgb(7, 27, 48)",
    fontFamily: "System",
  },
  featureDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontFamily: "System",
  },
  footer: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "System",
  },
  footerLink: {
    fontSize: 14,
    color: "rgb(7, 27, 48)",
    fontWeight: "500",
    textDecorationLine: "underline",
    fontFamily: "System",
  },
});
