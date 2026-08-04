import { Radio } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { stationArtworkStyle, stationInitial } from "@/lib/stationArtwork";

type ArtworkProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackId?: string;
  fallbackTitle?: string;
};

export const Artwork = ({ src, alt, className, fallbackId, fallbackTitle }: ArtworkProps) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const fallbackStyle = useMemo(() => {
    if (!fallbackTitle) return undefined;
    return stationArtworkStyle(fallbackId || "", fallbackTitle);
  }, [fallbackId, fallbackTitle]);

  return (
    <div className={cn("artwork", fallbackTitle && "artwork--station-fallback", className)} style={fallbackStyle}>
      {src && !failed ? (
        <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : fallbackTitle ? (
        <span className="artwork__initial" aria-hidden="true">{stationInitial(fallbackTitle)}</span>
      ) : (
        <Radio aria-hidden="true" />
      )}
    </div>
  );
};
