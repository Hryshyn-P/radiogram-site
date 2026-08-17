import type { PodcastEpisode, PodcastShow } from "@/types/catalog";
import { readCache, writeCache } from "./storage";

const SEARCH_TTL = 12 * 60 * 60 * 1000;
const EPISODE_TTL = 30 * 60 * 1000;

type AppleResult = {
  wrapperType?: string;
  kind?: string;
  collectionId?: number;
  collectionName?: string;
  artistName?: string;
  feedUrl?: string;
  artworkUrl600?: string;
  artworkUrl100?: string;
  collectionViewUrl?: string;
  genres?: string[];
  country?: string;
  trackId?: number;
  trackName?: string;
  episodeUrl?: string;
  episodeContentType?: string;
  description?: string;
  shortDescription?: string;
  releaseDate?: string;
  trackTimeMillis?: number;
};

type AppleResponse = { resultCount: number; results: AppleResult[] };

const jsonp = <T>(baseUrl: string, params: URLSearchParams): Promise<T> =>
  new Promise((resolve, reject) => {
    const callback = `radiogramApple_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => finish(new Error("Apple Podcasts request timed out")), 15_000);

    const finish = (error?: Error, value?: T) => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
      if (error) reject(error);
      else resolve(value as T);
    };

    (window as unknown as Record<string, unknown>)[callback] = (value: T) => finish(undefined, value);
    script.onerror = () => finish(new Error("Apple Podcasts is unavailable"));
    params.set("callback", callback);
    script.src = `${baseUrl}?${params}`;
    document.head.appendChild(script);
  });

const toShow = (result: AppleResult): PodcastShow | null => {
  if (!result.collectionId || !result.collectionName) return null;
  return {
    id: result.collectionId,
    name: result.collectionName,
    artistName: result.artistName,
    artworkUrl: result.artworkUrl600 || result.artworkUrl100,
    appleUrl: result.collectionViewUrl,
    genres: result.genres || [],
    country: result.country,
  };
};

export const searchPodcasts = async (term: string, country: string): Promise<PodcastShow[]> => {
  const normalized = term.trim();
  if (normalized.length < 2) return [];
  const key = `podcasts.${country}.${normalized.toLowerCase()}`;
  const cached = readCache<PodcastShow[]>(key, SEARCH_TTL);
  if (cached) return cached;
  const params = new URLSearchParams({
    term: normalized,
    media: "podcast",
    entity: "podcast",
    limit: "100",
    country: country.toUpperCase(),
  });
  const response = await jsonp<AppleResponse>("https://itunes.apple.com/search", params);
  const shows = response.results.map(toShow).filter((show): show is PodcastShow => Boolean(show));
  writeCache(key, shows);
  return shows;
};

export const lookupPodcast = async (id: number, labels = { podcast: "Podcast", untitledEpisode: "Untitled episode" }): Promise<{ show: PodcastShow | null; episodes: PodcastEpisode[] }> => {
  const key = `podcast.${id}`;
  const cached = readCache<{ show: PodcastShow | null; episodes: PodcastEpisode[] }>(key, EPISODE_TTL);
  if (cached) return cached;
  const params = new URLSearchParams({ id: String(id), entity: "podcastEpisode", limit: "200" });
  const response = await jsonp<AppleResponse>("https://itunes.apple.com/lookup", params);
  const show = response.results.map(toShow).find(Boolean) || null;
  const episodes = response.results
    .filter((item) => item.trackId && item.episodeUrl && (item.kind === "podcast-episode" || item.wrapperType === "podcastEpisode"))
    .map((item) => ({
      id: item.trackId!,
      showId: item.collectionId || id,
      showName: item.collectionName || show?.name || labels.podcast,
      title: item.trackName || labels.untitledEpisode,
      description: item.description || item.shortDescription,
      audioUrl: item.episodeUrl,
      artworkUrl: item.artworkUrl600 || item.artworkUrl100 || show?.artworkUrl,
      publishedAt: item.releaseDate,
      durationMs: item.trackTimeMillis,
    }));
  const value = { show, episodes };
  writeCache(key, value);
  return value;
};
