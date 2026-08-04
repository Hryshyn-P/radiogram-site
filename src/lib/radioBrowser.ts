import type { CatalogFacet, Station, StationFilters } from "@/types/catalog";
import { readCache, writeCache } from "./storage";

// Browsers own the User-Agent header and do not allow JavaScript to replace it.
// Native Radiogram sends Radiogram/<version>; the web client intentionally uses
// the browser's truthful UA and identifies the product through its origin.
const API_HOSTS = [
  "https://all.api.radio-browser.info",
  "https://de1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
];
const CATALOG_TTL = 12 * 60 * 60 * 1000;

type RadioBrowserStation = {
  stationuuid?: string;
  name?: string;
  url?: string;
  url_resolved?: string;
  homepage?: string;
  favicon?: string;
  tags?: string;
  country?: string;
  countrycode?: string;
  language?: string;
  codec?: string;
  bitrate?: number;
  votes?: number;
  clickcount?: number;
  lastcheckok?: number;
};

const fetchFromMirror = async <T>(path: string, params?: URLSearchParams): Promise<T> => {
  let lastError: unknown;
  for (const host of API_HOSTS) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch(`${host}${path}${params ? `?${params}` : ""}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Radio Browser returned ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
    } finally {
      window.clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Radio Browser is unavailable");
};

export const normalizeStation = (item: RadioBrowserStation, index = 0): Station | null => {
  const uuid = item.stationuuid?.trim().toLowerCase();
  const streamUrl = item.url_resolved?.trim() || item.url?.trim();
  if (!uuid || !streamUrl || !/^https?:\/\//i.test(streamUrl)) return null;

  const name = item.name?.trim() || `Radio ${index + 1}`;
  const country = item.country?.trim() || "Global";
  const tags = (item.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag, tagIndex, allTags) => allTags.findIndex((candidate) => candidate.toLocaleLowerCase() === tag.toLocaleLowerCase()) === tagIndex);
  const votes = item.votes || 0;
  const clickCount = item.clickcount || 0;
  const bitrate = item.bitrate || 0;

  return {
    id: `rb_${uuid}`,
    uuid,
    name,
    streamUrl,
    homepage: item.homepage?.trim() || undefined,
    imageUrl: item.favicon?.trim() || undefined,
    country,
    countryCode: item.countrycode?.trim() || undefined,
    language: item.language?.trim() || undefined,
    codec: item.codec?.trim().toUpperCase() || undefined,
    bitrate,
    tags,
    votes,
    clickCount,
    popularityScore: votes * 5 + clickCount + Math.min(bitrate, 320) + (item.lastcheckok === 1 ? 0 : -500),
  };
};

export const fetchStations = async (filters: StationFilters = {}): Promise<Station[]> => {
  const params = new URLSearchParams({
    hidebroken: "true",
    order: filters.order || "votes",
    reverse: filters.order === "name" || filters.order === "random" ? "false" : "true",
    limit: String(filters.limit || 48),
    offset: String(filters.offset || 0),
  });
  if (filters.query?.trim()) params.set("name", filters.query.trim());
  if (filters.country) {
    params.set("country", filters.country);
    params.set("countryExact", "true");
  }
  if (filters.tag) {
    params.set("tag", filters.tag);
    params.set("tagExact", "true");
  }
  if (filters.language) {
    params.set("language", filters.language);
    params.set("languageExact", "true");
  }

  const cacheKey = `stations.v2.${params.toString()}`;
  const cached = readCache<Station[]>(cacheKey, CATALOG_TTL);
  if (cached) return cached;
  const raw = await fetchFromMirror<RadioBrowserStation[]>("/json/stations/search", params);
  const stations = raw.map(normalizeStation).filter((station): station is Station => Boolean(station));
  writeCache(cacheKey, stations);
  return stations;
};

export const fetchStation = async (uuid: string): Promise<Station | null> => {
  const key = `station.v2.${uuid}`;
  const cached = readCache<Station>(key, CATALOG_TTL);
  if (cached) return cached;
  const params = new URLSearchParams({ uuids: uuid });
  const raw = await fetchFromMirror<RadioBrowserStation[]>("/json/stations/byuuid", params);
  const station = raw.length ? normalizeStation(raw[0]) : null;
  if (station) writeCache(key, station);
  return station;
};

const fetchFacets = async (kind: "countries" | "tags" | "languages", limit = 100_000): Promise<CatalogFacet[]> => {
  const cacheKey = `facets.${kind}.${limit}.v1`;
  const cached = readCache<CatalogFacet[]>(cacheKey, CATALOG_TTL);
  if (cached) return cached;
  const params = new URLSearchParams({ order: "stationcount", reverse: "true", hidebroken: "true", limit: String(limit) });
  const facets = await fetchFromMirror<CatalogFacet[]>(`/json/${kind}`, params);
  const normalized = facets
    .map((item) => ({ ...item, name: item.name?.trim(), stationcount: Number(item.stationcount) || 0 }))
    .filter((item): item is CatalogFacet => Boolean(item.name) && item.stationcount > 0);
  writeCache(cacheKey, normalized);
  return normalized;
};

export const fetchCountries = () => fetchFacets("countries");

export const fetchTags = (limit = 100_000) => fetchFacets("tags", limit);

export const fetchLanguages = () => fetchFacets("languages");

export const reportStationClick = (uuid: string) => {
  fetchFromMirror(`/json/url/${encodeURIComponent(uuid)}`).catch(() => undefined);
};
