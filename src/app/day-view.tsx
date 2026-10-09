import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  optimizeItinerary,
  type Activity,
  type OptimizationGoal,
} from "../utils/itinerary-optimization";

type Day = {
  date: string;
  route: string;
  driving: string;
  activities: Activity[];
};

export default function DayViewScreen() {
  const { day } = useLocalSearchParams<{
    day?: string;
  }>();

  const dayNumber = Number(day ?? 1);
  const [showOptimization, setShowOptimization] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [optimized, setOptimized] = useState(false);
  const [removedActivities, setRemovedActivities] = useState<Activity[]>([]);

  const optimizationOptions = [
    {
      id: "less-driving",
      icon: "🚗",
      title: "Less driving",
      description: "Spend less time on the road",
    },
    {
      id: "kids",
      icon: "👨‍👩‍👧",
      title: "More kids activities",
      description: "Add more family-friendly fun",
    },
    {
      id: "cheaper",
      icon: "💰",
      title: "Make it cheaper",
      description: "Find budget-friendly options",
    },
    {
      id: "nature",
      icon: "🌲",
      title: "More nature",
      description: "Discover parks and outdoor stops",
    },
    {
      id: "relaxed",
      icon: "😌",
      title: "More relaxed",
      description: "Leave more time to rest",
    },
  ];

  const days: Day[] = [
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
          priority: "required",
        },
        {
          time: "16:30",
          title: "Depart Riga",
          type: "Travel",
          icon: "🚢",
          priority: "required",
        },
        {
          time: "19:00",
          title: "Family dinner",
          type: "Food",
          icon: "🍽️",
          priority: "important",
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
          priority: "important",
        },
        {
          time: "10:30",
          title: "Vasa Museum",
          type: "Attraction",
          icon: "🏛️",
          priority: "important",
        },
        {
          time: "14:00",
          title: "Junibacken",
          type: "Kids activity",
          icon: "🎠",
          priority: "important",
        },
        {
          time: "18:00",
          title: "Dinner in Gamla Stan",
          type: "Food",
          icon: "🍝",
          priority: "important",
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
          priority: "important",
        },
        {
          time: "09:30",
          title: "Start road trip",
          type: "Travel",
          icon: "🚗",
          priority: "required",
        },
        {
          time: "12:00",
          title: "Family lunch stop",
          type: "Food",
          icon: "🍔",
          optional: true,
          priority: "optional",
        },
        {
          time: "16:30",
          title: "Arrive in Gothenburg",
          type: "Travel",
          icon: "📍",
          priority: "required",
        },
        {
          time: "18:00",
          title: "Liseberg",
          type: "Kids activity",
          icon: "🎢",
          priority: "important",
        },
      ],
    },
  ];

  const currentDay = days[dayNumber - 1] ?? days[0];

  const [updatedActivities, setUpdatedActivities] = useState<Activity[] | null>(
    null,
  );

  const [optimizationMessage, setOptimizationMessage] = useState("");

  const displayedActivities = updatedActivities ?? currentDay.activities;

  function applyOptimization() {
    if (!selectedGoal) return;

    const result = optimizeItinerary(
      updatedActivities ?? currentDay.activities,
      selectedGoal as OptimizationGoal,
      dayNumber,
    );

    setOptimizationMessage(result.message);

    setRemovedActivities((previous) => {
      const combined = result.newlyRemovedActivity
        ? [...previous, result.newlyRemovedActivity]
        : previous;

      return combined.filter(
        (removed, index, allRemoved) =>
          !result.activities.some(
            (activity) =>
              activity.time === removed.time &&
              activity.title === removed.title,
          ) &&
          allRemoved.findIndex(
            (item) =>
              item.time === removed.time && item.title === removed.title,
          ) === index,
      );
    });

    setUpdatedActivities(result.activities);
    setOptimized(true);
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
            This day is designed around your family&apos;s interests while
            keeping enough free time so the itinerary doesn&apos;t feel rushed.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Your day</Text>

        <View style={styles.timeline}>
          {displayedActivities.map((activity, index) => (
            <View
              key={`${activity.time}-${activity.title}`}
              style={styles.timelineRow}
            >
              <View style={styles.timeColumn}>
                <Text style={styles.time}>{activity.time}</Text>
              </View>

              <View style={styles.timelineLine}>
                <View style={styles.dot} />

                {index < displayedActivities.length - 1 && (
                  <View style={styles.line} />
                )}
              </View>

              <View style={styles.activityCard}>
                <View style={styles.activityTop}>
                  <Text style={styles.activityIcon}>{activity.icon}</Text>

                  <Text style={styles.activityType}>{activity.type}</Text>
                </View>

                <Text style={styles.activityTitle}>{activity.title}</Text>

                {activity.source === "optimization" && (
                  <Text style={styles.optimizationLabel}>
                    ✨ Added by optimization
                  </Text>
                )}

                <TouchableOpacity>
                  <Text style={styles.details}>View details →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        {removedActivities.length > 0 && (
          <View style={styles.removedSection}>
            <Text style={styles.removedTitle}>Removed by optimization</Text>

            {removedActivities.map((activity, index) => (
              <View
                key={`${activity.time}-${activity.title}-${index}`}
                style={styles.removedActivity}
              >
                <Text style={styles.removedActivityText}>
                  {activity.icon} {activity.time} · {activity.title}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => {
            setShowOptimization(!showOptimization);
            setOptimized(false);
            setSelectedGoal(null);
          }}
        >
          <Text style={styles.changeText}>
            {showOptimization ? "Close options ↑" : "✨ Improve this day"}
          </Text>
        </TouchableOpacity>

        {showOptimization && (
          <View style={styles.optimizationCard}>
            <Text style={styles.optimizationTitle}>
              How should we improve your day?
            </Text>

            <Text style={styles.optimizationSubtitle}>
              Choose what matters most to your family.
            </Text>

            {optimizationOptions.map((option) => {
              const selected = selectedGoal === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optimizationOption,
                    selected && styles.optimizationOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedGoal(option.id);
                    setOptimized(false);
                    setOptimizationMessage("");
                  }}
                >
                  <Text style={styles.optimizationIcon}>{option.icon}</Text>

                  <View style={styles.optimizationOptionContent}>
                    <Text style={styles.optimizationOptionTitle}>
                      {option.title}
                    </Text>
                    <Text style={styles.optimizationOptionDescription}>
                      {option.description}
                    </Text>
                  </View>

                  <Text style={styles.selectionMark}>
                    {selected ? "✓" : "○"}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.applyButton,
                !selectedGoal && styles.applyButtonDisabled,
              ]}
              disabled={!selectedGoal}
              onPress={applyOptimization}
            >
              <Text style={styles.applyButtonText}>✨ Apply improvement</Text>
            </TouchableOpacity>

            {updatedActivities !== null && (
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setUpdatedActivities(null);
                  setOptimized(false);
                  setOptimizationMessage("");
                  setSelectedGoal(null);
                  setRemovedActivities([]);
                }}
              >
                <Text style={styles.applyButtonText}>↺ Reset plan</Text>
              </TouchableOpacity>
            )}

            {optimized && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>
                  ✓ Your day plan has been updated
                </Text>
                <Text style={styles.resultText}>{optimizationMessage}</Text>
                <Text style={styles.resultNote}>
                  This is a UI prototype. The itinerary has not yet been changed
                  by AI.
                </Text>
              </View>
            )}
          </View>
        )}
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
  optimizationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
  },

  optimizationTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  optimizationSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    marginBottom: 18,
  },

  optimizationOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  optimizationOptionSelected: {
    borderColor: "#111827",
    backgroundColor: "#F3F4F6",
  },

  optimizationIcon: {
    fontSize: 23,
    marginRight: 12,
  },

  optimizationOptionContent: {
    flex: 1,
  },

  optimizationOptionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 3,
  },

  optimizationOptionDescription: {
    fontSize: 12,
    color: "#6B7280",
  },

  selectionMark: {
    fontSize: 19,
    color: "#111827",
    marginLeft: 8,
  },

  applyButton: {
    height: 50,
    borderRadius: 13,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  applyButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },

  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  resultCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 13,
    padding: 14,
    marginTop: 14,
  },

  resultTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 7,
  },

  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },

  resultNote: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
    marginTop: 8,
  },
  optimizationLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 6,
  },
  removedSection: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  removedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 10,
  },
  removedActivity: {
    paddingVertical: 6,
  },
  removedActivityText: {
    fontSize: 13,
    color: "#64748b",
    textDecorationLine: "line-through",
  },
});
