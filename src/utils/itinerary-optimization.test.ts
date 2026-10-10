import { describe, expect, it } from "@jest/globals";
import {
  findScheduleConflicts,
  optimizeItinerary,
  suggestConflictResolution,
  timeToMinutes,
  type Activity,
} from "./itinerary-optimization";

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

  it("detects overlapping activities using their durations", () => {
    const scheduledActivities: Activity[] = [
      {
        time: "10:30",
        title: "Vasa Museum",
        type: "Attraction",
        icon: "🏛️",
        durationMinutes: 120,
      },
      {
        time: "12:00",
        title: "Lunch",
        type: "Food",
        icon: "🍽️",
        durationMinutes: 60,
      },
    ];

    const conflicts = findScheduleConflicts(scheduledActivities);

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toEqual({
      firstActivity: "Vasa Museum",
      secondActivity: "Lunch",
      firstEndsAt: "12:30",
      secondStartsAt: "12:00",
    });
  });

  it("suggests moving the next activity to the previous activity's end", () => {
    const scheduledActivities: Activity[] = [
      {
        time: "10:30",
        title: "Vasa Museum",
        type: "Attraction",
        icon: "🏛️",
        durationMinutes: 120,
      },
      {
        time: "12:00",
        title: "Lunch",
        type: "Food",
        icon: "🍽️",
        durationMinutes: 60,
      },
    ];

    const conflicts = findScheduleConflicts(scheduledActivities);

    const suggested = suggestConflictResolution(
      scheduledActivities,
      conflicts[0],
    );

    expect(suggested.find((activity) => activity.title === "Lunch")?.time).toBe(
      "12:30",
    );

    expect(scheduledActivities[1].time).toBe("12:00");
  });
  it("detects overlapping activities", () => {
    const activities: Activity[] = [
      {
        time: "10:30",
        title: "Vasa Museum",
        type: "Attraction",
        icon: "🏛️",
        durationMinutes: 120,
      },
      {
        time: "11:30",
        title: "Junibacken",
        type: "Kids activity",
        icon: "🎠",
      },
    ];

    expect(findScheduleConflicts(activities)).toEqual([
      {
        firstActivity: "Vasa Museum",
        secondActivity: "Junibacken",
        firstEndsAt: "12:30",
        secondStartsAt: "11:30",
      },
    ]);
  });
  it("does not add duplicate nature activities when optimization is repeated", () => {
    const firstResult = optimizeItinerary(activities, "nature", 2);
    const secondResult = optimizeItinerary(firstResult.activities, "nature", 2);

    expect(
      secondResult.activities.filter((activity) => activity.type === "Nature"),
    ).toHaveLength(1);
  });

  it("does not add duplicate budget tips when optimization is repeated", () => {
    const firstResult = optimizeItinerary(activities, "cheaper", 2);
    const secondResult = optimizeItinerary(
      firstResult.activities,
      "cheaper",
      2,
    );

    expect(
      secondResult.activities.filter(
        (activity) =>
          activity.type === "Budget tip" ||
          activity.title.toLowerCase().includes("budget-friendly picnic"),
      ),
    ).toHaveLength(1);
  });

  it("reschedules a nature activity when its preferred time overlaps", () => {
    const activities: Activity[] = [
      {
        time: "15:00",
        title: "Family activity",
        type: "Attraction",
        icon: "🎡",
        durationMinutes: 90,
      },
    ];

    const result = optimizeItinerary(activities, "nature", 2);

    const natureActivity = result.activities.find(
      (activity) => activity.type === "Nature",
    );

    expect(natureActivity).toBeDefined();
    expect(natureActivity?.time).not.toBe("15:30");
    expect(result.message).toContain("scheduled for");

    expect(
      result.activities.some(
        (activity) =>
          activity.title === "Family activity" && activity.time === "15:00",
      ),
    ).toBe(true);
  });

  it("preserves required travel when optimizing for less driving", () => {
    const activities: Activity[] = [
      {
        time: "09:00",
        title: "Drive to Gothenburg",
        type: "Travel",
        icon: "🚗",
        optional: false,
        priority: "required",
        requiresTravel: true,
      },
      {
        time: "12:00",
        title: "Optional scenic detour",
        type: "Attraction",
        icon: "📍",
        optional: true,
        priority: "optional",
        requiresTravel: true,
      },
    ];

    const result = optimizeItinerary(activities, "less-driving", 3);

    expect(
      result.activities.some(
        (activity) => activity.title === "Drive to Gothenburg",
      ),
    ).toBe(true);

    expect(
      result.activities.some(
        (activity) => activity.title === "Optional scenic detour",
      ),
    ).toBe(false);
  });

  it("preserves required travel when optimizing for a relaxed day", () => {
    const activities: Activity[] = [
      {
        time: "09:00",
        title: "Drive to Gothenburg",
        type: "Travel",
        icon: "🚗",
        optional: false,
        priority: "required",
        requiresTravel: true,
      },
      {
        time: "12:00",
        title: "Optional sightseeing stop",
        type: "Attraction",
        icon: "📍",
        optional: true,
        priority: "optional",
      },
    ];

    const result = optimizeItinerary(activities, "relaxed", 3);

    expect(
      result.activities.some(
        (activity) => activity.title === "Drive to Gothenburg",
      ),
    ).toBe(true);

    expect(
      result.activities.some(
        (activity) => activity.title === "Optional sightseeing stop",
      ),
    ).toBe(false);
  });
  it("does not add a nature activity when no suitable time is available", () => {
    const activities: Activity[] = [
      {
        time: "06:00",
        title: "Early activity",
        type: "Attraction",
        icon: "🎡",
        durationMinutes: 960,
      },
    ];

    const result = optimizeItinerary(activities, "nature", 2);

    expect(
      result.activities.some((activity) => activity.type === "Nature"),
    ).toBe(false);

    expect(result.message).toContain("no suitable free time");

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0].title).toBe("Early activity");
  });
  it("does not change existing activity times when adding a nature activity", () => {
    const activities: Activity[] = [
      {
        time: "09:00",
        title: "Morning museum visit",
        type: "Museum",
        icon: "🏛️",
        durationMinutes: 120,
      },
      {
        time: "12:00",
        title: "Family lunch",
        type: "Food",
        icon: "🍽️",
        durationMinutes: 60,
      },
    ];

    const result = optimizeItinerary(activities, "nature", 2);

    expect(
      result.activities.find(
        (activity) => activity.title === "Morning museum visit",
      )?.time,
    ).toBe("09:00");

    expect(
      result.activities.find((activity) => activity.title === "Family lunch")
        ?.time,
    ).toBe("12:00");
  });
  it("does not introduce new overlaps when adding a kids activity", () => {
    const activities: Activity[] = [
      {
        time: "09:00",
        title: "Museum visit",
        type: "Museum",
        icon: "🏛️",
        durationMinutes: 120,
      },
      {
        time: "12:00",
        title: "Family lunch",
        type: "Food",
        icon: "🍽️",
        durationMinutes: 60,
      },
    ];

    const result = optimizeItinerary(activities, "kids", 2);

    const newActivity = result.activities.find(
      (activity) => activity.type === "Kids activity",
    );

    expect(newActivity).toBeDefined();

    expect(
      result.activities.some(
        (activity) =>
          activity.title === "Museum visit" && activity.time === "09:00",
      ),
    ).toBe(true);

    expect(
      result.activities.some(
        (activity) =>
          activity.title === "Family lunch" && activity.time === "12:00",
      ),
    ).toBe(true);
  });
  it("schedules a kids activity without overlapping existing activities", () => {
    const activities: Activity[] = [
      {
        time: "15:00",
        title: "Family attraction",
        type: "Attraction",
        icon: "🎡",
        durationMinutes: 120,
      },
    ];

    const result = optimizeItinerary(activities, "kids", 2);

    const kidsActivity = result.activities.find(
      (activity) => activity.type === "Kids activity",
    );

    expect(kidsActivity).toBeDefined();

    const kidsStart = timeToMinutes(kidsActivity!.time)!;
    const kidsEnd = kidsStart + kidsActivity!.durationMinutes!;

    const attractionStart = timeToMinutes("15:00")!;
    const attractionEnd = attractionStart + 120;

    expect(kidsStart >= attractionEnd || kidsEnd <= attractionStart).toBe(true);
  });
  it("returns a clear message when no nature activity can be added", () => {
    const activities: Activity[] = [
      {
        time: "06:00",
        title: "Early activity",
        type: "Attraction",
        icon: "🎡",
        durationMinutes: 960,
      },
    ];

    const result = optimizeItinerary(activities, "nature", 2);

    expect(result.message).toContain("no suitable free time");
    expect(
      result.activities.some((activity) => activity.type === "Nature"),
    ).toBe(false);
  });
});
