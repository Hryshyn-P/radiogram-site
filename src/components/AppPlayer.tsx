import { Download, Pause, Play, Volume2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlayer } from "@/context/PlayerContext";
import { Artwork } from "./Artwork";
import PlaybackLoader from "./PlaybackLoader";
import { useLanguage } from "@/context/LanguageContext";

export const APP_STORE_URL = "https://apps.apple.com/app/id6772640690";

const AppPlayer = () => {
  const { current, isPlaying, isLoading, error, volume, toggle, setVolume, stop } = usePlayer();
  const { t } = useLanguage();
  if (!current) return null;

  return (
    <aside className="app-player" aria-label={t("nowPlaying")}>
      <div className="app-player__inner">
        <Link to={current.pageUrl} className="app-player__track">
          <Artwork src={current.artworkUrl} alt="" className="app-player__art" fallbackId={current.kind === "station" ? current.id : undefined} fallbackTitle={current.kind === "station" ? current.title : undefined} />
          <span>
            <strong>{current.title}</strong>
            <small>{error || current.subtitle || (current.kind === "station" ? t("liveRadio") : t("podcastEpisode"))}</small>
          </span>
        </Link>
        <div className="app-player__controls">
          <a className="player-download" href={APP_STORE_URL} target="_blank" rel="noreferrer">
            <Download /> <span>{t("getTheApp")}</span>
          </a>
          <button className="round-button round-button--primary" onClick={toggle} aria-label={isPlaying ? t("pause") : t("play")}>
            {isLoading ? <PlaybackLoader /> : isPlaying ? <Pause /> : <Play />}
          </button>
          <label className="volume-control" aria-label={t("volume")}>
            <Volume2 />
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
          </label>
          <button className="icon-button" onClick={stop} aria-label={t("closePlayer")}><X /></button>
        </div>
      </div>
    </aside>
  );
};

export default AppPlayer;
