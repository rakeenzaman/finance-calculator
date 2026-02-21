import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Finance Calculator, including data handling and advertising disclosures.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="policy-page">
      <section className="policy-card">
        <h1>Privacy Policy</h1>
        <p>Finance Calculator does not require account creation and does not intentionally collect personal financial records.</p>
        <p>
          Basic analytics or advertising technologies may use cookies or similar technologies to improve site functionality
          and measure performance. If advertising is enabled, third-party vendors may use cookies to serve ads.
        </p>
        <p>You can manage cookies through your browser settings. By using this site, you agree to this policy.</p>
      </section>
    </main>
  );
}
