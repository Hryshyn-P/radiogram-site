import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Bug, Briefcase, Radio, Mail, Clock, ShieldCheck, FileText } from "lucide-react";

const SUPPORT_EMAIL = "hpgameslab@gmail.com";

const faqs = [
  {
    q: "How do I report a station issue?",
    a: `Tap the station, then use the report option, or email us at ${SUPPORT_EMAIL} with the station name and a short description. We review every report.`,
  },
  {
    q: "How do I restore purchases?",
    a: "Open Radiogram, go to Settings, and tap 'Restore Purchases'. Make sure you are signed in with the same Apple ID used for the original purchase.",
  },
  {
    q: "Why is a station unavailable?",
    a: "Stations sometimes go offline or change their stream URL without notice. If a station stays down for more than a few hours, please let us know and we'll update it.",
  },
  {
    q: "How do I suggest a feature?",
    a: `We love feedback. Send your ideas to ${SUPPORT_EMAIL} — every email is read by a human, and many features come directly from listener suggestions.`,
  },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(24_95%_58%/0.15),transparent_60%)]" />
        <div className="container relative mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow">
              <Radio className="h-8 w-8 text-primary-foreground" strokeWidth={2.25} />
            </div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Support Center
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Radiogram <span className="text-primary">Support</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              Worldwide internet radio for iPhone.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-gradient-accent text-primary-foreground shadow-glow hover:opacity-95">
                <a href={`mailto:${SUPPORT_EMAIL}`}>
                  <Mail className="mr-2 h-4 w-4" /> Contact Support
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-card/40 backdrop-blur hover:bg-card">
                <a href="#faq">Browse FAQ</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Need help or found a bug?
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            We're a small independent team and we read every message. Pick the
            best channel below — we usually reply within{" "}
            <span className="text-foreground">1–3 days</span>.
          </p>
        </div>

        {/* Contact cards */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <ContactCard
            icon={<Bug className="h-5 w-5" />}
            label="Bug Reports"
            title="Something not working?"
            description="Send us details about the issue, your iPhone model, and iOS version so we can reproduce and fix it fast."
            email={SUPPORT_EMAIL}
            subject="Radiogram — Bug Report"
          />
          <ContactCard
            icon={<Briefcase className="h-5 w-5" />}
            label="Business Inquiries"
            title="Partnerships & press"
            description="For collaborations, licensing, station partnerships, and media requests, get in touch via email."
            email={SUPPORT_EMAIL}
            subject="Radiogram — Business Inquiry"
          />
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          Average response time: 1–3 business days
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/60 bg-card/30">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">FAQ</p>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Frequently asked questions
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

      {/* Privacy Policy */}
      <section id="privacy" className="border-t border-border/60 scroll-mt-20">
        <div className="container mx-auto px-6 py-20 md:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Privacy Policy
              </p>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Your privacy matters
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">Last updated: May 26, 2026</p>
            </div>

            <div className="space-y-8 rounded-2xl border border-border bg-gradient-card p-7 shadow-card md:p-10">
              <PolicyBlock title="Overview">
                Radiogram is designed with privacy in mind. We do not require an account
                to listen, and we do not collect personal information beyond what is
                strictly necessary to operate the app.
              </PolicyBlock>
              <PolicyBlock title="Information we collect">
                Radiogram does not collect personal data such as your name, email, or
                contact information. The app may use anonymous, aggregated diagnostic
                data provided by Apple to help us improve stability and performance.
                Station playback happens directly between your device and the station's
                public stream.
              </PolicyBlock>
              <PolicyBlock title="Purchases">
                In-app purchases and subscriptions are processed by Apple. Radiogram does
                not see or store your payment details. Purchase status is verified
                through Apple's StoreKit and tied to your Apple ID.
              </PolicyBlock>
              <PolicyBlock title="Third-party streams">
                Stations available in Radiogram are operated by independent broadcasters.
                When you play a station, your device connects to that broadcaster's
                stream. Their own privacy practices apply to that connection.
              </PolicyBlock>
              <PolicyBlock title="Children">
                Radiogram is not directed to children under 13 and does not knowingly
                collect data from them.
              </PolicyBlock>
              <PolicyBlock title="Your rights">
                Because we do not collect personal data, there is generally nothing for
                us to access, modify, or delete on your behalf. If you have questions
                about your privacy, contact us any time.
              </PolicyBlock>
              <PolicyBlock title="Contact">
                For privacy questions, email{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                  {SUPPORT_EMAIL}
                </a>
                .
              </PolicyBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Use */}
      <section id="terms" className="border-t border-border/60 bg-card/30 scroll-mt-20">
        <div className="container mx-auto px-6 py-20 md:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                <FileText className="h-3.5 w-3.5" /> Terms of Use
              </p>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Terms of Use
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">Last updated: May 26, 2026</p>
            </div>

            <div className="space-y-8 rounded-2xl border border-border bg-gradient-card p-7 shadow-card md:p-10">
              <PolicyBlock title="Acceptance">
                By downloading or using Radiogram, you agree to these Terms of Use. If
                you do not agree, please do not use the app.
              </PolicyBlock>
              <PolicyBlock title="License">
                Radiogram grants you a personal, non-exclusive, non-transferable license
                to use the app on Apple devices you own or control, in accordance with
                the Apple Media Services Terms.
              </PolicyBlock>
              <PolicyBlock title="Acceptable use">
                You agree not to misuse the app, attempt to reverse engineer it, or use
                it to infringe third-party rights. Stations are provided as a directory
                of publicly available streams; you are responsible for complying with the
                rules of the broadcasters you listen to.
              </PolicyBlock>
              <PolicyBlock title="Subscriptions & purchases">
                Subscriptions auto-renew through your Apple ID unless cancelled at least
                24 hours before the end of the current period. Manage or cancel
                subscriptions in your Apple ID settings. Refunds are handled by Apple
                under their standard policy.
              </PolicyBlock>
              <PolicyBlock title="Content disclaimer">
                Radiogram aggregates third-party radio streams. We do not control,
                endorse, or take responsibility for the content broadcast by any station.
                Stations may go offline, change content, or become unavailable at any
                time.
              </PolicyBlock>
              <PolicyBlock title="Limitation of liability">
                Radiogram is provided "as is" without warranties of any kind. To the
                fullest extent permitted by law, we are not liable for any indirect,
                incidental, or consequential damages arising from your use of the app.
              </PolicyBlock>
              <PolicyBlock title="Changes">
                We may update these terms occasionally. Continued use of the app after an
                update constitutes acceptance of the revised terms.
              </PolicyBlock>
              <PolicyBlock title="Contact">
                Questions about these terms? Email{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                  {SUPPORT_EMAIL}
                </a>
                .
              </PolicyBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="container mx-auto flex flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Radiogram</span>
          </div>
          <p>Radiogram is an independent internet radio project.</p>
          <p className="text-xs">
            Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>
          </p>
          <div className="flex gap-4 text-xs">
            <a href="#privacy" className="hover:text-foreground">Privacy Policy</a>
            <a href="#terms" className="hover:text-foreground">Terms of Use</a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Radiogram. All rights reserved.</p>
        </div>
      </footer>
    </main>
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

const PolicyBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{children}</p>
  </div>
);

export default Index;
