const siteUrl = (process.env.SITE_URL || "https://radiogram-site.duckdns.org").replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY || "dc1ae425cbe4cd9786519029c9576912";
const keyLocation = `${siteUrl}/${key}.txt`;
const sitemapUrl = `${siteUrl}/sitemap.xml?deploy=${encodeURIComponent(process.env.GITHUB_SHA || Date.now())}`;
const batchSize = 10_000;

const fetchText = async (url) => {
  const response = await fetch(url, { headers: { Accept: "application/xml,text/xml" } });
  if (!response.ok) throw new Error(`${response.status} from ${url}`);
  return response.text();
};

const collectUrls = async (url, seen = new Set()) => {
  if (seen.has(url)) return [];
  seen.add(url);

  const xml = await fetchText(url);
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'"),
  );

  if (!xml.includes("<sitemapindex")) return locations;

  const nested = await Promise.all(locations.map((location) => collectUrls(location, seen)));
  return nested.flat();
};

const urls = [...new Set(await collectUrls(sitemapUrl))].filter((url) => url.startsWith(`${siteUrl}/`));
if (!urls.length) throw new Error("No site URLs found in sitemap");

for (let index = 0; index < urls.length; index += batchSize) {
  const urlList = urls.slice(index, index + batchSize);
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation, urlList }),
  });
  if (!response.ok && response.status !== 202) {
    throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
  }
  console.log(`IndexNow accepted ${urlList.length} URLs (${response.status}).`);
}
