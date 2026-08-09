import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://radiogram-site.duckdns.org";
const DIST = path.resolve("dist");
const stationLimit = Math.max(0, Number(process.env.SEO_STATION_LIMIT || 0));
const podcastLimit = Math.max(0, Number(process.env.SEO_PODCAST_LIMIT || 0));
const apiHost = "https://all.api.radio-browser.info";
const podcastTerms = ["news", "technology", "history", "science", "comedy", "culture", "business", "music", "society", "education", "sports", "health"];
const SITEMAP_CHUNK_SIZE = 5_000;

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
const slugify = (value) => String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "radio";
const stationRoute = (station) => `/radio/${slugify(station.name)}-${station.stationuuid.toLowerCase()}`;
const podcastRoute = (show) => `/podcasts/${show.collectionId}/${slugify(show.collectionName)}`;
const facetRoute = (kind, value) => `/radio/${kind}/${slugify(value)}~${Buffer.from(value, "utf8").toString("base64url")}`;

const breadcrumbLd = (route, title) => {
  const section = route.startsWith("/podcasts") ? "Podcasts" : route.startsWith("/radio") ? "Radio" : null;
  const items = [{ "@type": "ListItem", position: 1, name: "Radiogram", item: `${SITE_URL}/` }];
  if (section) items.push({ "@type": "ListItem", position: 2, name: section, item: `${SITE_URL}/${section.toLowerCase()}` });
  if (route !== "/" && route !== `/${section?.toLowerCase()}`) items.push({ "@type": "ListItem", position: items.length + 1, name: title, item: `${SITE_URL}${route}` });
  return { "@type": "BreadcrumbList", itemListElement: items };
};

const fetchJson = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "Radiogram/1.0 (static-site-builder)" },
    });
    if (!response.ok) throw new Error(`${response.status} from ${url}`);
    return response.json();
  } finally {
    clearTimeout(timer);
  }
};

