import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://finance-calculator.dev";

  const routes = [
    "",
    "/roth-ira-calculator",
    "/ira-calculator",
    "/hysa-calculator",
    "/401k-calculator",
    "/mortgage-calculator",
    "/auto-loan-calculator",
    "/about",
    "/privacy-policy",
    "/terms-of-service",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
