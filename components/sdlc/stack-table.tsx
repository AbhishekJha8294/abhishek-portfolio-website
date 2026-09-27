import { sdlc } from "@/content/sdlc";
import { TagList } from "@/components/ui/tag";

export function StackTable() {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {sdlc.stack.map((row) => (
        <div key={row.layer} className="grid gap-2 py-3.5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-6">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{row.layer}</dt>
          <dd>
            <TagList items={row.items} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
