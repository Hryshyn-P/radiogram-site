export const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "radio";

export const stationPath = (name: string, uuid: string) =>
  `/radio/${slugify(name)}-${uuid.toLowerCase()}`;

export const podcastPath = (name: string, id: number) =>
  `/podcasts/${id}/${slugify(name)}`;

const encodeFacetValue = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const decodeFacetValue = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
};

export const facetPath = (kind: "country" | "tag", value: string) =>
  `/radio/${kind}/${slugify(value)}~${encodeFacetValue(value)}`;

export const decodeFacetParam = (parameter?: string) => {
  if (!parameter) return undefined;
  const separator = parameter.lastIndexOf("~");
  if (separator >= 0) {
    try {
      return decodeFacetValue(parameter.slice(separator + 1));
    } catch {
      // Older or manually entered routes still fall back to their readable slug.
    }
  }
  return decodeURIComponent(parameter).replace(/-/g, " ");
};
