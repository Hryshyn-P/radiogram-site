import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Headphones, LoaderCircle } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Artwork } from "@/components/Artwork";
import EpisodeRow from "@/components/EpisodeRow";
import { lookupPodcast } from "@/lib/podcasts";
import { useSeo } from "@/lib/seo";
import type { PodcastEpisode, PodcastShow } from "@/types/catalog";

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
  useSeo({
    title: show ? `${show.name} podcast — episodes | Radiogram` : "Podcast episodes | Radiogram",
    description: show ? `Listen to ${show.name} by ${show.artistName || "its creators"}. Browse and play the latest podcast episodes online in Radiogram.` : "Browse and listen to podcast episodes online in Radiogram.",
    path: location.pathname, image: show?.artworkUrl, noIndex: !collectionId,
  });

  useEffect(() => {
    if (!collectionId) { setError(true); setLoading(false); return; }
    let cancelled = false;
    lookupPodcast(collectionId)
      .then((value) => { if (!cancelled) { setShow(value.show); setEpisodes(value.episodes); setError(!value.show); } })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [collectionId]);

  const sorted = useMemo(() => [...episodes].sort((a, b) => {
    const left = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const right = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return sort === "newest" ? right - left : left - right;
  }), [episodes, sort]);

  if (loading) return <div className="loading-state page-shell"><LoaderCircle className="spin" /><p>Loading episodes…</p></div>;
  if (error || !show) return <div className="empty-state page-shell"><Headphones /><h1>Podcast not found</h1><p>The show may no longer be available in this storefront.</p><Link className="primary-button" to="/podcasts">Browse podcasts</Link></div>;

  return (
    <div className="podcast-detail page-shell">
      <Link to="/podcasts" className="back-link"><ArrowLeft /> Podcast search</Link>
      <section className="podcast-hero">
        <Artwork src={show.artworkUrl} alt={`${show.name} cover`} className="podcast-hero__art" />
        <div><span className="eyebrow">{show.genres[0] || "Podcast"}</span><h1>{show.name}</h1><p>{show.artistName}{show.country ? ` · ${show.country}` : ""}</p><div className="station-hero__tags">{show.genres.slice(0, 5).map((genre) => <span key={genre}>{genre}</span>)}</div>{show.appleUrl && <a className="secondary-button" href={show.appleUrl} target="_blank" rel="noreferrer"><ExternalLink /> View on Apple Podcasts</a>}</div>
      </section>
      <section className="episodes-section">
        <div className="section-heading"><div><span className="eyebrow">Full episodes</span><h2>{episodes.length} episodes</h2></div><select value={sort} onChange={(event) => { setSort(event.target.value as typeof sort); setVisibleCount(30); }}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div>
        {sorted.length ? <><div className="episode-list">{sorted.slice(0, visibleCount).map((episode) => <EpisodeRow key={episode.id} episode={episode} show={show} />)}</div>{visibleCount < sorted.length && <div className="load-more"><button className="secondary-button" onClick={() => setVisibleCount((count) => count + 30)}>Load more episodes</button></div>}</> : <div className="empty-state"><Headphones /><h2>No playable episodes</h2><p>This show does not expose episodes through the web catalog.</p></div>}
      </section>
    </div>
  );
};

export default PodcastDetails;
