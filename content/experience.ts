export type Role = {
  company: string;
  title: string;
  period: string;
  current?: boolean;
  summary?: string;
};

export const experience: Role[] = [
  {
    company: "Sudo Programmer Inc.",
    title: "Founder & Senior Software / AI Platform Engineer",
    period: "2025 — Present",
    current: true,
    summary: "Building the Agentic SDLC Platform — governed AI software delivery from requirement to pull request.",
  },
  {
    company: "CACI International",
    title: "Senior Java Full Stack Developer",
    period: "Jul 2025 — Present",
    current: true,
    summary: "Spring Boot microservices, OAuth 2.0 / JWT, Docker and Kubernetes; production troubleshooting and root-cause analysis with Splunk.",
  },
  {
    company: "Braintree Health",
    title: "Software Engineer Intern / Team Lead",
    period: "Nov 2024 — Jun 2025",
    summary: "Healthcare data on Java and Spring Boot across HL7, FHIR and DICOM. Took a data-processing workflow from 2–3 weeks to ~1.5 hours.",
  },
  {
    company: "Eruvaka Technology",
    title: "Java Full Stack Developer / Team Lead",
    period: "Nov 2021 — Aug 2024",
    summary: "Technical leadership on a production platform serving 20,000+ users — GraphQL and REST APIs, ML capability integrations.",
  },
  {
    company: "Chubb Insurance / Accenture",
    title: "Java Full Stack Developer / Software Engineer",
    period: "Jul 2019 — Nov 2021",
  },
  {
    company: "Xenovex Technologies",
    title: "Java Developer",
    period: "Jan 2018 — Jun 2019",
  },
];

export const education = [
  { degree: "M.S. Computer Science", school: "Texas A&M University–Corpus Christi" },
  { degree: "B.Tech Computer Software Engineering", school: "SRM Institute of Science and Technology" },
];

export const certifications = ["AWS Certified Cloud Practitioner", "Databricks Fundamentals"];
