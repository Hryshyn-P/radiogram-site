import { describe, expect, it } from "vitest";
import { appLanguages, translations } from "./LanguageContext";
import { extraTranslations } from "./extraTranslations";

describe("translations", () => {
  it("has every base translation in every supported language", () => {
    const expected = Object.keys(translations.en).sort();
    for (const { code } of appLanguages) expect(Object.keys(translations[code]).sort()).toEqual(expected);
  });

  it("has every extended translation in every supported language", () => {
    const expected = Object.keys(extraTranslations.en).sort();
    for (const { code } of appLanguages) expect(Object.keys(extraTranslations[code]).sort()).toEqual(expected);
  });

  it("does not contain blank translations", () => {
    for (const { code } of appLanguages) {
      for (const value of [...Object.values(translations[code]), ...Object.values(extraTranslations[code])]) {
        expect(value.trim()).not.toBe("");
      }
    }
  });
});
