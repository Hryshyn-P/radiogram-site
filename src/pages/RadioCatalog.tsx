import { useEffect, useMemo, useRef, useState } from "react";
import { Globe2, Grid2X2, Languages, List, LoaderCircle, Radio, RotateCw, Search, SlidersHorizontal, Tag, X } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import StationCard from "@/components/StationCard";
import { fetchCountries, fetchLanguages, fetchStations, fetchTags } from "@/lib/radioBrowser";
import { decodeFacetParam, facetPath } from "@/lib/slug";
import { useSeo } from "@/lib/seo";
import { readStorage, writeStorage } from "@/lib/storage";
import type { CatalogFacet, Station } from "@/types/catalog";
import { useLanguage } from "@/context/LanguageContext";

const PAGE_SIZE = 48;
const TAG_BATCH_SIZE = 80;
type StationSort = "votes" | "name" | "clickcount" | "random";

const parseSelections = (value: string | null) => value?.split("|").filter(Boolean).slice(0, 3) || [];

const fetchFilteredStations = async ({
  query, countries, tags, languages, order, offset = 0,
}: {
  query: string; countries: string[]; tags: string[]; languages: string[]; order: StationSort; offset?: number;
}) => {
  const countryValues = countries.length ? countries : [""];
  const tagValues = tags.length ? tags : [""];
  const languageValues = languages.length ? languages : [""];
  const batches = await Promise.all(countryValues.flatMap((country) => tagValues.flatMap((tag) => languageValues.map((language) =>
    fetchStations({ query, country: country || undefined, tag: tag || undefined, language: language || undefined, order, offset, limit: PAGE_SIZE }),
  ))));
  const unique = [...new Map(batches.flat().map((station) => [station.id, station])).values()];
  if (order === "name") unique.sort((left, right) => left.name.localeCompare(right.name));
  else if (order === "clickcount") unique.sort((left, right) => right.clickCount - left.clickCount);
  else if (order === "random") unique.sort(() => Math.random() - 0.5);
  else unique.sort((left, right) => right.popularityScore - left.popularityScore);
  return unique.slice(0, PAGE_SIZE);
};

