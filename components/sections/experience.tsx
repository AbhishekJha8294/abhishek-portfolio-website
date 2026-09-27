import { certifications, education, experience } from "@/content/experience";
import { Section } from "@/components/ui/section";
import { StatusDot } from "@/components/ui/status-dot";

export function Experience() {
  return (
    <Section id="experience" index="04" label="Experience" title="8+ years of building software that runs in production.">
      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
        <ol className="border-t border-line">
          {experience.map((role) => (
            <li key={`${role.company}-${role.period}`} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[168px_1fr] sm:gap-8">
              <p className="flex items-center gap-2 self-start font-mono text-[12px] text-subtle sm:pt-[3px]">
                {role.current && <StatusDot state="running" />}
                <span>{role.period}</span>
              </p>
              <div>
                <h3 className="text-[16px] font-medium leading-snug tracking-[-0.01em] text-fg">
                  {role.title}
                  <span className="text-muted"> · {role.company}</span>
                </h3>
                {role.summary && <p className="mt-1.5 max-w-2xl text-pretty text-[14px] leading-relaxed text-subtle">{role.summary}</p>}
              </div>
            </li>
          ))}
        </ol>

        <aside className="space-y-10">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Education</h3>
            <ul className="mt-4 space-y-4">
              {education.map((e) => (
                <li key={e.degree}>
                  <p className="text-[15px] text-fg">{e.degree}</p>
                  <p className="mt-0.5 text-[13.5px] text-muted">{e.school}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Certifications</h3>
            <ul className="mt-4 space-y-2">
              {certifications.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-[14px] text-fg">
                  <StatusDot state="passed" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
