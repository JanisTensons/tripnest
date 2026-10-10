import { describe, expect, it } from "@jest/globals";
import { getAiTip } from "./ai-tips";
import type { Activity } from "./itinerary-optimization";

describe("getAiTip", () => {
  it("suggests a break when the day includes travel", () => {
    const activities: Activity[] = [
      {
        time: "09:00",
        title: "Drive to Gothenburg",
        type: "Travel",
        icon: "🚗",
      },
    ];

    expect(getAiTip(activities)).toContain("travel time");
  });

  it("suggests downtime when the day includes a kids activity", () => {
    const activities: Activity[] = [
      {
        time: "10:00",
        title: "Junibacken",
        type: "Kids activity",
        icon: "🎠",
      },
    ];

    expect(getAiTip(activities)).toContain("downtime");
  });

  it("suggests outdoor flexibility when the day includes nature", () => {
    const activities: Activity[] = [
      {
        time: "14:00",
        title: "Park walk",
        type: "Nature",
        icon: "🌳",
      },
    ];

    expect(getAiTip(activities)).toContain("outdoors");
  });

  it("provides a planning tip for an empty day", () => {
    expect(getAiTip([])).toContain("still open for planning");
  });
});
