import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Finance Calculator for feedback, issues, or calculator suggestions.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="policy-page">
      <section className="policy-card">
        <h1>Contact</h1>
        <p>For feedback or support, reach out via your preferred public channel for this project (such as your repository issue tracker).</p>
      </section>
    </main>
  );
}
