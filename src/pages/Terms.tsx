import { FileText } from "lucide-react";
import { SUPPORT_EMAIL } from "@/components/Layout";

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
          <PolicyBlock title="Acceptance">
            By downloading or using Radiogram, you agree to these Terms of Use. If you
            do not agree, please do not use the app.
          </PolicyBlock>
          <PolicyBlock title="License">
            Radiogram grants you a personal, non-exclusive, non-transferable license to
            use the app on Apple devices you own or control, in accordance with the
            Apple Media Services Terms.
          </PolicyBlock>
          <PolicyBlock title="Acceptable use">
            You agree not to misuse the app, attempt to reverse engineer it, or use it
            to infringe third-party rights. Stations are provided as a directory of
            publicly available streams; you are responsible for complying with the
            rules of the broadcasters you listen to.
          </PolicyBlock>
          <PolicyBlock title="Subscriptions & purchases">
            Subscriptions auto-renew through your Apple ID unless cancelled at least 24
            hours before the end of the current period. Manage or cancel subscriptions
            in your Apple ID settings. Refunds are handled by Apple under their
            standard policy.
          </PolicyBlock>
          <PolicyBlock title="Content disclaimer">
            Radiogram aggregates third-party radio streams. We do not control, endorse,
            or take responsibility for the content broadcast by any station. Stations
            may go offline, change content, or become unavailable at any time.
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
