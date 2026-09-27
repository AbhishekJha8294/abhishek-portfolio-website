import type { MetadataRoute } from "next";
import { sdlc } from "@/content/sdlc";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: new URL("/", base).toString(), changeFrequency: "monthly", priority: 1 },
    { url: new URL(`/systems/${sdlc.slug}`, base).toString(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
