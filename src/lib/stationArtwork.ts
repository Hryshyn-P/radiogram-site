import type { CSSProperties } from "react";

const stationPalettes = [
  ["#57473d", "#29211f"],
  ["#384f4a", "#1a2929"],
  ["#4d455c", "#262130"],
  ["#455438", "#1f291a"],
  ["#4a3d38", "#1f1a1a"],
  ["#364559", "#171f2e"],
] as const;

const artworkHash = (value: string) => Array.from(value).reduce(
  (hash, character) => ((hash * 33) + (character.codePointAt(0) || 0)) & 0x7fffffff,
  0,
);

export const stationInitial = (title: string) =>
  Array.from(title).find((character) => /\p{L}/u.test(character))?.toLocaleUpperCase() || "R";

export const stationArtworkStyle = (id: string, title: string) => {
  const palette = stationPalettes[artworkHash(`${id}|${title}`) % stationPalettes.length];
  return { "--artwork-start": palette[0], "--artwork-end": palette[1] } as CSSProperties;
};
