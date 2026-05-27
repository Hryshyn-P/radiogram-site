import { Button } from "@/components/ui/button";
import { Radio, Globe2, Headphones, Sparkles, Heart, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Globe2,
    title: "Worldwide stations",
    description: "Thousands of internet radio stations from every corner of the world, in one elegant app.",
  },
  {
    icon: Headphones,
    title: "Crystal clear audio",
    description: "Optimized streaming with background playback, AirPlay, and lock-screen controls.",
  },
  {
    icon: Sparkles,
    title: "Beautifully simple",
    description: "A native iPhone experience designed to get out of the way and let you listen.",
  },
  {
    icon: Heart,
    title: "Made with care",
    description: "Built by a small independent team that reads every message and ships frequent updates.",
  },
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
              For iPhone
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              The world's radio,{" "}
              <span className="text-primary">in your pocket.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              Radiogram brings worldwide internet radio to your iPhone — beautifully designed,
              effortlessly fast.
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
            Everything you need to discover, save, and enjoy radio from anywhere in the world.
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

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-gradient-card p-10 text-center shadow-card md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(24_95%_58%/0.18),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Start listening today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Free to download. Tune into thousands of stations in seconds.
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
