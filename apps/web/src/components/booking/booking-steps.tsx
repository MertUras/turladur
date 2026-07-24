'use client';

type BookingStep = {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'current' | 'upcoming';
};

export function BookingSteps({ steps }: { steps: BookingStep[] }) {
  return (
    <nav aria-label="Rezervasyon adımları">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-2">
        {steps.map((step, index) => {
          const isComplete = step.status === 'complete';
          const isCurrent = step.status === 'current';
          return (
            <li
              key={step.id}
              className={`flex flex-1 items-start gap-3 rounded-xl border px-3 py-3 ${
                isCurrent
                  ? 'border-neutral-950 bg-neutral-50'
                  : isComplete
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-neutral-200 bg-white'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isCurrent
                    ? 'bg-neutral-950 text-white'
                    : isComplete
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {isComplete ? '✓' : String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">
                  {step.name}
                </p>
                <p className="text-xs text-neutral-500">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