const withMeta = (template, { title, description, route, image, jsonLd, fallback }) => {
  const canonical = `${SITE_URL}${route}`;
  let html = template
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(description)}">`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(description)}">`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escapeHtml(title)}">`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${escapeHtml(description)}">`);
  if (image) {
    html = html
      .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeHtml(image)}">`)
      .replace(/<meta property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${escapeHtml(title)}">`)
      .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${escapeHtml(image)}">`)
      .replace(/<meta name="twitter:image:alt"[^>]*>/, `<meta name="twitter:image:alt" content="${escapeHtml(title)}">`);
  }
  if (jsonLd) {
    const entities = (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((entity) => ({ ...entity, "@context": undefined }));
    const graph = { "@context": "https://schema.org", "@graph": [...entities, breadcrumbLd(route, title)] };
    html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script></head>`);
  }
  return html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
};

const writeRoute = async (template, route, data) => {
  const directory = path.join(DIST, route.replace(/^\//, ""));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), withMeta(template, { ...data, route }), "utf8");
};

const fetchStations = async () => {
  const stations = [];
  for (let offset = 0; offset < stationLimit; offset += 1000) {
    const limit = Math.min(1000, stationLimit - offset);
    const params = new URLSearchParams({ hidebroken: "true", order: "votes", reverse: "true", limit: String(limit), offset: String(offset) });
    const batch = await fetchJson(`${apiHost}/json/stations/search?${params}`);
    stations.push(...batch.filter((item) => item.stationuuid && item.name && (item.url_resolved || item.url)));
    if (batch.length < limit) break;
  }
  return [...new Map(stations.map((station) => [station.stationuuid, station])).values()].slice(0, stationLimit);
};

const fetchPodcasts = async () => {
  const shows = new Map();
  for (const term of podcastTerms) {
    if (shows.size >= podcastLimit) break;
    const params = new URLSearchParams({ term, media: "podcast", entity: "podcast", limit: "200", country: "US" });
    const result = await fetchJson(`https://itunes.apple.com/search?${params}`);
    for (const show of result.results || []) {
      if (show.collectionId && show.collectionName) shows.set(show.collectionId, show);
      if (shows.size >= podcastLimit) break;
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  return [...shows.values()];
};

const fetchFacets = async (kind) => {
  const params = new URLSearchParams({ order: "stationcount", reverse: "true", hidebroken: "true", limit: "100000" });
  const facets = await fetchJson(`${apiHost}/json/${kind}?${params}`);
  return [...new Map(facets
    .map((item) => ({ ...item, name: item.name?.trim() || "", stationcount: Number(item.stationcount) || 0 }))
    .filter((item) => item.name && item.stationcount > 0)
    .map((item) => [item.name, item])).values()];
};

const stationPageData = (station) => {
  const name = station.name.trim();
  const country = station.country?.trim() || "the world";
  const details = [station.language, station.codec, station.bitrate > 0 ? `${station.bitrate} kbps` : null].filter(Boolean).join(" · ");
  const description = `Listen to ${name} live from ${country}. ${details || "Free worldwide internet radio stream."} Play online in Radiogram.`;
  return {
    title: `${name} live — listen online | Radiogram`, description, image: station.favicon || undefined,
    jsonLd: { "@context": "https://schema.org", "@type": "RadioStation", name, url: `${SITE_URL}${stationRoute(station)}`, areaServed: country, genre: (station.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean), image: station.favicon || undefined },
    fallback: `<main style="max-width:760px;margin:80px auto;padding:24px;font-family:system-ui;color:#ffebdd"><p style="color:#ff8c3b;text-transform:uppercase;letter-spacing:.12em">Live radio from ${escapeHtml(country)}</p><h1 style="font-size:48px">${escapeHtml(name)}</h1><p>${escapeHtml(description)}</p><p>${escapeHtml(details)}</p><a href="${escapeHtml(stationRoute(station))}" style="color:#ff8c3b">Listen live in Radiogram</a></main>`,
  };
};

const podcastPageData = (show) => {
  const name = show.collectionName.trim();
  const artist = show.artistName?.trim() || "its creators";
  const description = `Listen to ${name} by ${artist}. Browse the latest podcast episodes and play them online in Radiogram.`;
  return {
    title: `${name} podcast — episodes | Radiogram`, description, image: show.artworkUrl600 || undefined,
    jsonLd: { "@context": "https://schema.org", "@type": "PodcastSeries", name, author: { "@type": "Organization", name: artist }, url: `${SITE_URL}${podcastRoute(show)}`, image: show.artworkUrl600 || undefined, genre: show.genres || [] },
    fallback: `<main style="max-width:760px;margin:80px auto;padding:24px;font-family:system-ui;color:#ffebdd"><p style="color:#ff8c3b;text-transform:uppercase;letter-spacing:.12em">Podcast</p><h1 style="font-size:48px">${escapeHtml(name)}</h1><p>${escapeHtml(description)}</p><a href="${escapeHtml(podcastRoute(show))}" style="color:#ff8c3b">Browse episodes</a></main>`,
  };
};

const shellPageData = (title, description, heading, type = "CollectionPage") => ({
  title,
  description,
  jsonLd: { "@context": "https://schema.org", "@type": type, name: heading, description },
  fallback: `<main style="max-width:760px;margin:80px auto;padding:24px;font-family:system-ui;color:#ffebdd"><p style="color:#ff8c3b;text-transform:uppercase;letter-spacing:.12em">Radiogram</p><h1 style="font-size:48px">${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p></main>`,
});

const supportFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    ["How do I report a station issue?", "Email hpgameslab@gmail.com with the station name, stream URL if available, and a short description. We review every report."],
    ["How can a station owner or rights holder request a correction or removal?", "Email hpgameslab@gmail.com with the station name, listing details, requested action, and information showing your relationship to the station or content."],
    ["How do I restore purchases?", "Open Radiogram, go to Settings, and tap Restore Purchases. Make sure you are signed in with the same Apple ID used for the original purchase."],
    ["Why is a station unavailable?", "Stations sometimes go offline or change their stream URL without notice. If a station stays down for more than a few hours, contact Radiogram support."],
    ["How do I suggest a feature?", "Send your ideas to hpgameslab@gmail.com. Every email is read and product feedback is reviewed."],
  ].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
};

