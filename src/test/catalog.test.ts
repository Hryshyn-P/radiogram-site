import { describe, expect, it } from "vitest";
import { stationInitial } from "@/lib/stationArtwork";
import { normalizeStation } from "@/lib/radioBrowser";
import { decodeFacetParam, facetPath, podcastPath, slugify, stationPath } from "@/lib/slug";

describe("catalog normalization", () => {
  it("uses the first letter for station artwork and skips digits and symbols", () => {
    expect(stationInitial("101.2 • Radio Kraków")).toBe("R");
    expect(stationInitial("*** 24 Україна")).toBe("У");
    expect(stationInitial("--- 123")).toBe("R");
  });

  it("maps Radio Browser data using the same quality score as the app", () => {
    const station = normalizeStation({
      stationuuid: "9617a958-0601-11e8-ae97-52543be04c81",
      name: " Test FM ",
      url_resolved: "https://example.com/live.mp3",
      country: "Poland",
      language: "Polish",
      codec: "mp3",
      bitrate: 192,
      tags: "rock, news, rock, experimental soundscape, lokalne wiadomości, live sessions",
      votes: 10,
      clickcount: 40,
      lastcheckok: 1,
    });

    expect(station).toMatchObject({
      id: "rb_9617a958-0601-11e8-ae97-52543be04c81",
      name: "Test FM",
      codec: "MP3",
      popularityScore: 282,
      tags: ["rock", "news", "experimental soundscape", "lokalne wiadomości", "live sessions"],
    });
  });

  it("rejects records without a usable UUID or stream", () => {
    expect(normalizeStation({ name: "No stream" })).toBeNull();
  });
});

describe("indexable routes", () => {
  it("creates stable, human-readable radio and podcast paths", () => {
    expect(slugify("Rádio São Paulo!" )).toBe("radio-sao-paulo");
    expect(stationPath("BBC Radio 6", "ABC-123")).toBe("/radio/bbc-radio-6-abc-123");
    expect(podcastPath("The Daily", 123)).toBe("/podcasts/123/the-daily");
  });

  it("keeps the exact API facet value in routes with punctuation and Unicode", () => {
    const values = ["Drum & Bass", "Українська музика", "rock/pop"];
    for (const value of values) {
      const route = facetPath("tag", value);
      expect(decodeFacetParam(route.split("/").at(-1))).toBe(value);
    }
  });
});
