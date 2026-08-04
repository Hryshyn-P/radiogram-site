import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <button className={`scroll-top ${visible ? "is-visible" : ""}`} type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={t("backToTop")} title={t("backToTop")}>
      <ArrowUp />
    </button>
  );
};

export default ScrollToTopButton;
