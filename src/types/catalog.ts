export type Station = {
  id: string;
  uuid: string;
  name: string;
  streamUrl: string;
  homepage?: string;
  imageUrl?: string;
  country: string;
  countryCode?: string;
  language?: string;
  codec?: string;
  bitrate: number;
  tags: string[];
  votes: number;
  clickCount: number;
  popularityScore: number;
};

export type StationFilters = {
  query?: string;
  country?: string;
  tag?: string;
  language?: string;
  order?: "votes" | "name" | "clickcount" | "random";
  offset?: number;
  limit?: number;
};

export type CatalogFacet = {
  name: string;
  stationcount: number;
  iso_3166_1?: string;
  iso_639?: string | null;
};

export type PodcastShow = {
  id: number;
  name: string;
  artistName?: string;
  artworkUrl?: string;
  appleUrl?: string;
  genres: string[];
  country?: string;
};

export type PodcastEpisode = {
  id: number;
  showId: number;
  showName: string;
  title: string;
  description?: string;
  audioUrl?: string;
  artworkUrl?: string;
  publishedAt?: string;
  durationMs?: number;
};

export type Playable = {
  id: string;
  kind: "station" | "episode";
  title: string;
  subtitle?: string;
  audioUrl: string;
  artworkUrl?: string;
  pageUrl: string;
};
