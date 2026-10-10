export type Activity = {
  time: string;
  title: string;
  type: string;
  icon: string;
  durationMinutes?: number;
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
  changed: boolean;
};

function overlapsExistingActivity(
  candidate: Activity,
  existingActivities: Activity[],
): boolean {
  const candidateStart = timeToMinutes(candidate.time);
  const candidateDuration = candidate.durationMinutes;

  if (candidateStart === null || !candidateDuration || candidateDuration <= 0) {
    return false;
  }

  const candidateEnd = candidateStart + candidateDuration;

  return existingActivities.some((activity) => {
    const existingStart = timeToMinutes(activity.time);
    const existingDuration = activity.durationMinutes;

    if (existingStart === null || !existingDuration || existingDuration <= 0) {
      return false;
    }

    const existingEnd = existingStart + existingDuration;

    return candidateStart < existingEnd && candidateEnd > existingStart;
  });
}

function findAvailableTime(
  candidate: Activity,
  existingActivities: Activity[],
): string | null {
  const duration = candidate.durationMinutes;

  if (!duration || duration <= 0) {
    return null;
  }

  const preferredStart = timeToMinutes(candidate.time);

  if (preferredStart === null) {
    return null;
  }

  // Try the preferred time first, then search in 30-minute increments.
  const candidates = [
    preferredStart,
    ...Array.from({ length: 24 }, (_, index) => {
      const offset = (index + 1) * 30;
      return preferredStart + offset;
    }),
    ...Array.from({ length: 24 }, (_, index) => {
      const offset = (index + 1) * 30;
      return preferredStart - offset;
    }),
  ];

  for (const start of candidates) {
    if (start < 6 * 60 || start + duration > 22 * 60) {
      continue;
    }

    const proposedActivity = {
      ...candidate,
      time: minutesToTime(start),
    };

    if (!overlapsExistingActivity(proposedActivity, existingActivities)) {
      return proposedActivity.time;
    }
  }

  return null;
}

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

  const addedActivities: Activity[] = [];
  function addActivity(activity: Activity) {
    activities.push(activity);
    addedActivities.push(activity);
  }
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
        addActivity({
          time: "20:00",
          title: "Family games on board",
          type: "Kids activity",
          icon: "🎲",
          durationMinutes: 60,
          optional: true,
          priority: "optional",
          source: "optimization",
        });
        message =
          "A family-friendly activity has been added for the ferry journey.";
      } else {
        addActivity({
          time: "15:30",
          title: "Family playground break",
          type: "Kids activity",
          icon: "🛝",
          durationMinutes: 60,
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
        addActivity({
          time: "12:30",
          title: "Bring your own snacks and drinks",
          type: "Budget tip",
          icon: "💰",
          durationMinutes: 60,
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
        addActivity({
          time: "20:00",
          title: "Relax on deck and enjoy the sea views",
          type: "Nature",
          icon: "🌊",
          durationMinutes: 60,
          optional: true,
          priority: "optional",
          source: "optimization",
        });
        message = "A sea-view break has been added to your ferry day.";
      } else if (dayNumber === 2) {
        addActivity({
          time: "15:30",
          title: "Relaxing walk in a Stockholm park",
          type: "Nature",
          icon: "🌳",
          durationMinutes: 60,
          optional: true,
          priority: "optional",
          source: "optimization",
        });
        message =
          "A nature break has been added to your Stockholm day. Check the location and travel time before your trip.";
      } else {
        addActivity({
          time: "14:00",
          title: "Scenic nature break along the route",
          type: "Nature",
          icon: "🌲",
          durationMinutes: 60,
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

  const addedActivity = addedActivities[addedActivities.length - 1];

  if (addedActivity) {
    const existingActivities = activities.filter(
      (activity) => activity !== addedActivity,
    );

    const availableTime = findAvailableTime(addedActivity, existingActivities);

    if (availableTime === null) {
      activities = activities.filter((activity) => activity !== addedActivity);

      message = `The suggested activity "${addedActivity.title}" was not added because no suitable free time was found.`;
    } else if (availableTime !== addedActivity.time) {
      addedActivity.time = availableTime;

      message = `"${addedActivity.title}" was scheduled for ${availableTime} to avoid overlapping with another activity.`;
    }
  }

  activities.sort((a, b) => a.time.localeCompare(b.time));

  const changed =
    JSON.stringify(currentActivities) !== JSON.stringify(activities);

  return {
    activities,
    newlyRemovedActivity,
    message,
    changed,
  };
}

export type ScheduleConflict = {
  firstActivity: string;
  secondActivity: string;
  firstEndsAt: string;
  secondStartsAt: string;
};

export function timeToMinutes(time: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function minutesToTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function findScheduleConflicts(
  activities: Activity[],
): ScheduleConflict[] {
  const scheduled = activities
    .map((activity) => ({
      activity,
      start: timeToMinutes(activity.time),
    }))
    .filter(
      (
        item,
      ): item is {
        activity: Activity;
        start: number;
      } => item.start !== null,
    )
    .sort((a, b) => a.start - b.start);

  const conflicts: ScheduleConflict[] = [];

  for (let i = 0; i < scheduled.length - 1; i++) {
    const current = scheduled[i];
    const next = scheduled[i + 1];

    if (
      current.activity.durationMinutes === undefined ||
      current.activity.durationMinutes <= 0
    ) {
      continue;
    }

    const end = current.start + current.activity.durationMinutes;

    if (end > next.start) {
      conflicts.push({
        firstActivity: current.activity.title,
        secondActivity: next.activity.title,
        firstEndsAt: minutesToTime(end),
        secondStartsAt: next.activity.time,
      });
    }
  }

  return conflicts;
}

export function suggestConflictResolution(
  activities: Activity[],
  conflict: ScheduleConflict,
): Activity[] {
  const firstActivity = activities.find(
    (activity) => activity.title === conflict.firstActivity,
  );

  const nextStart = firstActivity ? timeToMinutes(firstActivity.time) : null;

  if (
    !firstActivity ||
    nextStart === null ||
    firstActivity.durationMinutes === undefined ||
    firstActivity.durationMinutes <= 0
  ) {
    return activities.map((activity) => ({ ...activity }));
  }

  const suggestedTime = minutesToTime(
    nextStart + firstActivity.durationMinutes,
  );

  return activities.map((activity) =>
    activity.title === conflict.secondActivity
      ? { ...activity, time: suggestedTime }
      : { ...activity },
  );
}
