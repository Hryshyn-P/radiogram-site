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

  useSeo({
    title: station ? `${station.name} live — listen online | Radiogram` : "Live radio station | Radiogram",
    description: station
      ? `Listen to ${station.name} live from ${station.country}. ${[station.language, station.codec, station.bitrate ? `${station.bitrate} kbps` : ""].filter(Boolean).join(", ")}. Free online radio in Radiogram.`
      : "Listen to this live internet radio station free in Radiogram.",
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

  if (loading) return <div className="loading-state page-shell"><LoaderCircle className="spin" /><p>Finding the station…</p></div>;
  if (error || !station) return <div className="empty-state page-shell"><Radio /><h1>Station not found</h1><p>This station may have moved or stopped broadcasting.</p><Link className="primary-button" to="/radio">Explore live radio</Link></div>;

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
      <Link to="/radio" className="back-link"><ArrowLeft /> All stations</Link>
      <section className="station-hero">
        <div className="station-hero__visual">
          <span className="station-hero__vinyl" aria-hidden="true" />
          <Artwork src={station.imageUrl} alt={`${station.name} logo`} className="station-hero__art" fallbackId={station.id} fallbackTitle={station.name} />
        </div>
        <div className="station-hero__copy">
          <span className="eyebrow">Live from {station.country}</span>
          <h1>{station.name}</h1>
          <p>{[station.language, station.codec, station.bitrate ? `${station.bitrate} kbps` : "Live stream"].filter(Boolean).join(" · ")}</p>
          <div className="station-hero__tags">{station.tags.slice(0, 5).map((tag) => <Link key={tag} to={`/radio?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
          <div className="station-hero__actions">
            <button className="primary-button primary-button--large" onClick={handlePlay}>{isCurrent && isLoading ? <PlaybackLoader /> : isCurrent && isPlaying ? <Pause /> : <Play />} {isCurrent && isPlaying ? "Pause" : "Listen live"}</button>
            <button className="secondary-button" onClick={share}><Share2 /> Share</button>
            {station.homepage && <a className="secondary-button" href={station.homepage} target="_blank" rel="noreferrer"><ExternalLink /> Website</a>}
          </div>
        </div>
      </section>

      <section className="app-upsell">
        <div className="app-upsell__icon"><Headphones /></div>
        <div><span className="eyebrow">Take it with you</span><h2>More listening in the Radiogram app.</h2><p>Save favorite stations, recognize songs, keep your history, and listen with native Lock Screen controls on iPhone, iPad, and Mac.</p></div>
        <a className="primary-button download-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer"><Download /> Download</a>
      </section>

      {related.length > 0 && <section className="related-section"><div className="section-heading"><div><span className="eyebrow">Keep exploring</span><h2>More from {station.country}</h2></div><Link to={`/radio?country=${encodeURIComponent(station.country)}`}>See all</Link></div><div className="station-results station-results--grid">{related.map((item) => <StationCard key={item.id} station={item} />)}</div></section>}
    </div>
  );
};

export default StationDetails;
