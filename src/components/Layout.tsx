import { CircleHelp, Download, FileText, Globe2, Headphones, Menu, Radio, ShieldCheck, X } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AppPlayer, { APP_STORE_URL } from "./AppPlayer";
import ScrollToTopButton from "./ScrollToTopButton";
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
          <nav className="desktop-nav" aria-label="Main navigation">{navItems.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => cn(isActive && "is-active")}><item.icon />{item.label}</NavLink>)}</nav>
          <div className="header-actions">{languageSelect}<a className="header-download download-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer"><Download /> {t("getApp")}</a><button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label={t("toggleMenu")}>{open ? <X /> : <Menu />}</button></div>
        </div>
        {open && <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}><item.icon />{item.label}</NavLink>)}<span className="mobile-nav__divider" />{mobileInfoItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}><item.icon />{item.label}</NavLink>)}<span className="mobile-nav__divider" /><a className="download-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer"><Download /> {t("getApp")}</a></nav>}
      </header>
      <main className="site-main"><Outlet /></main>
      <footer className="site-footer">
        <div className="page-shell site-footer__grid"><div><Link to="/" className="brand"><span className="brand__mark"><Radio /></span><span>Radiogram</span></Link><p>{t("footerTagline")}</p></div><div><strong>{t("listen")}</strong><Link to="/radio">{t("liveRadio")}</Link><Link to="/podcasts">{t("podcasts")}</Link></div><div><strong>{t("helpLegal")}</strong><Link to="/support">{t("support")}</Link><Link to="/privacy">{t("privacy")}</Link><Link to="/terms">{t("terms")}</Link></div><div><strong>{t("getInTouch")}</strong><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><a href="https://www.radio-browser.info/" target="_blank" rel="noreferrer">{t("radioData")}</a></div></div>
        <div className="page-shell site-footer__bottom"><span>© {new Date().getFullYear()} Radiogram</span><span>{t("curiousEars")}</span></div>
      </footer>
      <ScrollToTopButton />
      <AppPlayer />
    </div>
  );
};

export default Layout;
