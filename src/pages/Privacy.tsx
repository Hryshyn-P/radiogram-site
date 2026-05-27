import { ShieldCheck } from "lucide-react";
import { SUPPORT_EMAIL } from "@/components/Layout";

const Privacy = () => {
  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Privacy Policy
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Your privacy matters
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: May 26, 2026</p>
        </div>

        <div className="space-y-8 rounded-2xl border border-border bg-gradient-card p-7 shadow-card md:p-10">
          <PolicyBlock title="Overview">
            Radiogram is designed with privacy in mind. We do not require an account to
            listen, and we do not collect personal information beyond what is strictly
            necessary to operate the app.
          </PolicyBlock>
          <PolicyBlock title="Information we collect">
            Radiogram does not collect personal data such as your name, email, or
            contact information. The app may use anonymous, aggregated diagnostic data
            provided by Apple to help us improve stability and performance. Station
            playback happens directly between your device and the station's public
            stream.
          </PolicyBlock>
          <PolicyBlock title="Purchases">
            In-app purchases and subscriptions are processed by Apple. Radiogram does
            not see or store your payment details. Purchase status is verified through
            Apple's StoreKit and tied to your Apple ID.
          </PolicyBlock>
          <PolicyBlock title="Third-party streams">
            Stations available in Radiogram are operated by independent broadcasters.
            When you play a station, your device connects to that broadcaster's stream.
            Their own privacy practices apply to that connection.
          </PolicyBlock>
          <PolicyBlock title="Children">
            Radiogram is not directed to children under 13 and does not knowingly
            collect data from them.
          </PolicyBlock>
          <PolicyBlock title="Your rights">
            Because we do not collect personal data, there is generally nothing for us
            to access, modify, or delete on your behalf. If you have questions about
            your privacy, contact us any time.
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
    </section>
  );
};

const PolicyBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{title}</h2>
    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{children}</p>
  </div>
);

export default Privacy;
