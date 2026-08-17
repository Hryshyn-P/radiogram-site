import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const MEASUREMENT_ID = "G-RM0CLWH4WJ";
const CONSENT_KEY = "radiogram-analytics-consent";

type Consent = "granted" | "denied" | null;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const enableAnalytics = () => {
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = analyticsWindow.gtag || ((...args: unknown[]) => analyticsWindow.dataLayer?.push(args));
  analyticsWindow.gtag("js", new Date());
  analyticsWindow.gtag("config", MEASUREMENT_ID, { send_page_view: false });

  if (!document.querySelector(`script[data-measurement-id="${MEASUREMENT_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.dataset.measurementId = MEASUREMENT_ID;
    document.head.appendChild(script);
  }
};

const Analytics = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [consent, setConsent] = useState<Consent>(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  });

  useEffect(() => {
    if (consent !== "granted") return;
    enableAnalytics();
  }, [consent]);

  useEffect(() => {
    if (consent !== "granted") return;
    const analyticsWindow = window as AnalyticsWindow;
    analyticsWindow.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}`,
      page_title: document.title,
    });
  }, [consent, location.pathname, location.search]);

  const choose = (value: Exclude<Consent, null>) => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  if (consent !== null) return null;

  return (
    <aside
      aria-label={t("analyticsConsent")}
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        {t("analyticsBody")} {t("seeOur")} {" "}
        <Link className="text-primary underline underline-offset-4" to="/privacy">{t("privacy")}</Link>.
      </p>
      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium" onClick={() => choose("denied")}>{t("decline")}</button>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => choose("granted")}>{t("acceptAnalytics")}</button>
      </div>
    </aside>
  );
};

export default Analytics;
