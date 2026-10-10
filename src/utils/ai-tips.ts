import type { Activity } from "./itinerary-optimization";

export function getAiTip(activities: Activity[]): string {
  if (activities.length === 0) {
    return "Your day is still open for planning. Add a few activities to create a family-friendly itinerary.";
  }

  const hasTravel = activities.some(
    (activity) => activity.type === "Travel" || activity.type === "Transport",
  );

  const hasKidsActivity = activities.some(
    (activity) => activity.type === "Kids activity",
  );

  const hasNature = activities.some((activity) => activity.type === "Nature");

  const hasFood = activities.some((activity) => activity.type === "Food");

  if (hasTravel) {
    return "Allow some flexibility around travel time and plan a short break so the family can recharge along the way.";
  }

  if (hasKidsActivity) {
    return "Keep some downtime around the kids' activities and bring snacks and drinks to make the day easier for everyone.";
  }

  if (hasNature) {
    return "Leave room to enjoy the outdoors without rushing. Comfortable shoes and a little extra time can make the stop more enjoyable.";
  }

  if (hasFood) {
    return "Plan a relaxed meal break and leave some flexibility in the schedule in case the family wants to explore along the way.";
  }

  return "Choose one main attraction to focus on and leave some free time for spontaneous family discoveries.";
}
