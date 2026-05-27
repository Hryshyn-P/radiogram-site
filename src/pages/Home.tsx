import { Button } from "@/components/ui/button";
import {
  Radio,
  Globe2,
  Headphones,
  Sparkles,
  Search,
  Tags,
  Music2,
  Shuffle,
  Download,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Globe2,
    title: "25,000+ stations worldwide",
    description: "Explore live radio across 40+ languages, thousands of genres, and stations from every corner of the world.",
  },
  {
    icon: Search,
    title: "Smart discovery",
    description: "Search by station, genre, country, tag, and keywords, then filter by geo, popularity, recent plays, or nearby stations.",
  },
  {
    icon: Music2,
    title: "Track recognition",
    description: "Recognize songs with Shazam-powered lookup, save found tracks, and keep favorite stations close.",
  },
  {
    icon: Headphones,
    title: "Native Apple experience",
    description: "Designed for iPhone, iPad, and Mac with background playback, Lock Screen controls, widgets, and Apple Watch support.",
  },
];

const discoveryTags = [
  "Music",
  "Podcasts",
  "News",
  "Ambient",
  "Meditation",
  "Soundtracks",
  "Comedy",
  "Audiobooks",
  "Fan stations",
  "Niche genres",
];

const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(24_95%_58%/0.18),transparent_60%)]" />
        <div className="container relative mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow">
              <Radio className="h-8 w-8 text-primary-foreground" strokeWidth={2.25} />
            </div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              For iPhone, iPad, and Mac
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              The world's radio,{" "}
              <span className="text-primary">on every Apple screen.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              Radiogram is a modern world internet radio player for music discovery,
              convenience, and deep Apple platform integration.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-accent text-primary-foreground shadow-glow hover:opacity-95"
              >
                <a href="#" aria-label="Download on the App Store">
                  <Download className="mr-2 h-4 w-4" /> Download on the App Store
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border bg-card/40 backdrop-blur hover:bg-card"
              >
                <Link to="/support">
                  Get Support <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Why Radiogram
          </p>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Tuned for the way you listen
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            Everything you need to discover, save, and enjoy radio across iPhone, iPad, and Mac.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-gradient-card p-7 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discovery */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="container mx-auto px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Discover more
              </p>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                From mainstream radio to deeply specific niche stations.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Browse music, podcasts, news, ambient, meditation, soundtracks, comedy,
                audiobooks, fan stations, and thousands of smaller categories in one place.
                Most core features are available completely free.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-gradient-card p-7 shadow-card">
                <Tags className="mb-5 h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">Flexible browsing</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Country and tag categories, recent and popular sections, dynamic trending
                  rankings, and grid or list display modes.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-gradient-card p-7 shadow-card">
                <Shuffle className="mb-5 h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">Quick exploration</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Jump into something new with random station discovery, recently played sorting,
                  interactive likes, and visit counters.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-gradient-card p-7 shadow-card sm:col-span-2">
                <Sparkles className="mb-5 h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">Built for real listening</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A built-in mini player, full-size vinyl-inspired player, station logos, current
                  track info, favorites from the player, light and dark themes, and multiple app
                  icon styles.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-2">
            {discoveryTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-gradient-card p-10 text-center shadow-card md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(24_95%_58%/0.18),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Start listening today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Free to download. Tune into worldwide radio on iPhone, iPad, and Mac in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-accent text-primary-foreground shadow-glow hover:opacity-95"
              >
                <a href="#">
                  <Download className="mr-2 h-4 w-4" /> Download on the App Store
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/support">Support Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