const main = async () => {
  const template = await readFile(path.join(DIST, "index.html"), "utf8");
  const routes = new Set(["/", "/radio", "/podcasts", "/support", "/privacy", "/terms"]);
  let stations = [];
  let podcasts = [];
  let countries = [];
  let tags = [];

  if (stationLimit > 0) {
    try { stations = await fetchStations(); } catch (error) { console.warn(`SEO station generation skipped: ${error.message}`); }
    try { [countries, tags] = await Promise.all([fetchFacets("countries"), fetchFacets("tags")]); } catch (error) { console.warn(`SEO facet generation skipped: ${error.message}`); }
  }
  if (podcastLimit > 0) {
    try { podcasts = await fetchPodcasts(); } catch (error) { console.warn(`SEO podcast generation skipped: ${error.message}`); }
  }

  for (const station of stations) {
    const route = stationRoute(station);
    await writeRoute(template, route, stationPageData(station));
    routes.add(route);
  }
  for (const show of podcasts) {
    const route = podcastRoute(show);
    await writeRoute(template, route, podcastPageData(show));
    routes.add(route);
  }

  const staticPages = [
    ["/radio", shellPageData("Live radio stations from around the world | Radiogram", "Explore live radio from around the world. Search and filter thousands of stations by country, genre, popularity, and name.", "Explore live radio")],
    ["/podcasts", shellPageData("Discover podcasts and episodes | Radiogram", "Search podcasts from the Apple Podcasts catalog, browse shows, and listen to episodes online free in Radiogram.", "Find your next listen")],
    ["/support", { ...shellPageData("Radiogram Support", "Get help with Radiogram radio playback, subscriptions, favorites, song recognition, and Apple device features.", "Radiogram Support", "WebPage"), jsonLd: [{ "@context": "https://schema.org", "@type": "WebPage", name: "Radiogram Support", description: "Get help with Radiogram radio playback, subscriptions, favorites, song recognition, and Apple device features." }, supportFaq] }],
    ["/privacy", shellPageData("Privacy Policy | Radiogram", "Read the Radiogram privacy policy for the website and Apple platform app.", "Privacy Policy", "WebPage")],
    ["/terms", shellPageData("Terms of Use | Radiogram", "Read the terms of use for Radiogram live radio, podcasts, and Apple platform app.", "Terms of Use", "WebPage")],
  ];
  for (const [route, data] of staticPages) {
    await writeRoute(template, route, data);
    routes.add(route);
  }
  for (const country of countries) {
    const route = facetRoute("country", country.name);
    await writeRoute(template, route, shellPageData(`Radio stations in ${country.name} — listen live | Radiogram`, `Listen to ${country.stationcount.toLocaleString()} live internet radio stations from ${country.name}. Browse free streams by popularity, name, genre, and language in Radiogram.`, `Radio in ${country.name}`));
    routes.add(route);
  }
  for (const tag of tags) {
    const route = facetRoute("tag", tag.name);
    await writeRoute(template, route, shellPageData(`${tag.name} radio stations — listen live | Radiogram`, `Listen to ${tag.stationcount.toLocaleString()} ${tag.name} radio stations online for free. Discover live worldwide streams in Radiogram.`, `${tag.name} radio`));
    routes.add(route);
  }

  const routeList = [...routes];
  const sitemapDate = new Date().toISOString().slice(0, 10);
  const sitemapChunks = Array.from({ length: Math.ceil(routeList.length / SITEMAP_CHUNK_SIZE) }, (_, index) => routeList.slice(index * SITEMAP_CHUNK_SIZE, (index + 1) * SITEMAP_CHUNK_SIZE));
  if (sitemapChunks.length === 1) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routeList.map((route) => `  <url><loc>${SITE_URL}${escapeHtml(route)}</loc><changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq></url>`).join("\n")}\n</urlset>\n`;
    await writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
  } else {
    for (const [index, chunk] of sitemapChunks.entries()) {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunk.map((route) => `  <url><loc>${SITE_URL}${escapeHtml(route)}</loc><changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq></url>`).join("\n")}\n</urlset>\n`;
      await writeFile(path.join(DIST, `sitemap-${index + 1}.xml`), sitemap, "utf8");
    }
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapChunks.map((_, index) => `  <sitemap><loc>${SITE_URL}/sitemap-${index + 1}.xml</loc><lastmod>${sitemapDate}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`;
    await writeFile(path.join(DIST, "sitemap.xml"), sitemapIndex, "utf8");
  }
  console.log(`Generated SEO: ${stations.length} stations, ${podcasts.length} podcasts, ${routes.size} sitemap URLs.`);
};

await main();
