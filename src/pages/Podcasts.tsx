import { useEffect, useRef, useState } from "react";
import { Headphones, LoaderCircle, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PodcastCard from "@/components/PodcastCard";
import { searchPodcasts } from "@/lib/podcasts";
import { useSeo } from "@/lib/seo";
import type { PodcastShow } from "@/types/catalog";
import { useLanguage } from "@/context/LanguageContext";

const SUGGESTIONS = ["dailyNews", "technology", "history", "science", "comedy", "trueCrime", "music", "business"] as const;
const STOREFRONTS = ["US", "GB", "CA", "AU", "DE", "FR", "PL", "UA", "ES", "IT", "JP", "CN"] as const;

const Podcasts = () => {
  const { language, locale, t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "daily news";
  const [query, setQuery] = useState(initial);
  const [submittedQuery, setSubmittedQuery] = useState(initial);
  const [country, setCountry] = useState(() => (navigator.language.split("-")[1] || "US").toUpperCase());
  const [results, setResults] = useState<PodcastShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousLanguage = useRef<typeof language | null>(null);
  const preChineseCountry = useRef<string | null>(null);
  useSeo({ title: t("podcastsSeoTitle"), description: t("podcastsSeoDescription"), path: "/podcasts" });

  useEffect(() => {
    const enteringChinese = language === "zh-CN" && previousLanguage.current !== "zh-CN";
    const leavingChinese = language !== "zh-CN" && previousLanguage.current === "zh-CN";
    if (enteringChinese) {
      preChineseCountry.current = country;
      setCountry("CN");
    } else if (leavingChinese && preChineseCountry.current) {
      setCountry(preChineseCountry.current);
      preChineseCountry.current = null;
    }
    previousLanguage.current = language;
  }, [country, language]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    searchPodcasts(submittedQuery, country)
      .then((shows) => { if (!cancelled) setResults(shows); })
      .catch(() => { if (!cancelled) setError(t("applePodcastsUnavailable")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [country, submittedQuery, t]);

  const search = (value: string) => { setQuery(value); setSubmittedQuery(value); setParams({ q: value }, { replace: true }); };

  return (
    <div className="podcasts-page page-shell">
      <div className="page-heading"><div><span className="eyebrow">{t("podcastCatalog")}</span><h1>{t("findListen")}</h1><p>{t("podcastIntro")}</p></div><Headphones className="page-heading__icon" /></div>
      <form className="podcast-search" onSubmit={(event) => { event.preventDefault(); search(query.trim()); }}>
        <div className="search-field"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPodcasts")} aria-label={t("searchPodcasts")} />{query && <button type="button" onClick={() => setQuery("")} aria-label={t("clearSearch")}><X /></button>}</div>
        <select value={country} onChange={(event) => setCountry(event.target.value)} aria-label={t("podcastStorefront")}>{STOREFRONTS.map((code) => <option key={code} value={code}>{t(`country${code}`)}</option>)}</select>
        <button className="primary-button" type="submit">{t("search")}</button>
      </form>
      <div className="chip-row podcast-suggestions">{SUGGESTIONS.map((key) => { const queryValue = t(key); return <button key={key} className={submittedQuery === queryValue ? "is-active" : ""} onClick={() => search(queryValue)}>{queryValue}</button>; })}</div>

      {loading ? <div className="loading-state"><LoaderCircle className="spin" /><p>{t("searchingPodcasts")}</p></div>
        : error ? <div className="empty-state"><Headphones /><h2>{t("couldntLoadPodcasts")}</h2><p>{error}</p></div>
          : <><div className="section-heading"><div><span className="eyebrow">{t("searchResults")}</span><h2>{submittedQuery}</h2></div><span>{results.length.toLocaleString(locale)} {t("shows")}</span></div><div className="podcast-grid">{results.map((show) => <PodcastCard key={show.id} show={show} />)}</div></>}
    </div>
  );
};

export default Podcasts;
