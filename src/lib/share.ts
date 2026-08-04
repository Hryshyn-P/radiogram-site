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
  if (navigator.share) {
    await navigator.share(data).catch(() => undefined);
    return;
  }
  const clipboardText = [data.text, data.url].filter(Boolean).join("\n\n");
  await navigator.clipboard?.writeText(clipboardText);
};
