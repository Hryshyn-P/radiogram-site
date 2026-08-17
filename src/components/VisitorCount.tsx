import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const VISITOR_COUNT_URL =
  "https://script.google.com/macros/s/AKfycbzAGLypF99XyzKfsulVgKb5GDKe5AvU-KJklYs2y1mis5blTRmxqqpeL9irusG4_Jil/exec";

const VisitorCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const { locale, t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);

    fetch(VISITOR_COUNT_URL, {
      credentials: "omit",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Visitor count returned ${response.status}`);
        return response.json() as Promise<{ visitors?: number }>;
      })
      .then(({ visitors }) => {
        if (Number.isFinite(visitors) && visitors! >= 0) setCount(visitors!);
      })
      .catch(() => undefined)
      .finally(() => window.clearTimeout(timeout));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  if (count === null) return null;

  return (
    <span
      className="visitor-count"
      aria-label={`${count.toLocaleString(locale)} ${t("uniqueVisitors")}`}
      title={t("uniqueVisitors")}
    >
      · {count.toLocaleString(locale)}
    </span>
  );
};

export default VisitorCount;
