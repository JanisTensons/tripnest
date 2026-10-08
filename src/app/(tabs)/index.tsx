import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>TripNest</Text>

        <Text style={styles.title}>Plan your perfect family road trip</Text>

        <Text style={styles.subtitle}>
          AI-powered travel planning for families
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>FROM</Text>
          <TextInput
            style={styles.input}
            placeholder="Riga"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>TO</Text>
          <TextInput
            style={styles.input}
            placeholder="Copenhagen"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>TRAVEL DATES</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>START</Text>
              <Text style={styles.dateValue}>15 June</Text>
            </View>

            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>END</Text>
              <Text style={styles.dateValue}>20 June</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/trip-setup")}
          >
            <Text style={styles.buttonText}>✨ Create my trip</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Built for families who love to explore 🚗
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 40,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 40,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 17,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#111827",
    marginBottom: 20,
  },

  dateRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
  },

  dateLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "700",
    marginBottom: 4,
  },

  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  button: {
    height: 54,
    backgroundColor: "#111827",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 25,
    fontSize: 13,
  },
});
