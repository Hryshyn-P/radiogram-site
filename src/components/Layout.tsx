import { CircleHelp, Download, FileText, Globe2, Headphones, Menu, Radio, ShieldCheck, X } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AppPlayer, { APP_STORE_URL } from "./AppPlayer";
import ScrollToTopButton from "./ScrollToTopButton";
import VisitorCount from "./VisitorCount";
import { appLanguages, type AppLanguage, useLanguage } from "@/context/LanguageContext";

export const SUPPORT_EMAIL = "hpgameslab@gmail.com";
const Layout = () => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navItems = [{ to: "/radio", label: t("radio"), icon: Radio }, { to: "/podcasts", label: t("podcasts"), icon: Headphones }];
  const mobileInfoItems = [
    { to: "/support", label: t("support"), icon: CircleHelp },
    { to: "/privacy", label: t("privacy"), icon: ShieldCheck },
    { to: "/terms", label: t("terms"), icon: FileText },
  ];
  const languageSelect = <label className="language-select" aria-label={t("interfaceLanguage")}><Globe2 /><select value={language} onChange={(event) => setLanguage(event.target.value as AppLanguage)} aria-label={t("interfaceLanguage")}>{appLanguages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select><span className="language-select__short" aria-hidden="true">{appLanguages.find((item) => item.code === language)?.short}</span></label>;
  return (
    <div className="site-frame">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}><span className="brand__mark"><Radio /></span><span>Radiogram</span></Link>
          <nav className="desktop-nav" aria-label={t("mainNavigation")}>{navItems.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => cn(isActive && "is-active")}><item.icon />{item.label}</NavLink>)}</nav>
          <div className="header-actions">{languageSelect}<a className="header-download download-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer"><Download /> {t("getApp")}</a><button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label={t("toggleMenu")}>{open ? <X /> : <Menu />}</button></div>
        </div>
        {open && <nav className="mobile-nav" aria-label={t("mobileNavigation")}>{navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}><item.icon />{item.label}</NavLink>)}<span className="mobile-nav__divider" />{mobileInfoItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}><item.icon />{item.label}</NavLink>)}<span className="mobile-nav__divider" /><a className="download-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer"><Download /> {t("getApp")}</a></nav>}
      </header>
      <main className="site-main"><Outlet /></main>
      <footer className="site-footer">
        <div className="page-shell site-footer__grid"><div><Link to="/" className="brand"><span className="brand__mark"><Radio /></span><span>Radiogram</span></Link><p>{t("footerTagline")}</p></div><div><strong>{t("listen")}</strong><Link to="/radio">{t("liveRadio")}</Link><Link to="/podcasts">{t("podcasts")}</Link></div><div><strong>{t("helpLegal")}</strong><Link to="/support">{t("support")}</Link><Link to="/privacy">{t("privacy")}</Link><Link to="/terms">{t("terms")}</Link></div><div><strong>{t("getInTouch")}</strong><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><a href="https://www.radio-browser.info/" target="_blank" rel="noreferrer">{t("radioData")}</a></div></div>
        <div className="page-shell site-footer__badges" aria-label="Radiogram directory listings">
          <a href="https://neeed.directory" target="_blank" rel="noopener"><img src="https://neeed.directory/badges/neeed-badge-light.svg" alt="Featured on neeed.directory" width="139" loading="lazy" /></a>
          <a href="https://shinylaunch.com/product/radiogram-site-duckdns" target="_blank" rel="noopener"><img src="https://shinylaunch.com/assets/images/badge-dark.png" alt="ShinyLaunch" height="54" loading="lazy" /></a>
          <a href="https://mylaunchstash.com/product/radiogram-site-duckdns" target="_blank" rel="noopener"><img src="https://mylaunchstash.com/assets/images/badge-dark.png" alt="My Launch Stash" height="54" loading="lazy" /></a>
          <a href="https://productwing.com/product/radiogram-site-duckdns" target="_blank" rel="noopener"><img src="https://productwing.com/assets/images/badge-dark.png" alt="Product Wing" height="54" loading="lazy" /></a>
          <a href="https://spacerrapps.com/apps/radiogram?utm_source=badge&amp;utm_medium=referral&amp;utm_campaign=featured" target="_blank" rel="noopener"><img src="https://spacerrapps.com/badge/radiogram.svg?v=3&amp;theme=dark" alt="Radiogram is featured on SpacerrApps" width="234" height="54" loading="lazy" /></a>
          <a href="https://www.foundrlist.com/product/radiogram-2?utm_source=badge&amp;utm_medium=embed" target="_blank" rel="noopener"><img src="https://www.foundrlist.com/api/badge/radiogram-2" alt="Featured on FoundrList" width="150" height="48" loading="lazy" /></a>
          <a href="https://spotstartups.com" target="_blank" rel="noopener"><img src="https://spotstartups.com/assets/badges/spotstartups.com_badge_light.svg" width="175" height="55" alt="Featured on Spot Startups - A Free Product Hunt Alternative" loading="lazy" /></a>
          <a href="https://easylaunch.dev/mobile/radiogram" target="_blank" rel="noopener"><img src="https://easylaunch.dev/badge/easylaunch-badge-light.svg" alt="Featured on EasyLaunch" width="188" height="56" loading="lazy" /></a>
          <a href="https://turbo0.com/item/radiogram" target="_blank" rel="noopener noreferrer"><img src="https://img.turbo0.com/badge-listed-light.svg" alt="Listed on Turbo0" height="54" loading="lazy" /></a>
          <a href="https://openhunts.com" target="_blank" title="OpenHunts Club" rel="noopener"><img alt="OpenHunts Club Member" height="105" src="https://cdn.openhunts.com/badges/club.webp" style={{ width: "195px", height: "auto" }} width="486" loading="lazy" /></a>
        </div>
        <div className="page-shell site-footer__bottom"><span>© {new Date().getFullYear()} Radiogram <VisitorCount /></span><span>{t("curiousEars")}</span></div>
      </footer>
      <ScrollToTopButton />
      <AppPlayer />
    </div>
  );
};

export default Layout;
