import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Bug, Briefcase, Radio, Mail, Clock, Heart, Coffee, Twitter } from "lucide-react";
import { SUPPORT_EMAIL } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";

const IndieHackersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" />
    <text
      x="12"
      y="15"
      fill="hsl(var(--primary-foreground))"
      fontFamily="sans-serif"
      fontSize="8"
      fontWeight="800"
      textAnchor="middle"
    >
      IH
    </text>
  </svg>
);

const Support = () => {
  const { t } = useLanguage();
  const faqs = [1, 2, 3, 4, 5].map((number) => ({ q: t(`faq${number}Q`), a: t(`faq${number}A`).replace("{email}", SUPPORT_EMAIL) }));
  const supportLinks = [
    { name: "Patreon", title: t("supportPatreon"), ariaLabel: t("supportPatreonAria"), description: t("supportPatreonBody"), href: "https://www.patreon.com/c/HPGamesLab", icon: Heart },
    { name: "Ko-fi", title: t("supportKofi"), ariaLabel: t("supportKofiAria"), description: t("supportKofiBody"), href: "https://ko-fi.com/hpgameslab", icon: Coffee },
    { name: "Twitter", title: t("followTwitter"), ariaLabel: t("followTwitterAria"), description: t("followTwitterBody"), href: "https://x.com/hpgameslab", icon: Twitter },
    { name: "Indie Hackers", title: t("followIndieHackers"), ariaLabel: t("followIndieHackersAria"), description: t("followIndieHackersBody"), href: "https://www.indiehackers.com/hpgameslab", icon: IndieHackersIcon },
  ];
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(24_95%_58%/0.15),transparent_60%)]" />
        <div className="container relative mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow">
              <Radio className="h-8 w-8 text-primary-foreground" strokeWidth={2.25} />
            </div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              {t("supportCenter")}
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Radiogram <span className="text-primary">{t("support")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              {t("supportHeroBody")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-accent text-primary-foreground shadow-glow hover:opacity-95"
              >
                <a href={`mailto:${SUPPORT_EMAIL}`}>
                  <Mail className="mr-2 h-4 w-4" /> {t("contactSupport")}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border bg-card/40 backdrop-blur hover:bg-card"
              >
                <a href="#faq">{t("browseFaq")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help */}
      <section className="container mx-auto px-6 py-20 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {t("needHelp")}
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            {t("smallTeamBody")} <span className="text-foreground">{t("oneToThreeDays")}</span>.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <ContactCard
            icon={<Bug className="h-5 w-5" />}
            label={t("bugReports")}
            title={t("somethingWrong")}
            description={t("bugReportBody")}
            email={SUPPORT_EMAIL}
            subject={t("bugEmailSubject")}
          />
          <ContactCard
            icon={<Briefcase className="h-5 w-5" />}
            label={t("businessInquiries")}
            title={t("partnershipsPress")}
            description={t("businessBody")}
            email={SUPPORT_EMAIL}
            subject={t("businessEmailSubject")}
          />
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          {t("averageResponse")}
        </div>
      </section>

      {/* Support Development */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="container mx-auto px-6 py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("supportDevelopment")}
            </p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {t("keepGrowing")}
            </h2>
            <p className="mt-5 text-base text-muted-foreground md:text-lg">
              {t("supportDevelopmentBody")}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {supportLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-gradient-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                aria-label={link.ariaLabel}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <link.icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold tracking-tight">{link.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/60 bg-card/30">
        <div className="container mx-auto px-6 py-20 md:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">{t("faqLabel")}</p>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {t("frequentlyAsked")}
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-2xl border border-border bg-gradient-card px-5 shadow-card"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline md:text-lg">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
};

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  email: string;
  subject: string;
}

const ContactCard = ({ icon, label, title, description, email, subject }: ContactCardProps) => (
  <a
    href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
    className="group relative flex flex-col rounded-2xl border border-border bg-gradient-card p-7 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
  >
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
    <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
    <p className="mt-3 flex-1 text-sm text-muted-foreground">{description}</p>
    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
      <Mail className="h-4 w-4" />
      {email}
    </div>
  </a>
);

export default Support;
