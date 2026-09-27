/**
 * Identity, links and top-level copy.
 * Everything a visitor reads in the hero, nav, footer and metadata starts here.
 */

export const site = {
  name: "Abhishek Kumar Jha",
  shortName: "Abhishek Jha",
  role: "Senior Software Engineer",
  focusAreas: ["Backend", "Distributed Systems", "AI Infrastructure", "Agentic Systems"],
  headline: "Building the infrastructure behind reliable AI.",
  lede: "I design and ship production AI systems — agent runtimes, developer APIs, orchestration, guardrails, observability and the cloud infrastructure underneath. 8+ years across backend and distributed systems, in Python, Java and TypeScript.",
  seoDescription:
    "Abhishek Kumar Jha is a senior software engineer with 8+ years in backend, distributed systems and AI infrastructure — building agent runtimes, orchestration, guardrails and developer platforms for production AI.",
  keywords: [
    "Senior Software Engineer",
    "Backend Engineer",
    "AI Infrastructure",
    "Distributed Systems",
    "Agentic Systems",
    "Production AI",
    "Python",
    "FastAPI",
    "Java",
    "Spring Boot",
    "TypeScript",
    "AWS",
  ],
  email: "abhishek.jha0410@gmail.com",
  github: { label: "GitHub", handle: "abhishek-jha-ai", href: "https://github.com/abhishek-jha-ai" },
  linkedin: {
    label: "LinkedIn",
    handle: "abhishek-jha-ai",
    href: "https://www.linkedin.com/in/abhishek-jha-ai",
  },
  /** Drop a PDF at public/resume.pdf and the Resume button appears automatically. */
  resume: { href: "/resume.pdf", file: "resume.pdf" },
} as const;

export type NavItem = { label: string; id: string };

/** Order matches the order of sections on the home page. */
export const navItems: NavItem[] = [
  { label: "Agentic SDLC", id: "agentic-sdlc" },
  { label: "Systems", id: "systems" },
  { label: "Approach", id: "approach" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

export type Signal = { value: string; label: string; source: string };

/** The 20-second scan. Facts only — each one traceable to a project or role. */
export const signals: Signal[] = [
  { value: "8+", label: "years engineering", source: "Since 2018" },
  { value: "~190", label: "REST endpoints", source: "Agentic SDLC" },
  { value: "700+", label: "automated tests", source: "Agentic SDLC" },
  { value: "20,000+", label: "users served", source: "Eruvaka" },
  { value: "1,000+", label: "users", source: "PlanCraft AI" },
  { value: "200+", label: "businesses", source: "SalonFlow" },
];

export const coreStack = [
  "Python",
  "Java",
  "TypeScript",
  "FastAPI",
  "Spring Boot",
  "Node.js",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "GitHub Actions",
];