const RadioCatalog = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { language, locale, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeCountry = decodeFacetParam(params.country);
  const routeTag = decodeFacetParam(params.tag);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [submittedQuery, setSubmittedQuery] = useState(searchParams.get("q") || "");
  const [selectedCountries, setSelectedCountries] = useState(() => routeCountry ? [routeCountry] : parseSelections(searchParams.get("country")));
  const [selectedTags, setSelectedTags] = useState(() => routeTag ? [routeTag] : parseSelections(searchParams.get("tag")));
  const [selectedLanguages, setSelectedLanguages] = useState(() => parseSelections(searchParams.get("language")).slice(0, 1));
  const [sort, setSort] = useState<StationSort>((searchParams.get("sort") as StationSort) || "votes");
  const [mode, setMode] = useState<"grid" | "list">(() => readStorage("catalog.mode", "grid"));
  const [stations, setStations] = useState<Station[]>([]);
  const [countries, setCountries] = useState<CatalogFacet[]>([]);
  const [tags, setTags] = useState<CatalogFacet[]>([]);
  const [languages, setLanguages] = useState<CatalogFacet[]>([]);
  const [countryFilterQuery, setCountryFilterQuery] = useState("");
  const [tagFilterQuery, setTagFilterQuery] = useState("");
  const [languageFilterQuery, setLanguageFilterQuery] = useState("");
  const [activeFacet, setActiveFacet] = useState<"tags" | "countries" | "languages">("tags");
  const [visibleTagCount, setVisibleTagCount] = useState(TAG_BATCH_SIZE);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(Boolean(selectedCountries.length || selectedTags.length || selectedLanguages.length));
  const previousLanguage = useRef<typeof language | null>(null);
  const preChineseState = useRef<{ countries: string[]; filtersOpen: boolean } | null>(null);

  useEffect(() => {
    const enteringChinese = language === "zh-CN" && previousLanguage.current !== "zh-CN";
    const leavingChinese = language !== "zh-CN" && previousLanguage.current === "zh-CN";

    if (enteringChinese) {
      preChineseState.current = { countries: selectedCountries, filtersOpen };
      if (!routeCountry && !searchParams.get("country")) {
        setSelectedCountries(["China"]);
        setFiltersOpen(true);
      }
    } else if (leavingChinese && preChineseState.current) {
      setSelectedCountries(preChineseState.current.countries);
      setFiltersOpen(preChineseState.current.filtersOpen);
      preChineseState.current = null;
    }

    previousLanguage.current = language;
  }, [filtersOpen, language, routeCountry, searchParams, selectedCountries]);

  const title = routeCountry
    ? `${t("radioStationsIn")} ${routeCountry} — ${t("listenLive")} | Radiogram`
    : routeTag
      ? `${routeTag} ${t("radioStations")} — ${t("listenLive")} | Radiogram`
      : t("radioSeoTitle");
  const description = routeCountry
    ? `${t("listenStationsFrom")} ${routeCountry}. ${t("browseStreams")}`
    : routeTag
      ? `${t("listenPopular")} ${routeTag} ${t("radioOnlineFree")} ${t("discoverStreams")}`
      : t("catalogIntro");
  useSeo({ title, description, path: window.location.pathname });

  useEffect(() => {
    Promise.all([fetchCountries(), fetchTags(), fetchLanguages()])
      .then(([countryItems, tagItems, languageItems]) => { setCountries(countryItems); setTags(tagItems); setLanguages(languageItems); })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setOffset(0);
    fetchFilteredStations({ query: submittedQuery, countries: selectedCountries, tags: selectedTags, languages: selectedLanguages, order: sort })
      .then((value) => { if (!cancelled) setStations(value); })
      .catch(() => { if (!cancelled) setError(t("catalogError")); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedCountries, selectedTags, selectedLanguages, submittedQuery, sort, t]);

  const updateUrl = (next: { countries?: string[]; tags?: string[]; languages?: string[]; query?: string; sort?: string }) => {
    if (routeCountry || routeTag) {
      const qs = new URLSearchParams();
      if (next.countries?.length) qs.set("country", next.countries.join("|"));
      if (next.tags?.length) qs.set("tag", next.tags.join("|"));
      if (next.languages?.length) qs.set("language", next.languages.join("|"));
      if (next.query) qs.set("q", next.query);
      if (next.sort && next.sort !== "votes") qs.set("sort", next.sort);
      navigate(`/radio${qs.size ? `?${qs}` : ""}`);
      return;
    }
    const qs = new URLSearchParams();
    if (next.countries?.length) qs.set("country", next.countries.join("|"));
    if (next.tags?.length) qs.set("tag", next.tags.join("|"));
    if (next.languages?.length) qs.set("language", next.languages.join("|"));
    if (next.query) qs.set("q", next.query);
    if (next.sort && next.sort !== "votes") qs.set("sort", next.sort);
    setSearchParams(qs, { replace: true });
  };

  const selectCountry = (value: string) => {
    const next = value ? (selectedCountries.includes(value) ? selectedCountries.filter((item) => item !== value) : [...selectedCountries, value].slice(-3)) : [];
    setSelectedCountries(next);
    updateUrl({ countries: next, tags: selectedTags, languages: selectedLanguages, query: submittedQuery, sort });
  };
  const selectTag = (value: string) => {
    const next = value ? (selectedTags.includes(value) ? selectedTags.filter((item) => item !== value) : [...selectedTags, value].slice(-3)) : [];
    setSelectedTags(next);
    updateUrl({ countries: selectedCountries, tags: next, languages: selectedLanguages, query: submittedQuery, sort });
  };
  const selectLanguage = (value: string) => {
    const next = value ? (selectedLanguages.includes(value) ? [] : [value]) : [];
    setSelectedLanguages(next);
    updateUrl({ countries: selectedCountries, tags: selectedTags, languages: next, query: submittedQuery, sort });
  };
  const clearFilters = () => {
    setSelectedCountries([]); setSelectedTags([]); setSelectedLanguages([]); setQuery(""); setSubmittedQuery(""); setSort("votes");
    navigate("/radio");
  };
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedQuery(query.trim());
    updateUrl({ countries: selectedCountries, tags: selectedTags, languages: selectedLanguages, query: query.trim(), sort });
  };
  const loadMore = async () => {
    const nextOffset = offset + PAGE_SIZE;
    setIsLoadingMore(true);
    try {
      const next = await fetchFilteredStations({ query: submittedQuery, countries: selectedCountries, tags: selectedTags, languages: selectedLanguages, order: sort, offset: nextOffset });
      setStations((current) => [...current, ...next.filter((item) => !current.some((existing) => existing.id === item.id))]);
      setOffset(nextOffset);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const heading = useMemo(() => {
    const countryLabel = selectedCountries.join(" / ");
    const tagLabel = selectedTags.join(" / ");
    const languageLabel = selectedLanguages.join(" / ");
    if (languageLabel && countryLabel) return `${languageLabel} ${t("radioIn")} ${countryLabel}`;
    if (languageLabel && tagLabel) return `${languageLabel} · ${tagLabel} ${t("radio").toLocaleLowerCase(locale)}`;
    if (languageLabel) return `${languageLabel} ${t("radio").toLocaleLowerCase(locale)}`;
    if (countryLabel && tagLabel) return `${tagLabel} · ${t("radioIn")} ${countryLabel}`;
    if (countryLabel) return `${t("radioIn")} ${countryLabel}`;
    if (tagLabel) return `${tagLabel} ${t("radio").toLocaleLowerCase(locale)}`;
    if (submittedQuery) return `${t("resultsFor")} “${submittedQuery}”`;
    return t("exploreRadio");
  }, [locale, selectedCountries, selectedLanguages, selectedTags, submittedQuery, t]);

  const matchingCountries = useMemo(() => {
    const normalizedQuery = countryFilterQuery.trim().toLocaleLowerCase();
    return normalizedQuery ? countries.filter((item) => item.name.toLocaleLowerCase().includes(normalizedQuery)) : countries;
  }, [countries, countryFilterQuery]);
  const matchingTags = useMemo(() => {
    const normalizedQuery = tagFilterQuery.trim().toLocaleLowerCase();
    return normalizedQuery ? tags.filter((item) => item.name.toLocaleLowerCase().includes(normalizedQuery)) : tags;
  }, [tags, tagFilterQuery]);
  const visibleTags = matchingTags.slice(0, visibleTagCount);
  const matchingLanguages = useMemo(() => {
    const normalizedQuery = languageFilterQuery.trim().toLocaleLowerCase();
    return normalizedQuery ? languages.filter((item) => item.name.toLocaleLowerCase().includes(normalizedQuery)) : languages;
  }, [languageFilterQuery, languages]);
  const activeFilterCount = selectedCountries.length + selectedTags.length + selectedLanguages.length + (submittedQuery ? 1 : 0);
  const clearQuery = () => {
    setQuery("");
    setSubmittedQuery("");
    updateUrl({ countries: selectedCountries, tags: selectedTags, languages: selectedLanguages, sort });
  };

  return (
    <div className="catalog-page page-shell">
      <div className="page-heading">
        <div><span className="eyebrow">{t("worldwide")}</span><h1>{heading}</h1><p>{t("catalogIntro")}</p></div>
        <Radio className="page-heading__icon" />
      </div>

      <div className="catalog-toolbar">
        <form className="search-field" onSubmit={submitSearch} role="search">
          <Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchStations")} aria-label={t("searchStations")} />
          {submittedQuery && !isLoading && <span className="field-counter">{stations.length.toLocaleString(locale)}</span>}
          {query && <button type="button" onClick={clearQuery} aria-label={t("clear")}><X /></button>}
        </form>
        <button className={`filter-button ${filtersOpen || activeFilterCount ? "is-active" : ""}`} onClick={() => setFiltersOpen((value) => !value)}>
          <SlidersHorizontal /> {t("filters")} {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
        </button>
        <select className="sort-select" value={sort} onChange={(event) => { const value = event.target.value as StationSort; setSort(value); updateUrl({ countries: selectedCountries, tags: selectedTags, languages: selectedLanguages, query: submittedQuery, sort: value }); }} aria-label={t("sortStations")}>
          <option value="votes">{t("featured")}</option><option value="clickcount">{t("popularNow")}</option><option value="name">{t("name")}</option><option value="random">{t("surprise")}</option>
        </select>
        <div className="view-switch" aria-label={t("displayMode")}>
          <button className={mode === "grid" ? "is-active" : ""} onClick={() => { setMode("grid"); writeStorage("catalog.mode", "grid"); }} aria-label={t("gridView")}><Grid2X2 /></button>
          <button className={mode === "list" ? "is-active" : ""} onClick={() => { setMode("list"); writeStorage("catalog.mode", "list"); }} aria-label={t("listView")}><List /></button>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="active-filters" aria-label={t("activeFilters")}>
          {submittedQuery && <button type="button" onClick={clearQuery}><Search />{submittedQuery}<X /></button>}
          {selectedTags.map((item) => <button type="button" key={`tag-${item}`} onClick={() => selectTag(item)}><Tag />{item}<X /></button>)}
          {selectedCountries.map((item) => <button type="button" key={`country-${item}`} onClick={() => selectCountry(item)}><Globe2 />{item}<X /></button>)}
          {selectedLanguages.map((item) => <button type="button" key={`language-${item}`} onClick={() => selectLanguage(item)}><Languages />{item}<X /></button>)}
          <button type="button" className="active-filters__clear" onClick={clearFilters}>{t("clearAll")}<X /></button>
        </div>
      )}

      {filtersOpen && (
        <section className="filter-panel">
          <div className="filter-panel__tabs" role="tablist" aria-label={t("filters")}>
            <button type="button" className={activeFacet === "tags" ? "is-active" : ""} onClick={() => setActiveFacet("tags")}><Tag />{t("tags")}<span>{selectedTags.length}</span></button>
            <button type="button" className={activeFacet === "countries" ? "is-active" : ""} onClick={() => setActiveFacet("countries")}><Globe2 />{t("countries")}<span>{selectedCountries.length}</span></button>
            <button type="button" className={activeFacet === "languages" ? "is-active" : ""} onClick={() => setActiveFacet("languages")}><Languages />{t("languages")}<span>{selectedLanguages.length}</span></button>
          </div>
          <div className="filter-panel__grid" data-active={activeFacet}>
            <div className="filter-panel__section facet-pane facet-pane--tags">
              <div className="filter-panel__title"><strong>{t("tags")} <small>{tags.length.toLocaleString(locale)} {t("fromDirectory")} · {t("chooseThree")}</small></strong>{selectedTags.length > 0 && <button type="button" onClick={() => selectTag("")}>{t("clear")}</button>}</div>
              <label className="search-field facet-search"><Search /><input value={tagFilterQuery} onChange={(event) => { setTagFilterQuery(event.target.value); setVisibleTagCount(TAG_BATCH_SIZE); }} placeholder={t("findTag")} aria-label={t("findTag")} /><span className="field-counter">{matchingTags.length.toLocaleString(locale)}</span>{tagFilterQuery && <button type="button" onClick={() => { setTagFilterQuery(""); setVisibleTagCount(TAG_BATCH_SIZE); }} aria-label={t("clear")}><X /></button>}</label>
              <div className="chip-row"><button type="button" className={!selectedTags.length ? "is-active" : ""} onClick={() => selectTag("")}>{t("all")}</button>{visibleTags.map((item) => <button type="button" key={item.name} className={selectedTags.includes(item.name) ? "is-active" : ""} onClick={() => selectTag(item.name)}>{item.name} <small>{item.stationcount.toLocaleString(locale)}</small></button>)}</div>
              {visibleTags.length === 0 && <p className="facet-empty">{t("noTags")}</p>}
              {matchingTags.length > visibleTags.length && <button type="button" className="facet-more" onClick={() => setVisibleTagCount((count) => count + TAG_BATCH_SIZE)}>{t("showMoreTags")} <small>{(matchingTags.length - visibleTags.length).toLocaleString(locale)} {t("remaining")}</small></button>}
            </div>
            <div className="filter-panel__section facet-pane facet-pane--countries">
              <div className="filter-panel__title"><strong>{t("countries")} <small>{countries.length.toLocaleString(locale)} {t("fromDirectory")} · {t("chooseThree")}</small></strong>{selectedCountries.length > 0 && <button type="button" onClick={() => selectCountry("")}>{t("clear")}</button>}</div>
              <label className="search-field facet-search"><Search /><input value={countryFilterQuery} onChange={(event) => setCountryFilterQuery(event.target.value)} placeholder={t("findCountry")} aria-label={t("findCountry")} /><span className="field-counter">{matchingCountries.length.toLocaleString(locale)}</span>{countryFilterQuery && <button type="button" onClick={() => setCountryFilterQuery("")} aria-label={t("clear")}><X /></button>}</label>
              <div className="chip-row"><button type="button" className={!selectedCountries.length ? "is-active" : ""} onClick={() => selectCountry("")}>{t("all")}</button>{matchingCountries.map((item) => <button type="button" key={item.name} className={selectedCountries.includes(item.name) ? "is-active" : ""} onClick={() => selectCountry(item.name)}>{item.name} <small>{item.stationcount.toLocaleString(locale)}</small></button>)}</div>
              {matchingCountries.length === 0 && <p className="facet-empty">{t("noCountries")}</p>}
            </div>
            <div className="filter-panel__section facet-pane facet-pane--languages">
              <div className="filter-panel__title"><strong>{t("languages")} <small>{languages.length.toLocaleString(locale)} {t("fromDirectory")} · {t("chooseOne")}</small></strong>{selectedLanguages.length > 0 && <button type="button" onClick={() => selectLanguage("")}>{t("clear")}</button>}</div>
              <label className="search-field facet-search"><Search /><input value={languageFilterQuery} onChange={(event) => setLanguageFilterQuery(event.target.value)} placeholder={t("findLanguage")} aria-label={t("findLanguage")} /><span className="field-counter">{matchingLanguages.length.toLocaleString(locale)}</span>{languageFilterQuery && <button type="button" onClick={() => setLanguageFilterQuery("")} aria-label={t("clear")}><X /></button>}</label>
              <div className="chip-row"><button type="button" className={!selectedLanguages.length ? "is-active" : ""} onClick={() => selectLanguage("")}>{t("all")}</button>{matchingLanguages.map((item) => <button type="button" key={item.name} className={selectedLanguages.includes(item.name) ? "is-active" : ""} onClick={() => selectLanguage(item.name)}>{item.name} <small>{item.stationcount.toLocaleString(locale)}</small></button>)}</div>
              {matchingLanguages.length === 0 && <p className="facet-empty">{t("noLanguages")}</p>}
            </div>
          </div>
          {activeFilterCount > 0 && <button className="text-button" onClick={clearFilters}><X /> {t("resetFilters")}</button>}
        </section>
      )}

      {!isLoading && !error && <div className="catalog-results-meta"><span><Radio /> <strong>{stations.length.toLocaleString(locale)}</strong> {t("loaded")}</span>{activeFilterCount > 0 && <span>{activeFilterCount} {t("filters").toLocaleLowerCase(locale)}</span>}</div>}

      {isLoading ? (
        <div className="loading-state"><LoaderCircle className="spin" /><p>{t("tuning")}</p></div>
      ) : error ? (
        <div className="empty-state"><Radio /><h2>{t("lostSignal")}</h2><p>{error}</p><button className="primary-button" onClick={() => window.location.reload()}><RotateCw /> {t("tryAgain")}</button></div>
      ) : stations.length === 0 ? (
        <div className="empty-state"><Search /><h2>{t("noStations")}</h2><p>{t("broaderSearch")}</p><button className="primary-button" onClick={clearFilters}>{t("showAll")}</button></div>
      ) : (
        <>
          <div className={`station-results station-results--${mode}`}>{stations.map((station) => <StationCard key={station.id} station={station} mode={mode} />)}</div>
          <div className="load-more"><button className="secondary-button" onClick={loadMore} disabled={isLoadingMore}>{isLoadingMore ? <LoaderCircle className="spin" /> : null} {t("loadMore")}</button></div>
        </>
      )}

      <section className="seo-links" aria-label={t("browseCategories")}>
        <div><h2>{t("browseCountry")}</h2>{countries.slice(0, 12).map((item) => <Link key={item.name} to={facetPath("country", item.name)}>{item.name}</Link>)}</div>
        <div><h2>{t("browseGenre")}</h2>{tags.slice(0, 12).map((item) => <Link key={item.name} to={facetPath("tag", item.name)}>{item.name}</Link>)}</div>
      </section>
    </div>
  );
};

export default RadioCatalog;
