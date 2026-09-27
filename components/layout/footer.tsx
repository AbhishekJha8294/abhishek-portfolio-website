import { site } from "@/content/site";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-4 py-10 font-mono text-[11.5px] text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-fg">
              Email
            </a>
          </li>
          <li>
            <a href={site.github.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
              GitHub
            </a>
          </li>
          <li>
            <a href={site.linkedin.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
              LinkedIn
            </a>
          </li>
        </ul>
        <p>Built with Next.js, TypeScript and Tailwind. Set in Geist.</p>
      </Container>
    </footer>
  );
}
