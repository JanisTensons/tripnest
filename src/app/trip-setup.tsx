import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const interests = [
  "Attractions",
  "Nature",
  "Kids activities",
  "Food",
  "Museums",
  "Adventure",
];

export default function TripSetupScreen() {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Attractions",
    "Kids activities",
  ]);
  const [maxDriving, setMaxDriving] = useState(5);

  function toggleInterest(interest: string) {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Tell us about your trip</Text>

        <Text style={styles.subtitle}>
          A few details will help TripNest create a better family itinerary.
        </Text>

        {/* Travelers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travelers</Text>

          <Counter
            label="Adults"
            value={adults}
            onDecrease={() => setAdults(Math.max(1, adults - 1))}
            onIncrease={() => setAdults(adults + 1)}
          />

          <Counter
            label="Children"
            value={children}
            onDecrease={() => setChildren(Math.max(0, children - 1))}
            onIncrease={() => setChildren(children + 1)}
          />
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What does your family enjoy?</Text>

          <View style={styles.interests}>
            {interests.map((interest) => {
              const selected = selectedInterests.includes(interest);

              return (
                <TouchableOpacity
                  key={interest}
                  style={[styles.interest, selected && styles.interestSelected]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      selected && styles.interestTextSelected,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Driving */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maximum driving per day</Text>

          <View style={styles.drivingOptions}>
            {[3, 4, 5, 6, 8].map((hours) => {
              const selected = maxDriving === hours;

              return (
                <TouchableOpacity
                  key={hours}
                  style={[
                    styles.drivingOption,
                    selected && styles.drivingOptionSelected,
                  ]}
                  onPress={() => setMaxDriving(hours)}
                >
                  <Text
                    style={[
                      styles.drivingText,
                      selected && styles.drivingTextSelected,
                    ]}
                  >
                    {hours}h
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/trip-overview",
              params: {
                adults: adults.toString(),
                children: children.toString(),
                interests: selectedInterests.join(","),
                maxDriving: maxDriving.toString(),
              },
            })
          }
        >
          <Text style={styles.buttonText}>✨ Plan my trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Counter({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <View style={styles.counterRow}>
      <Text style={styles.counterLabel}>{label}</Text>

      <View style={styles.counterControls}>
        <TouchableOpacity style={styles.counterButton} onPress={onDecrease}>
          <Text style={styles.counterButtonText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.counterValue}>{value}</Text>

        <TouchableOpacity style={styles.counterButton} onPress={onIncrease}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 10,
    marginBottom: 25,
  },

  backText: {
    fontSize: 16,
    color: "#6B7280",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: "#6B7280",
    marginBottom: 30,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
  },

  counterRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  counterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  counterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  counterButtonText: {
    fontSize: 22,
    color: "#111827",
  },

  counterValue: {
    minWidth: 20,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  interest: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  interestSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  interestText: {
    fontSize: 14,
    color: "#4B5563",
  },

  interestTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  drivingOptions: {
    flexDirection: "row",
    gap: 8,
  },

  drivingOption: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  drivingOptionSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  drivingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
  },

  drivingTextSelected: {
    color: "#FFFFFF",
  },

  button: {
    height: 56,
    borderRadius: 15,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
