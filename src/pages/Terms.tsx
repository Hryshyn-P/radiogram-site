import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            <FileText className="h-3.5 w-3.5" /> Terms of Use
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Terms of Use
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: May 26, 2026</p>
        </div>

        <div className="space-y-8 rounded-2xl border border-border bg-gradient-card p-7 shadow-card md:p-10">
          <PolicyBlock title="Operator and Scope">
            Radiogram is a radio streaming application provided by its developer for
            personal, non-commercial listening. By using the app, you agree to these
            Terms of Use as they apply to the features and content available in the app.
          </PolicyBlock>
          <PolicyBlock title="Service Description">
            Radiogram helps users discover online radio stations, browse station
            metadata, and listen to third-party audio streams. Stream availability,
            bitrate, artwork, station names, and other metadata may change, degrade, or
            disappear at any time without notice.
          </PolicyBlock>
          <PolicyBlock title="Acceptable Use">
            You agree to use the app lawfully and only for its intended purpose. You
            may not interfere with the app, attempt unauthorized access, reverse
            engineer restricted parts of the service, or use the app in a way that
            disrupts third-party stream providers or other users.
          </PolicyBlock>
          <PolicyBlock title="Third-Party Content and Rights">
            Radio streams, station logos, trademarks, names, and metadata are provided
            by third parties and remain the property of their respective owners.
            Radiogram does not claim ownership of third-party station content and does
            not guarantee that such content is accurate, authorized, or continuously
            available.
          </PolicyBlock>
          <PolicyBlock title="Station Audio Advertising">
            Some radio directories, stream providers, radio stations, or station owners
            may include audio advertising, sponsorship messages, announcements, or
            other promotional content inside their own streams. This content is part of
            the third-party stream and is not inserted, selected, controlled, or
            removable by Radiogram. A Radiogram subscription or other support purchase
            does not remove advertising or promotional audio that is embedded in a
            station's own stream.
          </PolicyBlock>
          <PolicyBlock title="Availability and Changes">
            The app and its features may be updated, limited, suspended, or removed at
            any time. Some functionality depends on internet connectivity, device
            compatibility, and optional permissions such as location access used for
            nearby station suggestions.
          </PolicyBlock>
          <PolicyBlock title="Disclaimer of Warranties">
            Radiogram is provided on an as-is and as-available basis, without
            warranties of any kind to the fullest extent permitted by applicable law. We
            do not guarantee uninterrupted playback, error-free operation, continued
            compatibility, or the ongoing availability of any station or stream.
          </PolicyBlock>
          <PolicyBlock title="Limitation of Liability">
            To the maximum extent permitted by law, the developer of Radiogram will not
            be liable for indirect, incidental, special, consequential, or data-related
            losses arising from the use of the app, the unavailability of radio
            streams, or reliance on third-party content or metadata.
          </PolicyBlock>
          <PolicyBlock title="Governing Terms">
            These terms apply together with any mandatory consumer rights and, where
            applicable, the standard Apple terms that govern licensed App Store
            applications.
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

export default Terms;
