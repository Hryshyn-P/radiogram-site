import { ExternalLink, Play, Video, Volume2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const VIDEO_ID = "wP53BuDb_Jg";
const VIDEO_URL = `https://www.youtube.com/shorts/${VIDEO_ID}`;
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&playsinline=1`;

const AppTourVideo = () => {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);

  return (
    <section className="app-tour" aria-labelledby="app-tour-title">
      <div className="page-shell app-tour__inner">
        <div className="app-tour__copy">
          <span className="eyebrow"><Video /> {t("tourEyebrow")}</span>
          <h2 id="app-tour-title">{t("tourTitle")}</h2>
          <p>{t("tourBody")}</p>
          <a href={VIDEO_URL} target="_blank" rel="noreferrer">
            {t("tourYoutube")} <ExternalLink />
          </a>
        </div>

        <div className="app-tour__media">
          {playing ? (
            <iframe
              src={EMBED_URL}
              title={t("tourTitle")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button type="button" className="app-tour__poster" onClick={() => setPlaying(true)} aria-label={t("tourPlay")}>
              <img src="/app-showcase/01-station-search.webp" alt="" width="640" height="1388" loading="lazy" decoding="async" />
              <span className="app-tour__shade" aria-hidden="true" />
              <span className="app-tour__duration"><Volume2 /> {t("tourDuration")}</span>
              <span className="app-tour__play" aria-hidden="true"><Play /></span>
              <strong>{t("tourPlay")}</strong>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppTourVideo;
