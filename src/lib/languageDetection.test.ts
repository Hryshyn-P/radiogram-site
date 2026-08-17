import { describe, expect, it } from "vitest";
import { languageForCountry } from "./languageDetection";

describe("languageForCountry", () => {
  it.each([
    ["CN", "zh-CN"],
    ["DE", "de"],
    ["PL", "pl"],
    ["RU", "ru"],
    ["UA", "uk"],
  ])("maps %s to %s", (country, language) => {
    expect(languageForCountry(country)).toBe(language);
  });

  it("uses English for unsupported or missing countries", () => {
    expect(languageForCountry("FR")).toBe("en");
    expect(languageForCountry()).toBe("en");
  });
});
