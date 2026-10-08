import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const days = [
  {
    day: "DAY 1",
    date: "15 June",
    title: "Riga → Stockholm",
    driving: "Ferry · 16:30",
    activities: ["Explore Stockholm Old Town", "Family dinner"],
  },
  {
    day: "DAY 2",
    date: "16 June",
    title: "Stockholm",
    driving: "Local driving · 1h",
    activities: ["Vasa Museum", "Junibacken", "Gamla Stan"],
  },
  {
    day: "DAY 3",
    date: "17 June",
    title: "Stockholm → Gothenburg",
    driving: "4h 50m",
    activities: ["Road trip stop", "Liseberg"],
  },
  {
    day: "DAY 4",
    date: "18 June",
    title: "Gothenburg → Copenhagen",
    driving: "3h 30m",
    activities: ["Universeum", "Copenhagen waterfront"],
  },
  {
    day: "DAY 5",
    date: "19 June",
    title: "Copenhagen",
    driving: "Local driving · 45m",
    activities: ["Tivoli Gardens", "Nyhavn", "Family dinner"],
  },
  {
    day: "DAY 6",
    date: "20 June",
    title: "Copenhagen → Riga",
    driving: "Travel day",
    activities: ["Breakfast", "Return journey"],
  },
];

export default function TripOverviewScreen() {
  const { adults, children, interests, maxDriving } = useLocalSearchParams<{
    adults?: string;
    children?: string;
    interests?: string;
    maxDriving?: string;
  }>();

  const adultCount = Number(adults ?? 2);
  const childCount = Number(children ?? 2);
  const drivingLimit = Number(maxDriving ?? 5);

  const selectedInterests = interests
    ? interests.split(",")
    : ["Attractions", "Kids activities"];
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

        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR TRIP ✨</Text>

          <Text style={styles.title}>
            Riga → Stockholm → Gothenburg → Copenhagen
          </Text>

          <Text style={styles.subtitle}>
            15–20 June · {adultCount} adults · {childCount} children
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>6</Text>
            <Text style={styles.summaryLabel}>Days</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>3</Text>
            <Text style={styles.summaryLabel}>Cities</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{drivingLimit}</Text>
            <Text style={styles.summaryLabel}>Max drive</Text>
          </View>
        </View>

        <View style={styles.aiCard}>
          <Text style={styles.aiTitle}>✨ TripNest recommendation</Text>

          <Text style={styles.aiText}>
            We balanced sightseeing, kids activities and driving time so your
            family can explore without spending the whole trip in the car.
          </Text>
        </View>

        <View style={styles.preferencesCard}>
          <Text style={styles.preferencesTitle}>Your family preferences</Text>

          <View style={styles.preferences}>
            {selectedInterests.map((interest) => (
              <View key={interest} style={styles.preference}>
                <Text style={styles.preferenceText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your itinerary</Text>

        {days.map((item, index) => (
          <TouchableOpacity
            key={item.day}
            style={styles.dayCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/day-view",
                params: {
                  day: (index + 1).toString(),
                },
              })
            }
          >
            <View style={styles.dayHeader}>
              <View>
                <Text style={styles.dayLabel}>{item.day}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>

              <View style={styles.dayNumber}>
                <Text style={styles.dayNumberText}>{index + 1}</Text>
              </View>
            </View>

            <Text style={styles.route}>{item.title}</Text>

            <View style={styles.drivingRow}>
              <Text style={styles.drivingIcon}>🚗</Text>
              <Text style={styles.driving}>{item.driving}</Text>
            </View>

            <View style={styles.activities}>
              {item.activities.map((activity) => (
                <View key={activity} style={styles.activity}>
                  <Text style={styles.check}>✓</Text>
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.optimizeButton}>
          <Text style={styles.optimizeText}>✨ Optimize my trip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>♡ Save trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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

  header: {
    marginBottom: 24,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 16,
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 3,
  },

  summaryLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#E5E7EB",
  },

  aiCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 30,
  },

  aiTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  aiText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 15,
  },

  dayCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  dayLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 1,
  },

  date: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 3,
  },

  dayNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  dayNumberText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  route: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  drivingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  drivingIcon: {
    fontSize: 15,
    marginRight: 7,
  },

  driving: {
    fontSize: 13,
    color: "#6B7280",
  },

  activities: {
    gap: 9,
  },

  activity: {
    flexDirection: "row",
    alignItems: "center",
  },

  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F3F4F6",
    textAlign: "center",
    lineHeight: 22,
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    marginRight: 9,
  },

  activityText: {
    fontSize: 14,
    color: "#4B5563",
  },

  optimizeButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  optimizeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  saveButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  preferencesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 30,
  },

  preferencesTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  preferences: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  preference: {
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  preferenceText: {
    fontSize: 13,
    color: "#4B5563",
  },
});
