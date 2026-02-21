import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Finance Calculators",
  description:
    "Use free finance calculators for Roth IRA, Traditional IRA, HYSA, 401(k), mortgage, and auto loans.",
  alternates: {
    canonical: "/",
  },
};

const calculators = [
  {
    href: "/roth-ira-calculator",
    title: "Roth IRA Calculator",
    description: "Project long-term Roth IRA growth with yearly contributions and expected returns.",
  },
  {
    href: "/ira-calculator",
    title: "Traditional IRA Calculator",
    description: "Estimate pre-tax growth and after-tax value using your expected marginal tax rate.",
  },
  {
    href: "/hysa-calculator",
    title: "HYSA Calculator",
    description: "Estimate high-yield savings account growth with APY and recurring monthly deposits.",
  },
  {
    href: "/401k-calculator",
    title: "401(k) Calculator",
    description: "Forecast retirement savings using contribution rates, employer match, and salary growth.",
  },
  {
    href: "/mortgage-calculator",
    title: "Mortgage Calculator",
    description: "Calculate monthly payment, total interest, and total paid across your mortgage term.",
  },
  {
    href: "/auto-loan-calculator",
    title: "Auto Loan Calculator",
    description: "Calculate monthly car payment, total interest, and total amount paid over time.",
  },
];

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Finance Calculator Suite",
    url: siteUrl,
    description: "Free calculators for retirement, savings, and loan planning.",
  };

  return (
    <main className="home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="home-shell">
        <h1 className="home-title">Finance Calculator Suite</h1>
        <h2 className="home-subtitle">
          Compare savings, retirement, and loan scenarios with free, easy-to-use financial planning calculators.
        </h2>

        <div className="home-grid">
          {calculators.map((calculator) => (
            <Link key={calculator.href} href={calculator.href} className="home-card">
              <h3 className="home-card-title">{calculator.title}</h3>
              <p className="home-card-description">{calculator.description}</p>
              <span className="home-card-cta">Open calculator →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
