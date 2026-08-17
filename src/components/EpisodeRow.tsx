import { Pause, Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import type { PodcastEpisode, PodcastShow } from "@/types/catalog";
import { podcastPath } from "@/lib/slug";
import { Artwork } from "./Artwork";
import PlaybackLoader from "./PlaybackLoader";
import { useLanguage } from "@/context/LanguageContext";

const formatDuration = (durationMs: number | undefined, hour: string, minute: string) => {
  if (!durationMs) return "";
  const minutes = Math.round(durationMs / 60_000);
  return minutes >= 60 ? `${Math.floor(minutes / 60)} ${hour} ${minutes % 60} ${minute}` : `${minutes} ${minute}`;
};

const EpisodeRow = ({ episode, show }: { episode: PodcastEpisode; show: PodcastShow }) => {
  const { current, isPlaying, isLoading, play, toggle } = usePlayer();
  const { locale, t } = useLanguage();
  const id = `podcast_episode_${episode.id}`;
  const isCurrent = current?.id === id;
  const date = episode.publishedAt
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(episode.publishedAt))
    : "";

  const handlePlay = () => {
    if (isCurrent) return toggle();
    if (!episode.audioUrl) return;
    play({
      id,
      kind: "episode",
      title: episode.title,
      subtitle: show.name,
      audioUrl: episode.audioUrl,
      artworkUrl: episode.artworkUrl || show.artworkUrl,
      pageUrl: podcastPath(show.name, show.id),
    });
  };

  return (
    <article className={`episode-row ${isCurrent ? "is-current" : ""}`}>
      <Artwork src={episode.artworkUrl || show.artworkUrl} alt="" className="episode-row__art" />
      <div className="episode-row__copy">
        <strong>{episode.title}</strong>
        <small>{[date, formatDuration(episode.durationMs, t("hourShort"), t("minuteShort"))].filter(Boolean).join(" · ")}</small>
        {episode.description && <p>{episode.description}</p>}
      </div>
      <button className="round-button" onClick={handlePlay} disabled={!episode.audioUrl} aria-label={`${isCurrent && isPlaying ? t("pause") : t("play")} ${episode.title}`}>
        {isCurrent && isLoading ? <PlaybackLoader /> : isCurrent && isPlaying ? <Pause /> : <Play />}
      </button>
    </article>
  );
};

export default EpisodeRow;
