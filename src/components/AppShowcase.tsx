import { ChevronLeft, ChevronRight, Smartphone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const slides = [
  { src: "/app-showcase/01-station-search.webp", title: "Find your station" },
  { src: "/app-showcase/02-smart-search.webp", title: "Search every match" },
  { src: "/app-showcase/03-song-recognition.webp", title: "Identify any track" },
  { src: "/app-showcase/04-station-swipe.webp", title: "Swipe between stations" },
  { src: "/app-showcase/05-player-swipe.webp", title: "Dismiss the player naturally" },
  { src: "/app-showcase/06-podcasts.webp", title: "Discover podcasts" },
  { src: "/app-showcase/07-favorites.webp", title: "Keep every favorite" },
  { src: "/app-showcase/08-layouts.webp", title: "Choose your layout" },
  { src: "/app-showcase/09-random-station.webp", title: "Let chance choose" },
  { src: "/app-showcase/10-lock-screen.webp", title: "Control the Lock Screen" },
  { src: "/app-showcase/11-control-center.webp", title: "Launch from Control Center" },
  { src: "/app-showcase/12-widgets.webp", title: "Pick your widget" },
  { src: "/app-showcase/13-quick-actions.webp", title: "Use quick actions" },
  { src: "/app-showcase/14-languages.webp", title: "Listen in your language" },
];
const loopSlides = Array.from({ length: 3 }, (_, copy) => slides.map((slide, index) => ({ ...slide, copy, index }))).flat();
const middleStart = slides.length;
const manualCooldown = 3000;
const modulo = (value: number) => (value + slides.length) % slides.length;

const AppShowcase = () => {
  const { t } = useLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualScrollRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const draggedRef = useRef(false);
  const initialPositionRef = useRef(true);
  const [position, setPosition] = useState(middleStart);
  const [activePosition, setActivePosition] = useState(middleStart);
  const [interacting, setInteracting] = useState(false);
  const [cooldownPending, setCooldownPending] = useState(false);
  const [cooldownVersion, setCooldownVersion] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const scrollToPosition = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    const slide = slideRefs.current[index];
    if (!viewport || !slide) return;
    const target = slide.offsetLeft - (viewport.clientWidth - slide.clientWidth) / 2;
    viewport.scrollTo({ left: Math.max(0, target), behavior });
  }, []);

  useEffect(() => {
    const firstPosition = initialPositionRef.current;
    initialPositionRef.current = false;
    const behavior = firstPosition || reduceMotion ? "auto" : "smooth";
    scrollToPosition(position, behavior);
    if (normalizeTimerRef.current) clearTimeout(normalizeTimerRef.current);
    if (position < middleStart || position >= middleStart * 2) {
      normalizeTimerRef.current = setTimeout(() => {
        const normalized = middleStart + modulo(position);
        scrollToPosition(normalized, "auto");
        setActivePosition(normalized);
        setPosition(normalized);
      }, reduceMotion ? 0 : 650);
    }
  }, [position, reduceMotion, scrollToPosition]);

  useEffect(() => {
    if (interacting || reduceMotion || !inView) return;
    if (cooldownPending) {
      const cooldown = window.setTimeout(() => {
        setCooldownPending(false);
        setPosition((index) => index + 1);
      }, manualCooldown);
      return () => window.clearTimeout(cooldown);
    }
    const timer = window.setInterval(() => {
      setPosition((index) => index + 1);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [cooldownPending, cooldownVersion, inView, interacting, reduceMotion]);

  useEffect(() => () => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    if (normalizeTimerRef.current) clearTimeout(normalizeTimerRef.current);
  }, []);

  const startAutoplayCooldown = () => {
    setCooldownPending(true);
    setCooldownVersion((version) => version + 1);
  };

  const closestSlide = () => {
    const viewport = viewportRef.current;
    if (!viewport) return middleStart;
    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    let closest = middleStart;
    let closestDistance = Number.POSITIVE_INFINITY;
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - viewportCenter);
      if (distance < closestDistance) { closest = index; closestDistance = distance; }
    });
    return closest;
  };

  const syncScrollPosition = () => {
    const closest = closestSlide();
    manualScrollRef.current = false;
    setInteracting(false);
    setActivePosition(closest);
    setPosition(closest);
    startAutoplayCooldown();
  };

  const scheduleScrollSync = () => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(syncScrollPosition, 140);
  };

  const handleScroll = () => {
    setActivePosition(closestSlide());
    if (!manualScrollRef.current) return;
    scheduleScrollSync();
  };

  const move = (direction: -1 | 1) => {
    manualScrollRef.current = false;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    setInteracting(false);
    setPosition((index) => index + direction);
    startAutoplayCooldown();
  };

  const activatePosition = (index: number) => {
    manualScrollRef.current = false;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    setInteracting(false);
    setActivePosition(index);
    setPosition(index);
    startAutoplayCooldown();
  };

  const beginManualInteraction = () => {
    if (normalizeTimerRef.current) clearTimeout(normalizeTimerRef.current);
    manualScrollRef.current = true;
    setInteracting(true);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    draggedRef.current = false;
    beginManualInteraction();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    if (!start || draggedRef.current) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) draggedRef.current = true;
  };

  const handlePointerEnd = () => {
    pointerStartRef.current = null;
    if (!draggedRef.current) {
      manualScrollRef.current = false;
      setInteracting(false);
    } else {
      scheduleScrollSync();
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) < 1 && !event.shiftKey) return;
    beginManualInteraction();
    scheduleScrollSync();
  };

  const active = modulo(activePosition);

  return (
    <section
      className="app-showcase"
      aria-labelledby="app-showcase-title"
    >
      <div className="page-shell app-showcase__heading">
        <div>
          <span className="eyebrow"><Smartphone /> {t("showcaseEyebrow")}</span>
          <h2 id="app-showcase-title">{t("showcaseTitle")}</h2>
          <p>{t("showcaseBody")}</p>
        </div>
        <div className="app-showcase__controls">
          <span><strong>{String(active + 1).padStart(2, "0")}</strong> / {String(slides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => move(-1)} aria-label={t("previousSlide")}><ChevronLeft /></button>
          <button type="button" onClick={() => move(1)} aria-label={t("nextSlide")}><ChevronRight /></button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className="page-shell app-showcase__viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("showcaseTitle")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onWheel={handleWheel}
        onScroll={handleScroll}
      >
        <div className="app-showcase__track">
          {loopSlides.map((slide, physicalIndex) => {
            const accessible = slide.copy === 1;
            return (
            <figure
              key={`${slide.copy}-${slide.src}`}
              ref={(node) => { slideRefs.current[physicalIndex] = node; }}
              className={physicalIndex === activePosition ? "is-active" : ""}
              role={accessible ? "button" : undefined}
              tabIndex={accessible ? 0 : -1}
              aria-roledescription={accessible ? "slide" : undefined}
              aria-label={accessible ? `${slide.index + 1} / ${slides.length}: ${slide.title}` : undefined}
              aria-hidden={accessible ? undefined : true}
              onClick={() => {
                if (draggedRef.current) { draggedRef.current = false; return; }
                activatePosition(physicalIndex);
              }}
              onKeyDown={accessible ? (event) => {
                if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activatePosition(physicalIndex); }
              } : undefined}
            >
              <img src={slide.src} alt={accessible ? slide.title : ""} width="640" height="1388" loading="lazy" decoding="async" />
              <figcaption><span>{String(slide.index + 1).padStart(2, "0")}</span><strong>{slide.title}</strong></figcaption>
            </figure>
          ); })}
        </div>
      </div>
      <div className="page-shell app-showcase__progress" aria-hidden="true"><span style={{ width: `${((active + 1) / slides.length) * 100}%` }} /></div>
    </section>
  );
};

export default AppShowcase;
