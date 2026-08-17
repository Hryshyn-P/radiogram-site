import { useEffect, useState } from "react";
import { ArrowLeft, Download, ExternalLink, Headphones, LoaderCircle, Pause, Play, Radio, Share2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { APP_STORE_URL } from "@/components/AppPlayer";
import { Artwork } from "@/components/Artwork";
import PlaybackLoader from "@/components/PlaybackLoader";
import StationCard from "@/components/StationCard";
import { usePlayer } from "@/context/PlayerContext";
import { fetchStation, fetchStations, reportStationClick } from "@/lib/radioBrowser";
import { shareOrCopy, stationShareData } from "@/lib/share";
import { stationPath } from "@/lib/slug";
import { useSeo } from "@/lib/seo";
import type { Station } from "@/types/catalog";
import { useLanguage } from "@/context/LanguageContext";

const UUID_PATTERN = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

const StationDetails = () => {
  const { slug = "" } = useParams();
  const location = useLocation();
  const uuid = slug.match(UUID_PATTERN)?.[1] || "";
  const [station, setStation] = useState<Station | null>(null);
  const [related, setRelated] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { current, isPlaying, isLoading, play, toggle } = usePlayer();
  const { t } = useLanguage();

  useSeo({
    title: station ? `${station.name} — ${t("listenOnline")} | Radiogram` : t("stationSeoTitle"),
    description: station
      ? `${t("listenTo")} ${station.name} — ${t("liveFrom")} ${station.country}. ${[station.language, station.codec, station.bitrate ? `${station.bitrate} kbps` : ""].filter(Boolean).join(", ")}. ${t("freeOnlineRadio")}`
      : t("stationSeoDescription"),
    path: location.pathname,
    image: station?.imageUrl,
    type: "music.radio_station",
    noIndex: !uuid,
  });

  useEffect(() => {
    if (!uuid) { setError(true); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    fetchStation(uuid)
      .then(async (value) => {
        if (cancelled || !value) { if (!cancelled) setError(true); return; }
        setStation(value);
        const similar = await fetchStations({ country: value.country, tag: value.tags[0], limit: 8 });
        if (!cancelled) setRelated(similar.filter((item) => item.id !== value.id).slice(0, 6));
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [uuid]);

  if (loading) return <div className="loading-state page-shell"><LoaderCircle className="spin" /><p>{t("findingStation")}</p></div>;
  if (error || !station) return <div className="empty-state page-shell"><Radio /><h1>{t("stationNotFound")}</h1><p>{t("stationUnavailableBody")}</p><Link className="primary-button" to="/radio">{t("exploreRadio")}</Link></div>;

  const isCurrent = current?.id === station.id;
  const handlePlay = () => {
    if (isCurrent) return toggle();
    reportStationClick(station.uuid);
    play({
      id: station.id, kind: "station", title: station.name,
      subtitle: [station.country, station.codec, station.bitrate ? `${station.bitrate} kbps` : ""].filter(Boolean).join(" · "),
      audioUrl: station.streamUrl, artworkUrl: station.imageUrl, pageUrl: stationPath(station.name, station.uuid),
    });
  };
  const share = async () => {
    await shareOrCopy(stationShareData(station.name, station.id));
  };

  return (
    <div className="station-detail page-shell">
      <Link to="/radio" className="back-link"><ArrowLeft /> {t("allStations")}</Link>
      <section className="station-hero">
        <div className="station-hero__visual">
          <span className="station-hero__vinyl" aria-hidden="true" />
          <Artwork src={station.imageUrl} alt={`${station.name} ${t("stationLogo")}`} className="station-hero__art" fallbackId={station.id} fallbackTitle={station.name} />
        </div>
        <div className="station-hero__copy">
          <span className="eyebrow">{t("liveFrom")} {station.country}</span>
          <h1>{station.name}</h1>
          <p>{[station.language, station.codec, station.bitrate ? `${station.bitrate} kbps` : t("liveStream")].filter(Boolean).join(" · ")}</p>
          <div className="station-hero__tags">{station.tags.slice(0, 5).map((tag) => <Link key={tag} to={`/radio?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
          <div className="station-hero__actions">
            <button className="primary-button primary-button--large" onClick={handlePlay}>{isCurrent && isLoading ? <PlaybackLoader /> : isCurrent && isPlaying ? <Pause /> : <Play />} {isCurrent && isPlaying ? t("pause") : t("listenLive")}</button>
            <button className="secondary-button" onClick={share}><Share2 /> {t("share")}</button>
            {station.homepage && <a className="secondary-button" href={station.homepage} target="_blank" rel="noreferrer"><ExternalLink /> {t("website")}</a>}
          </div>
        </div>
      </section>

      <section className="app-upsell">
        <div className="app-upsell__icon"><Headphones /></div>
        <div><span className="eyebrow">{t("takeItWithYou")}</span><h2>{t("moreListeningApp")}</h2><p>{t("stationAppBody")}</p></div>
        <a className="primary-button download-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer"><Download /> {t("download")}</a>
      </section>

      {related.length > 0 && <section className="related-section"><div className="section-heading"><div><span className="eyebrow">{t("keepExploring")}</span><h2>{t("moreFrom")} {station.country}</h2></div><Link to={`/radio?country=${encodeURIComponent(station.country)}`}>{t("seeAll")}</Link></div><div className="station-results station-results--grid">{related.map((item) => <StationCard key={item.id} station={item} />)}</div></section>}
    </div>
  );
};

export default StationDetails;
