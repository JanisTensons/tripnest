import { describe, expect, it } from "@jest/globals";
import { optimizeItinerary, type Activity } from "./itinerary-optimization";

const activities: Activity[] = [
  {
    time: "09:00",
    title: "Breakfast",
    type: "Food",
    icon: "🍳",
    priority: "important",
  },
  {
    time: "12:00",
    title: "Optional scenic stop",
    type: "Attraction",
    icon: "🌲",
    optional: true,
    requiresTravel: true,
    priority: "optional",
  },
  {
    time: "16:30",
    title: "Arrive in Gothenburg",
    type: "Travel",
    icon: "🚗",
    priority: "required",
  },
];

describe("optimizeItinerary", () => {
  it("removes an optional stop that requires extra travel", () => {
    const result = optimizeItinerary(activities, "less-driving", 3);

    expect(result.activities).toHaveLength(2);
    expect(
      result.activities.some(
        (activity) => activity.title === "Optional scenic stop",
      ),
    ).toBe(false);

    expect(result.newlyRemovedActivity?.title).toBe("Optional scenic stop");
  });

  it("preserves required travel when relaxing the itinerary", () => {
    const result = optimizeItinerary(activities, "relaxed", 3);

    expect(
      result.activities.some(
        (activity) => activity.title === "Arrive in Gothenburg",
      ),
    ).toBe(true);

    expect(result.newlyRemovedActivity?.title).toBe("Optional scenic stop");
  });

  it("does not modify the original activities array", () => {
    const original = activities.map((activity) => ({
      ...activity,
    }));

    optimizeItinerary(activities, "less-driving", 3);

    expect(activities).toEqual(original);
  });

  it("adds a kids activity when the day has none", () => {
    const result = optimizeItinerary(
      activities.filter((activity) => activity.type !== "Kids activity"),
      "kids",
      2,
    );

    expect(
      result.activities.some((activity) => activity.type === "Kids activity"),
    ).toBe(true);
    expect(result.activities).toHaveLength(4);
  });

  it("does not add a duplicate kids activity", () => {
    const dayActivities: Activity[] = [
      ...activities,
      {
        time: "14:00",
        title: "Playground",
        type: "Kids activity",
        icon: "🛝",
        priority: "important",
      },
    ];

    const result = optimizeItinerary(dayActivities, "kids", 2);

    expect(
      result.activities.filter((activity) => activity.type === "Kids activity"),
    ).toHaveLength(1);
  });

  it("changes a meal to a budget-friendly alternative", () => {
    const mealActivities: Activity[] = [
      {
        time: "12:00",
        title: "Family lunch",
        type: "Food",
        icon: "🍽️",
        priority: "important",
      },
    ];

    const result = optimizeItinerary(mealActivities, "cheaper", 2);

    expect(
      result.activities.some(
        (activity) => activity.title === "Budget-friendly picnic lunch",
      ),
    ).toBe(true);

    expect(
      result.activities.find(
        (activity) => activity.title === "Budget-friendly picnic lunch",
      )?.source,
    ).toBe("optimization");
  });

  it("adds a nature activity when the day has none", () => {
    const result = optimizeItinerary(activities, "nature", 2);

    expect(
      result.activities.some((activity) => activity.type === "Nature"),
    ).toBe(true);
    expect(
      result.activities.find((activity) => activity.type === "Nature")?.title,
    ).toBe("Relaxing walk in a Stockholm park");
  });

  it("preserves required activities when relaxing the itinerary", () => {
    const requiredActivities: Activity[] = [
      {
        time: "09:00",
        title: "Depart for Stockholm",
        type: "Travel",
        icon: "🚗",
        priority: "required",
      },
      {
        time: "12:00",
        title: "Visit museum",
        type: "Attraction",
        icon: "🏛️",
        priority: "important",
      },
    ];

    const result = optimizeItinerary(requiredActivities, "relaxed", 2);

    expect(result.activities).toEqual(requiredActivities);
    expect(result.newlyRemovedActivity).toBeNull();
  });

  it("keeps activities sorted by time after optimization", () => {
    const result = optimizeItinerary(activities, "kids", 2);
    const times = result.activities.map((activity) => activity.time);

    expect(times).toEqual([...times].sort());
  });
});
