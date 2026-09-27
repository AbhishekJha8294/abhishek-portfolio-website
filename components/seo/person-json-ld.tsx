import { site } from "@/content/site";
import { education } from "@/content/experience";
import { siteUrl } from "@/lib/site-url";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.seoDescription,
    url: siteUrl().toString(),
    email: `mailto:${site.email}`,
    sameAs: [site.github.href, site.linkedin.href],
    knowsAbout: [...site.focusAreas, "Production AI", "Python", "Java", "TypeScript", "AWS", "Kubernetes"],
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
