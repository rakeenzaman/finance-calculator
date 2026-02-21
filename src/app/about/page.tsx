import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Finance Calculator and how these calculator estimates are intended to be used.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="policy-page">
      <section className="policy-card">
        <h1>About Finance Calculator</h1>
        <p>
          Finance Calculator provides free tools to estimate retirement, savings, and loan scenarios. These tools are for
          educational planning and should be used alongside professional guidance where appropriate.
        </p>
      </section>
    </main>
  );
}
