# abhishek-portfolio-website

Personal site for Abhishek Kumar Jha — Senior Software Engineer, Backend & AI Infrastructure.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lucide. Every route is statically prerendered.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm start
```

Node 20.19+ or 22+ is recommended (a transitive ESLint dependency warns on older 20.x).

## Update content

All copy and facts live in `content/` — components only render them.

| File | What it holds |
| --- | --- |
| `content/site.ts` | Name, headline, links, email, nav, the "at a glance" numbers, core stack |
| `content/sdlc.ts` | Agentic SDLC case study: metrics, planes, modules, traceability, stack |
| `content/systems.ts` | Other systems (add `href` when a public link exists) |
| `content/experience.ts` | Roles, education, certifications |
| `content/principles.ts` | Engineering principles |

**Resume:** put a PDF at `public/resume.pdf`. The Resume button appears automatically on the next build.

The simulations (`components/viz/*-drill.tsx`, `pipeline-graph.tsx`) keep their scripted frames at the top of each file; file names, task names and percentages there are illustrative and labelled as such on the page.

## Structure

```
app/                     layout, home, /systems/agentic-sdlc, OG image, icon, sitemap, robots
content/                 all site data
components/ui/           primitives: Section, Panel, StatusDot, Tag, ButtonLink, CopyEmail, playback controls
components/viz/          hero pipeline + runtime / governance / AI Ops drills
components/sdlc/         case-study building blocks: planes, lifecycle, module tabs, architecture, cards
components/sections/     home-page sections
hooks/use-playback.ts    deterministic frame playback (in-view only, reduced-motion aware, hold gates)
```

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel — no configuration needed.
2. Optional: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://abhishekjha.dev`) once a custom domain is attached. Until then canonical URLs, sitemap and Open Graph use Vercel's production URL.
