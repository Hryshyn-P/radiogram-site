import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Headphones, LoaderCircle, Share2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Artwork } from "@/components/Artwork";
import EpisodeRow from "@/components/EpisodeRow";
import { lookupPodcast } from "@/lib/podcasts";
import { podcastShareData, shareOrCopy } from "@/lib/share";
import { useSeo } from "@/lib/seo";
import type { PodcastEpisode, PodcastShow } from "@/types/catalog";
import { useLanguage } from "@/context/LanguageContext";

const PodcastDetails = () => {
  const { id = "" } = useParams();
  const location = useLocation();
  const collectionId = Number(id);
  const [show, setShow] = useState<PodcastShow | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { locale, t } = useLanguage();
  useSeo({
    title: show ? `${show.name} — ${t("podcastEpisodes")} | Radiogram` : t("podcastSeoTitle"),
    description: show ? `${t("listenTo")} ${show.name}${show.artistName ? ` — ${show.artistName}` : ""}. ${t("podcastSeoDescription")}` : t("podcastSeoDescription"),
    path: location.pathname, image: show?.artworkUrl, noIndex: !collectionId,
  });

  useEffect(() => {
    if (!collectionId) { setError(true); setLoading(false); return; }
    let cancelled = false;
    lookupPodcast(collectionId, { podcast: t("podcast"), untitledEpisode: t("untitledEpisode") })
      .then((value) => { if (!cancelled) { setShow(value.show); setEpisodes(value.episodes); setError(!value.show); } })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [collectionId, t]);

  const sorted = useMemo(() => [...episodes].sort((a, b) => {
    const left = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const right = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return sort === "newest" ? right - left : left - right;
  }), [episodes, sort]);

  if (loading) return <div className="loading-state page-shell"><LoaderCircle className="spin" /><p>{t("loadingEpisodes")}</p></div>;
  if (error || !show) return <div className="empty-state page-shell"><Headphones /><h1>{t("podcastNotFound")}</h1><p>{t("podcastUnavailableBody")}</p><Link className="primary-button" to="/podcasts">{t("browsePodcasts")}</Link></div>;

  const share = async () => {
    await shareOrCopy(podcastShareData(show.name, show.id));
  };

  return (
    <div className="podcast-detail page-shell">
      <Link to="/podcasts" className="back-link"><ArrowLeft /> {t("podcastSearch")}</Link>
      <section className="podcast-hero">
        <Artwork src={show.artworkUrl} alt={`${show.name} ${t("podcastCover")}`} className="podcast-hero__art" />
        <div><span className="eyebrow">{show.genres[0] || t("podcast")}</span><h1>{show.name}</h1><p>{show.artistName}{show.country ? ` · ${show.country}` : ""}</p><div className="station-hero__tags">{show.genres.slice(0, 5).map((genre) => <span key={genre}>{genre}</span>)}</div><div className="station-hero__actions"><button className="secondary-button" onClick={share}><Share2 /> {t("share")}</button>{show.appleUrl && <a className="secondary-button" href={show.appleUrl} target="_blank" rel="noreferrer"><ExternalLink /> {t("viewOnApplePodcasts")}</a>}</div></div>
      </section>
      <section className="episodes-section">
        <div className="section-heading"><div><span className="eyebrow">{t("fullEpisodes")}</span><h2>{episodes.length.toLocaleString(locale)} {t("episodes")}</h2></div><select value={sort} aria-label={t("episodeSort")} onChange={(event) => { setSort(event.target.value as typeof sort); setVisibleCount(30); }}><option value="newest">{t("newestFirst")}</option><option value="oldest">{t("oldestFirst")}</option></select></div>
        {sorted.length ? <><div className="episode-list">{sorted.slice(0, visibleCount).map((episode) => <EpisodeRow key={episode.id} episode={episode} show={show} />)}</div>{visibleCount < sorted.length && <div className="load-more"><button className="secondary-button" onClick={() => setVisibleCount((count) => count + 30)}>{t("loadMoreEpisodes")}</button></div>}</> : <div className="empty-state"><Headphones /><h2>{t("noPlayableEpisodes")}</h2><p>{t("noPlayableEpisodesBody")}</p></div>}
      </section>
    </div>
  );
};

export default PodcastDetails;
