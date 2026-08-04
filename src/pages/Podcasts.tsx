import { useEffect, useState } from "react";
import { Headphones, LoaderCircle, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PodcastCard from "@/components/PodcastCard";
import { searchPodcasts } from "@/lib/podcasts";
import { useSeo } from "@/lib/seo";
import type { PodcastShow } from "@/types/catalog";
import { useLanguage } from "@/context/LanguageContext";

const SUGGESTIONS = ["daily news", "technology", "history", "science", "comedy", "true crime", "music", "business"];

const Podcasts = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "daily news";
  const [query, setQuery] = useState(initial);
  const [submittedQuery, setSubmittedQuery] = useState(initial);
  const [country, setCountry] = useState(() => (navigator.language.split("-")[1] || "US").toUpperCase());
  const [results, setResults] = useState<PodcastShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { locale, t } = useLanguage();
  useSeo({ title: "Discover podcasts and episodes | Radiogram", description: "Search podcasts from the Apple Podcasts catalog, browse shows, and listen to episodes online free in Radiogram.", path: "/podcasts" });

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    searchPodcasts(submittedQuery, country)
      .then((shows) => { if (!cancelled) setResults(shows); })
      .catch(() => { if (!cancelled) setError("Apple Podcasts is unavailable right now. Please try again shortly."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [country, submittedQuery]);

  const search = (value: string) => { setQuery(value); setSubmittedQuery(value); setParams({ q: value }, { replace: true }); };

  return (
    <div className="podcasts-page page-shell">
      <div className="page-heading"><div><span className="eyebrow">{t("podcastCatalog")}</span><h1>{t("findListen")}</h1><p>{t("podcastIntro")}</p></div><Headphones className="page-heading__icon" /></div>
      <form className="podcast-search" onSubmit={(event) => { event.preventDefault(); search(query.trim()); }}>
        <div className="search-field"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPodcasts")} aria-label={t("searchPodcasts")} />{query && <button type="button" onClick={() => setQuery("")} aria-label={t("clearSearch")}><X /></button>}</div>
        <select value={country} onChange={(event) => setCountry(event.target.value)} aria-label="Podcast storefront"><option value="US">United States</option><option value="GB">United Kingdom</option><option value="CA">Canada</option><option value="AU">Australia</option><option value="DE">Germany</option><option value="FR">France</option><option value="PL">Poland</option><option value="UA">Ukraine</option><option value="ES">Spain</option><option value="IT">Italy</option><option value="JP">Japan</option></select>
        <button className="primary-button" type="submit">{t("search")}</button>
      </form>
      <div className="chip-row podcast-suggestions">{SUGGESTIONS.map((item) => <button key={item} className={submittedQuery === item ? "is-active" : ""} onClick={() => search(item)}>{item}</button>)}</div>

      {loading ? <div className="loading-state"><LoaderCircle className="spin" /><p>{t("searchingPodcasts")}</p></div>
        : error ? <div className="empty-state"><Headphones /><h2>{t("couldntLoadPodcasts")}</h2><p>{error}</p></div>
          : <><div className="section-heading"><div><span className="eyebrow">{t("searchResults")}</span><h2>{submittedQuery}</h2></div><span>{results.length.toLocaleString(locale)} {t("shows")}</span></div><div className="podcast-grid">{results.map((show) => <PodcastCard key={show.id} show={show} />)}</div></>}
    </div>
  );
};

export default Podcasts;
