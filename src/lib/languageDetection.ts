import type { AppLanguage } from "@/context/LanguageContext";

const COUNTRY_LANGUAGE: Partial<Record<string, AppLanguage>> = {
  CN: "zh-CN",
  DE: "de",
  PL: "pl",
  RU: "ru",
  UA: "uk",
};

export const languageForCountry = (countryCode?: string): AppLanguage =>
  COUNTRY_LANGUAGE[countryCode?.trim().toUpperCase() ?? ""] ?? "en";

export const detectLanguageByCountry = async (signal?: AbortSignal): Promise<AppLanguage> => {
  try {
    const response = await fetch("https://api.country.is/", {
      headers: { Accept: "application/json" },
      signal,
    });
    if (!response.ok) return "en";
    const data = await response.json() as { country?: string };
    return languageForCountry(data.country);
  } catch {
    return "en";
  }
};
