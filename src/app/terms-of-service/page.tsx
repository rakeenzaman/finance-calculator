import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for using Finance Calculator tools and content.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="policy-page">
      <section className="policy-card">
        <h1>Terms of Service</h1>
        <p>
          All calculator outputs are estimates and provided for informational use only. You are responsible for verifying
          assumptions and outcomes before making financial decisions.
        </p>
        <p>
          Finance Calculator is provided &quot;as is&quot; without warranties. We are not liable for losses resulting from reliance
          on estimated outputs.
        </p>
      </section>
    </main>
  );
}
