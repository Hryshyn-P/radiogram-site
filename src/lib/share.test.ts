import { afterEach, describe, expect, it, vi } from "vitest";
import { podcastShareData, shareOrCopy, stationShareData } from "@/lib/share";

const originalShare = navigator.share;

afterEach(() => {
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: originalShare,
  });
});

describe("Radiogram universal-link sharing", () => {
  it("builds the station link format handled by the iOS app", () => {
    expect(stationShareData("Dance Wave!", "rb_962cc6df-0601-11e8-ae97-52543be04c81")).toEqual({
      title: "Dance Wave!",
      text: "📻 Listen to Dance Wave! on Radiogram 🎶",
      url: "https://radiogramapp.duckdns.org/station/rb_962cc6df-0601-11e8-ae97-52543be04c81",
    });
  });

  it("builds the podcast link format handled by the iOS app", () => {
    expect(podcastShareData("The Daily", 1200361736)).toEqual({
      title: "The Daily",
      text: "🎙️ Listen to The Daily on Radiogram FM 🎧",
      url: "https://radiogramapp.duckdns.org/podcast/1200361736",
    });
  });

  it("shares the promo text above the universal link as one message", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    const data = stationShareData("Dance Wave!", "rb_station-id");

    await shareOrCopy(data);

    expect(share).toHaveBeenCalledWith({
      title: "Dance Wave!",
      text:
        "📻 Listen to Dance Wave! on Radiogram 🎶\n\nhttps://radiogramapp.duckdns.org/station/rb_station-id",
    });
  });
});
