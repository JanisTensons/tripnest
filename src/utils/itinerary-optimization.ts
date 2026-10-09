export type Activity = {
  time: string;
  title: string;
  type: string;
  icon: string;
  optional?: boolean;
  requiresTravel?: boolean;
  priority?: "required" | "important" | "optional";
  source?: "original" | "optimization";
};

export type OptimizationGoal =
  | "less-driving"
  | "kids"
  | "cheaper"
  | "nature"
  | "relaxed";

type OptimizationResult = {
  activities: Activity[];
  newlyRemovedActivity: Activity | null;
  message: string;
};

export function optimizeItinerary(
  currentActivities: Activity[],
  goal: OptimizationGoal,
  dayNumber: number,
): OptimizationResult {
  let activities = currentActivities.map((activity) => ({
    ...activity,
  }));

  let newlyRemovedActivity: Activity | null = null;
  let message = "";

  switch (goal) {
    case "less-driving": {
      const index = activities.findIndex(
        (activity) =>
          activity.priority === "optional" &&
          activity.optional === true &&
          activity.requiresTravel === true &&
          !["Travel", "Transport"].includes(activity.type),
      );

      if (index !== -1) {
        newlyRemovedActivity = { ...activities[index] };
        activities = activities.filter((_, i) => i !== index);
        message = `"${newlyRemovedActivity.title}" was removed because it requires additional travel. Check the revised route and travel time before your trip.`;
      } else {
        message =
          "No optional extra-travel stops are identified for this day. Your itinerary has been kept unchanged.";
      }
      break;
    }

    case "kids": {
      if (activities.some((activity) => activity.type === "Kids activity")) {
        message =
          "This day already includes a kids activity. Keep it in your plan and allow enough time for the family to enjoy it.";
      } else if (dayNumber === 1) {
        activities.push({
          time: "20:00",
          title: "Family games on board",
          type: "Kids activity",
          icon: "🎲",
          optional: true,
          priority: "optional",
          source: "optimization",
        });
        message =
          "A family-friendly activity has been added for the ferry journey.";
      } else {
        activities.push({
          time: "15:30",
          title: "Family playground break",
          type: "Kids activity",
          icon: "🛝",
          optional: true,
          priority: "optional",
          source: "optimization",
        });
        message =
          "A family-friendly activity has been added to your plan. Check travel time and opening hours before your trip.";
      }
      break;
    }

    case "cheaper": {
      const hasBudgetTip = activities.some(
        (activity) =>
          activity.type === "Budget tip" ||
          activity.title.toLowerCase().includes("budget-friendly picnic"),
      );

      if (hasBudgetTip) {
        message =
          "Your plan already includes a budget-friendly suggestion. No additional change was made.";
        break;
      }

      const mealIndex = activities.findIndex(
        (activity) =>
          activity.type === "Food" &&
          (activity.title.toLowerCase().includes("dinner") ||
            activity.title.toLowerCase().includes("lunch")),
      );

      if (mealIndex !== -1) {
        const original = activities[mealIndex];
        const newTitle = original.title.toLowerCase().includes("lunch")
          ? "Budget-friendly picnic lunch"
          : "Budget-friendly picnic dinner";

        activities[mealIndex] = {
          ...original,
          title: newTitle,
          icon: "🥪",
          source: "optimization",
        };

        message = `"${original.title}" was changed to "${newTitle}". This is a budget-friendly alternative; actual savings have not been calculated.`;
      } else {
        activities.push({
          time: "12:30",
          title: "Bring your own snacks and drinks",
          type: "Budget tip",
          icon: "💰",
          optional: true,
          priority: "optional",
          source: "optimization",
        });

        message =
          "A budget tip has been added. Bringing your own snacks and drinks may help reduce food costs.";
      }
      break;
    }

    case "nature": {
      if (activities.some((activity) => activity.type === "Nature")) {
        message =
          "Your plan already includes a nature activity. Keep it and allow enough time to enjoy the outdoors.";
      } else if (dayNumber === 1) {
        activities.push({
          time: "20:00",
          title: "Relax on deck and enjoy the sea views",
          type: "Nature",
          icon: "🌊",
          optional: true,
          priority: "optional",
          source: "optimization",
        });
        message = "A sea-view break has been added to your ferry day.";
      } else if (dayNumber === 2) {
        activities.push({
          time: "15:30",
          title: "Relaxing walk in a Stockholm park",
          type: "Nature",
          icon: "🌳",
          optional: true,
          priority: "optional",
          source: "optimization",
        });
        message =
          "A nature break has been added to your Stockholm day. Check the location and travel time before your trip.";
      } else {
        activities.push({
          time: "14:00",
          title: "Scenic nature break along the route",
          type: "Nature",
          icon: "🌲",
          optional: true,
          requiresTravel: true,
          priority: "optional",
          source: "optimization",
        });
        message =
          "A nature break has been added to your road-trip plan. Confirm that the stop fits your route before travelling.";
      }
      break;
    }

    case "relaxed": {
      const index = activities.findLastIndex(
        (activity) =>
          activity.priority === "optional" &&
          activity.optional === true &&
          !["Travel", "Transport"].includes(activity.type) &&
          !activity.title.toLowerCase().includes("arrive") &&
          !activity.title.toLowerCase().includes("depart"),
      );

      if (index !== -1) {
        newlyRemovedActivity = { ...activities[index] };
        activities = activities.filter((_, i) => i !== index);
        message = `"${newlyRemovedActivity.title}" was removed to create more free time. Required travel, important activities and meal breaks have been preserved.`;
      } else {
        message =
          "No activities marked as optional can be removed. Your current itinerary has been preserved.";
      }
      break;
    }
  }

  activities.sort((a, b) => a.time.localeCompare(b.time));

  return {
    activities,
    newlyRemovedActivity,
    message,
  };
}
