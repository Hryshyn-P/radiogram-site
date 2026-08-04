import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { podcastPath } from "@/lib/slug";
import type { PodcastShow } from "@/types/catalog";
import { Artwork } from "./Artwork";

const PodcastCard = ({ show }: { show: PodcastShow }) => (
  <Link to={podcastPath(show.name, show.id)} className="podcast-card">
    <Artwork src={show.artworkUrl} alt={`${show.name} cover`} className="podcast-card__art" />
    <span>
      <strong>{show.name}</strong>
      <small>{show.artistName || show.genres[0] || "Podcast"}</small>
    </span>
    <ChevronRight />
  </Link>
);

export default PodcastCard;
