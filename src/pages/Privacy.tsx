import { ShieldCheck } from "lucide-react";

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
            Radiogram is designed to minimize data collection. The app stores certain
            preferences locally on your device and only uses data needed to provide
            radio playback, discovery features, and nearby recommendations.
          </PolicyBlock>
          <PolicyBlock title="Data Stored on Device">
            The app stores settings and usage preferences locally on your device, such
            as selected theme, app language, favorites, recent listening data, filters,
            and player preferences. This information is used to improve your in-app
            experience and is not required to be shared externally for basic playback.
          </PolicyBlock>
          <PolicyBlock title="Location">
            If you grant location permission, the app uses your approximate location to
            determine nearby countries and improve station suggestions. Location access
            is optional and is not required to listen to radio streams.
          </PolicyBlock>
          <PolicyBlock title="Network Requests">
            When you use the app, it connects to radio directories, metadata sources,
            and stream URLs to load station information and play audio. Those
            third-party services may receive your IP address, device networking
            information, and standard request metadata as part of normal internet
            communication. Station streams may also include audio advertising or
            promotional content provided by the directory, stream provider, radio
            station, or station owner.
          </PolicyBlock>
          <PolicyBlock title="Third-Party Services">
            Because Radiogram relies on third-party radio directories, stream
            providers, optional external support platforms, and any sponsor
            destinations you choose to open, their own privacy practices may apply when
            you connect to their services. Radiogram does not control third-party
            privacy policies, content, or infrastructure.
          </PolicyBlock>
          <PolicyBlock title="Purchases and Support">
            Radiogram may offer optional App Store purchases that support ongoing
            development. Purchase processing is handled by Apple. External Ko-fi or
            Patreon links are optional donations or memberships opened in a browser and
            do not unlock app features.
          </PolicyBlock>
          <PolicyBlock title="Sponsor Messages">
            Radiogram may show optional first-party sponsor messages only after you
            enable them in settings. These messages are designed not to interrupt
            playback and do not use cross-app tracking in this app.
          </PolicyBlock>
          <PolicyBlock title="Data Sharing">
            Radiogram does not sell personal data. Any required privacy disclosures for
            App Store distribution should also be reflected in App Store Connect
            privacy answers.
          </PolicyBlock>
          <PolicyBlock title="Contact">
            Questions about privacy or support may be directed through the developer
            contact details and support resources listed on the App Store product page
            or the app's support website.
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
