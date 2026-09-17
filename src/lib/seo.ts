import { useEffect } from "react";

export const SITE_URL = "https://radiogram-site.duckdns.org";
const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/app-showcase/01-station-search.webp`;
const INDEX_ROBOTS = "index,follow,max-image-preview:large";
const canonicalPath = (path: string) => path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;

type SeoOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "music.radio_station";
  noIndex?: boolean;
};

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

export const useSeo = ({ title, description, path = "/", image, type = "website", noIndex }: SeoOptions) => {
  useEffect(() => {
    const socialImage = image || DEFAULT_SOCIAL_IMAGE;
    const canonicalUrl = `${SITE_URL}${canonicalPath(path)}`;
    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="robots"]', "name", "robots", noIndex ? "noindex,follow" : INDEX_ROBOTS);
    upsertMeta('meta[property="og:image"]', "property", "og:image", socialImage);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", socialImage);
    upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", title);
    upsertMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", title);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, image, noIndex, path, title, type]);
};
