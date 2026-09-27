/**
 * Other systems. Only facts supplied by Abhishek — add a field here
 * (e.g. `href`) when a public link exists and the card will render it.
 */

export type System = {
  id: string;
  code: string;
  name: string;
  org?: string;
  role?: string;
  domain: string;
  summary: string;
  metric?: { value: string; label: string };
  /** Before/after comparison, rendered as proportional bars. */
  improvement?: { label: string; before: string; after: string; beforeHours: number; afterHours: number };
  groups: { label: string; items: string[] }[];
  href?: string;
  wide?: boolean;
};

export const systems: System[] = [
  {
    id: "plancraft",
    code: "SYS-02",
    name: "PlanCraft AI",
    domain: "Production AI",
    summary:
      "A production AI productivity platform — voice journaling, smart reminders and AI insights, built on retrieval, tool calling and agentic workflows.",
    metric: { value: "1,000+", label: "users" },
    groups: [
      { label: "Product", items: ["Voice journaling", "Smart reminders", "AI insights", "AI-assisted workflows"] },
      { label: "AI", items: ["LLMs", "RAG", "Tool calling", "Agentic workflows"] },
      { label: "Stack", items: ["Python", "FastAPI", "PostgreSQL", "AWS"] },
    ],
  },
  {
    id: "salonflow",
    code: "SYS-03",
    name: "SalonFlow",
    domain: "Multi-tenant SaaS",
    summary:
      "A multi-tenant platform for business operations — scheduling, CRM and workflow automation.",
    metric: { value: "200+", label: "businesses" },
    groups: [
      { label: "Product", items: ["Scheduling", "CRM", "Business operations", "Workflow automation"] },
      { label: "Stack", items: ["TypeScript", "Backend APIs", "PostgreSQL", "Cloud infrastructure"] },
    ],
  },
  {
    id: "braintree",
    code: "SYS-04",
    name: "Healthcare data systems",
    org: "Braintree Health",
    role: "Software Engineer Intern / Team Lead",
    domain: "Healthcare interoperability",
    summary:
      "Backend services for healthcare data on Java and Spring Boot, working across HL7, FHIR and DICOM — including a data-processing workflow that went from weeks to hours.",
    improvement: {
      label: "Healthcare data-processing workflow",
      before: "2–3 weeks",
      after: "~1.5 hours",
      beforeHours: 420,
      afterHours: 1.5,
    },
    groups: [{ label: "Stack", items: ["Java", "Spring Boot", "REST APIs", "HL7", "FHIR", "DICOM"] }],
  },
  {
    id: "eruvaka",
    code: "SYS-05",
    name: "Eruvaka platform",
    org: "Eruvaka Technology",
    role: "Java Full Stack Developer / Team Lead",
    domain: "Production platform",
    summary:
      "Technical leadership on a production platform — GraphQL and REST APIs on Node.js and TypeScript, with ML capabilities integrated into the product.",
    metric: { value: "20,000+", label: "users" },
    groups: [
      { label: "Scope", items: ["Technical leadership", "ML capability integrations"] },
      { label: "Stack", items: ["TypeScript", "Node.js", "GraphQL", "REST"] },
    ],
  },
  {
    id: "caci",
    code: "SYS-06",
    name: "Enterprise microservices",
    org: "CACI International",
    role: "Senior Java Full Stack Developer",
    domain: "Enterprise platform",
    summary:
      "Java and Spring Boot microservices secured with OAuth 2.0 and JWT, shipped through CI/CD onto Docker and Kubernetes — and kept healthy in production through Splunk-driven troubleshooting and root-cause analysis.",
    groups: [
      { label: "Services", items: ["Java", "Spring Boot", "REST APIs", "Microservices", "OAuth 2.0", "JWT"] },
      { label: "Platform", items: ["Docker", "Kubernetes", "CI/CD"] },
      { label: "Operations", items: ["Splunk", "Production troubleshooting", "Root-cause analysis"] },
    ],
    wide: true,
  },
];
