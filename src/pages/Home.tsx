import { useEffect, useState } from "react";
import { ArrowRight, Download, Headphones, Radio, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_STORE_URL } from "@/components/AppPlayer";
import PodcastCard from "@/components/PodcastCard";
import StationCard from "@/components/StationCard";
import { searchPodcasts } from "@/lib/podcasts";
import { fetchStations, fetchTags } from "@/lib/radioBrowser";
import { useSeo } from "@/lib/seo";
import { facetPath } from "@/lib/slug";
import type { CatalogFacet, PodcastShow, Station } from "@/types/catalog";
import { useLanguage } from "@/context/LanguageContext";
import AppShowcase from "@/components/AppShowcase";
import AppTourVideo from "@/components/AppTourVideo";

const Home = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastShow[]>([]);
  const [featuredTags, setFeaturedTags] = useState<CatalogFacet[]>([]);
  const { locale, t } = useLanguage();
  useSeo({
    title: t("homeSeoTitle"),
    description: t("homeSeoDescription"),
    path: "/",
  });

  useEffect(() => {
    fetchStations({ order: "votes", limit: 6 }).then(setStations).catch(() => undefined);
    fetchTags(3).then(setFeaturedTags).catch(() => undefined);
    searchPodcasts("daily news", (navigator.language.split("-")[1] || "US").toUpperCase()).then((items) => setPodcasts(items.slice(0, 6))).catch(() => undefined);
  }, []);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__glow" />
        <div className="page-shell home-hero__inner">
          <div className="home-hero__copy">
            <span className="eyebrow"><span className="live-dot" /> {t("liveWorld")}</span>
            <h1>{t("heroTitleA")}<br /><span>{t("heroTitleB")}</span></h1>
            <p>{t("heroBody")}</p>
            <div className="home-hero__actions">
              <Link className="primary-button primary-button--large" to="/radio"><Radio /> {t("startListening")}</Link>
              <a className="secondary-button download-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer"><Download /> {t("getTheApp")}</a>
            </div>
            <div className="platform-note"><span>{t("builtFor")}</span><strong>iPhone</strong><strong>iPad</strong><strong>Mac</strong></div>
          </div>
          <div className="radio-orbit" aria-hidden="true">
            <div className="radio-orbit__ring radio-orbit__ring--one" />
            <div className="radio-orbit__ring radio-orbit__ring--two" />
            <div className="radio-orbit__core"><Radio /></div>
            <span className="radio-orbit__label radio-orbit__label--one">{t("beijing")} · {t("jazz")}</span>
            <span className="radio-orbit__label radio-orbit__label--two">{t("kyiv")} · {t("news")}</span>
            <span className="radio-orbit__label radio-orbit__label--three">{t("washington")} · {t("soul")}</span>
          </div>
        </div>
      </section>

      <section className="page-shell home-section">
        <div className="section-heading"><div><span className="eyebrow">{t("onAir")}</span><h2>{t("popularStations")}</h2></div><Link to="/radio">{t("exploreAll")} <ArrowRight /></Link></div>
        <div className="station-results station-results--grid">{stations.map((station) => <StationCard key={station.id} station={station} />)}</div>
      </section>

      <AppShowcase />

      <section className="home-discovery">
        <div className="page-shell home-discovery__grid">
          <div><span className="eyebrow">{t("findFrequency")}</span><h2>{t("discoveryTitle")}</h2><p>{t("discoveryBody")}</p><Link className="primary-button" to="/radio"><Search /> {t("openFinder")}</Link></div>
          <div className="discovery-cards">{featuredTags.map((tag, index) => <Link key={tag.name} to={facetPath("tag", tag.name)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{tag.name}</strong><small>{tag.stationcount.toLocaleString(locale)} {t("liveStations")}</small></Link>)}<Link to="/radio?sort=random"><span>{String(featuredTags.length + 1).padStart(2, "0")}</span><strong>{t("surprise")}</strong><small>{t("spinWorld")}</small></Link></div>
        </div>
      </section>

      <section className="page-shell home-section">
        <div className="section-heading"><div><span className="eyebrow">{t("freshEpisodes")}</span><h2>{t("podcastsWorth")}</h2></div><Link to="/podcasts">{t("searchPodcasts")} <ArrowRight /></Link></div>
        <div className="podcast-grid">{podcasts.map((show) => <PodcastCard key={show.id} show={show} />)}</div>
      </section>

      <AppTourVideo />

      <section className="page-shell home-app-cta">
        <div className="home-app-cta__icon"><Sparkles /></div>
        <div><span className="eyebrow">{t("fullExperience")}</span><h2>{t("remembered")}</h2><p>{t("appBody")}</p><div className="feature-pills"><span><Radio /> {t("favorites")}</span><span><Sparkles /> {t("recognition")}</span><span><Headphones /> {t("nativeControls")}</span></div></div>
        <a className="primary-button primary-button--large download-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer"><Download /> {t("download")}</a>
      </section>
    </>
  );
};

export default Home;
