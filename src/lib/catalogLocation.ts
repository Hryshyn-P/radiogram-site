export type StationSort = "votes" | "name" | "clickcount" | "random";

const parseSelections = (value: string | null) =>
  value?.split("|").filter(Boolean).slice(0, 3) || [];

export const catalogSelectionsFromLocation = (
  routeCountry: string | undefined,
  routeTag: string | undefined,
  searchParams: URLSearchParams,
) => ({
  countries: routeCountry ? [routeCountry] : parseSelections(searchParams.get("country")),
  tags: routeTag ? [routeTag] : parseSelections(searchParams.get("tag")),
  languages: parseSelections(searchParams.get("language")).slice(0, 1),
  query: searchParams.get("q") || "",
  sort: (searchParams.get("sort") as StationSort) || "votes",
});
