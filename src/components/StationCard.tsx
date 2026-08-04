import { ExternalLink, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlayer } from "@/context/PlayerContext";
import { reportStationClick } from "@/lib/radioBrowser";
import { stationPath } from "@/lib/slug";
import type { Station } from "@/types/catalog";
import { Artwork } from "./Artwork";
import PlaybackLoader from "./PlaybackLoader";
import { useLanguage } from "@/context/LanguageContext";

const StationCard = ({ station, mode = "grid" }: { station: Station; mode?: "grid" | "list" }) => {
  const { current, isPlaying, isLoading, play, toggle } = usePlayer();
  const { t } = useLanguage();
  const path = stationPath(station.name, station.uuid);
  const isCurrent = current?.id === station.id;

  const handlePlay = () => {
    if (isCurrent) {
      toggle();
      return;
    }
    reportStationClick(station.uuid);
    play({
      id: station.id,
      kind: "station",
      title: station.name,
      subtitle: [station.country, station.codec, station.bitrate ? `${station.bitrate} kbps` : ""].filter(Boolean).join(" · "),
      audioUrl: station.streamUrl,
      artworkUrl: station.imageUrl,
      pageUrl: path,
    });
  };

  return (
    <article className={`station-card station-card--${mode} ${isCurrent ? "is-current" : ""}`}>
      <Link to={path} className="station-card__body" aria-label={`${t("openStation")} ${station.name}`}>
        <Artwork src={station.imageUrl} alt={`${station.name} ${t("stationLogo")}`} className="station-card__art" fallbackId={station.id} fallbackTitle={station.name} />
        <span className="station-card__copy">
          <strong>{station.name}</strong>
          <small>{station.country}{station.language ? ` · ${station.language}` : ""}</small>
          <span className="station-card__tags">{station.tags.slice(0, 2).join(" · ")}</span>
        </span>
      </Link>
      <button className="round-button" onClick={handlePlay} aria-label={`${isCurrent && isPlaying ? t("pause") : t("play")} ${station.name}`}>
        {isCurrent && isLoading ? <PlaybackLoader /> : isCurrent && isPlaying ? <Pause /> : <Play />}
      </button>
      {mode === "list" && station.homepage && (
        <a className="station-card__external" href={station.homepage} target="_blank" rel="noreferrer" aria-label={`${station.name} ${t("stationWebsite")}`}>
          <ExternalLink />
        </a>
      )}
    </article>
  );
};

export default StationCard;
