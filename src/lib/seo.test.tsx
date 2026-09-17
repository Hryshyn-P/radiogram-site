import { render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { useSeo } from "./seo";

const SeoProbe = (props: Parameters<typeof useSeo>[0]) => {
  useSeo(props);
  return null;
};

afterEach(() => {
  document.head.innerHTML = "";
});

it("resets route metadata instead of retaining a previous page's image or robots policy", () => {
  const { rerender } = render(<SeoProbe title="Station" description="Live station" path="/radio/station" image="https://cdn.example/station.png" type="music.radio_station" />);

  rerender(<SeoProbe title="Podcasts" description="Discover podcasts" path="/podcasts" />);

  expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute("content", "https://radiogram-site.duckdns.org/app-showcase/01-station-search.webp");
  expect(document.head.querySelector('meta[property="og:image:alt"]')).toHaveAttribute("content", "Podcasts");
  expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index,follow,max-image-preview:large");

  rerender(<SeoProbe title="Not found" description="Missing page" path="/missing" noIndex />);

  expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
});
