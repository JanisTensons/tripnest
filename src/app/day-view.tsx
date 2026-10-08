import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DayViewScreen() {
  const { day } = useLocalSearchParams<{
    day?: string;
  }>();

  const dayNumber = Number(day ?? 1);

  const days = [
    {
      date: "15 June",
      route: "Riga → Stockholm",
      driving: "Ferry · 16:30",
      activities: [
        {
          time: "14:30",
          title: "Check-in at ferry",
          type: "Transport",
          icon: "⛴️",
        },
        {
          time: "16:30",
          title: "Depart Riga",
          type: "Travel",
          icon: "🚢",
        },
        {
          time: "19:00",
          title: "Family dinner",
          type: "Food",
          icon: "🍽️",
        },
      ],
    },
    {
      date: "16 June",
      route: "Stockholm",
      driving: "Local driving · 1h",
      activities: [
        {
          time: "09:00",
          title: "Breakfast",
          type: "Food",
          icon: "🥐",
        },
        {
          time: "10:30",
          title: "Vasa Museum",
          type: "Attraction",
          icon: "🏛️",
        },
        {
          time: "14:00",
          title: "Junibacken",
          type: "Kids activity",
          icon: "🎠",
        },
        {
          time: "18:00",
          title: "Dinner in Gamla Stan",
          type: "Food",
          icon: "🍝",
        },
      ],
    },
    {
      date: "17 June",
      route: "Stockholm → Gothenburg",
      driving: "4h 50m",
      activities: [
        {
          time: "08:30",
          title: "Breakfast & check-out",
          type: "Food",
          icon: "🥐",
        },
        {
          time: "09:30",
          title: "Start road trip",
          type: "Travel",
          icon: "🚗",
        },
        {
          time: "12:00",
          title: "Family lunch stop",
          type: "Food",
          icon: "🍔",
        },
        {
          time: "16:30",
          title: "Arrive in Gothenburg",
          type: "Travel",
          icon: "📍",
        },
        {
          time: "18:00",
          title: "Liseberg",
          type: "Kids activity",
          icon: "🎢",
        },
      ],
    },
  ];

  const currentDay = days[dayNumber - 1] ?? days[0];

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
          <Text style={styles.backText}>‹ Trip overview</Text>
        </TouchableOpacity>

        <Text style={styles.dayLabel}>DAY {dayNumber}</Text>

        <Text style={styles.title}>{currentDay.route}</Text>

        <Text style={styles.date}>{currentDay.date}</Text>

        <View style={styles.routeCard}>
          <View>
            <Text style={styles.routeLabel}>DRIVING</Text>
            <Text style={styles.routeValue}>{currentDay.driving}</Text>
          </View>

          <View style={styles.routeIcon}>
            <Text style={styles.routeIconText}>🚗</Text>
          </View>
        </View>

        <View style={styles.aiCard}>
          <Text style={styles.aiTitle}>✨ TripNest AI tip</Text>

          <Text style={styles.aiText}>
            This day is designed around your family's interests while keeping
            enough free time so the itinerary doesn't feel rushed.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Your day</Text>

        <View style={styles.timeline}>
          {currentDay.activities.map((activity, index) => (
            <View
              key={`${activity.time}-${activity.title}`}
              style={styles.timelineRow}
            >
              <View style={styles.timeColumn}>
                <Text style={styles.time}>{activity.time}</Text>
              </View>

              <View style={styles.timelineLine}>
                <View style={styles.dot} />

                {index < currentDay.activities.length - 1 && (
                  <View style={styles.line} />
                )}
              </View>

              <View style={styles.activityCard}>
                <View style={styles.activityTop}>
                  <Text style={styles.activityIcon}>{activity.icon}</Text>

                  <Text style={styles.activityType}>{activity.type}</Text>
                </View>

                <Text style={styles.activityTitle}>{activity.title}</Text>

                <TouchableOpacity>
                  <Text style={styles.details}>View details →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.changeButton}>
          <Text style={styles.changeText}>✨ Improve this day</Text>
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
    marginBottom: 30,
  },

  backText: {
    fontSize: 16,
    color: "#6B7280",
  },

  dayLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  date: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 24,
  },

  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  routeLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 5,
  },

  routeValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  routeIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  routeIconText: {
    fontSize: 21,
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
    marginBottom: 18,
  },

  timeline: {
    marginBottom: 25,
  },

  timelineRow: {
    flexDirection: "row",
    minHeight: 105,
  },

  timeColumn: {
    width: 52,
    paddingTop: 7,
  },

  time: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },

  timelineLine: {
    width: 20,
    alignItems: "center",
    position: "relative",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#111827",
    marginTop: 8,
    zIndex: 2,
  },

  line: {
    position: "absolute",
    top: 18,
    bottom: 0,
    width: 1,
    backgroundColor: "#D1D5DB",
  },

  activityCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginLeft: 10,
    marginBottom: 12,
  },

  activityTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  activityIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  activityType: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  details: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },

  changeButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },

  changeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
