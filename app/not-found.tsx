import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { StatusDot } from "@/components/ui/status-dot";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70dvh] flex-col justify-center pt-24">
      <p className="flex items-center gap-2.5 font-mono text-[12px] text-danger">
        <StatusDot state="blocked" />
        404 · route not found
      </p>
      <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em]">Nothing is scheduled here.</h1>
      <p className="mt-4 max-w-md text-muted">The page you asked for doesn&apos;t exist. The rest of the system is healthy.</p>
      <ButtonLink href="/" variant="secondary" className="mt-8 self-start">
        Back to overview
      </ButtonLink>
    </Container>
  );
}
