/**
 * Canonical origin for metadata, sitemap and Open Graph URLs.
 * Set NEXT_PUBLIC_SITE_URL once a custom domain exists; on Vercel the
 * production URL is picked up automatically until then.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}
