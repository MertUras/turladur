'use client';

interface SpecialRequirementsSectionProps {
  summary: string[];
  title?: string;
}

export default function SpecialRequirementsSection({
  summary,
  title = 'Özel Gereksinimler',
}: SpecialRequirementsSectionProps) {
  if (!summary.length) return null;

  return (
    <div className="pt-4">
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
        {title}
      </p>
      <ul className="space-y-2">
        {summary.map((line, index) => (
          <li
            key={`${index}-${line.slice(0, 24)}`}
            className="p-3 bg-amber-50/60 rounded-md border border-amber-200/70 text-sm text-neutral-700 leading-relaxed"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
