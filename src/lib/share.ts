const RADIOGRAM_UNIVERSAL_LINK_ORIGIN = "https://radiogramapp.duckdns.org";

const universalLink = (kind: "station" | "podcast", id: string | number) =>
  `${RADIOGRAM_UNIVERSAL_LINK_ORIGIN}/${kind}/${encodeURIComponent(String(id))}`;

export const stationShareData = (name: string, stationId: string): ShareData => ({
  title: name,
  text: `📻 Listen to ${name} on Radiogram 🎶`,
  url: universalLink("station", stationId),
});

export const podcastShareData = (name: string, collectionId: number): ShareData => ({
  title: name,
  text: `🎙️ Listen to ${name} on Radiogram FM 🎧`,
  url: universalLink("podcast", collectionId),
});

export const shareOrCopy = async (data: ShareData) => {
  const { url, text, ...rest } = data;
  const sharedText = [text, url].filter(Boolean).join("\n\n");

  if (navigator.share) {
    await navigator.share({ ...rest, text: sharedText }).catch(() => undefined);
    return;
  }
  await navigator.clipboard?.writeText(sharedText);
};
