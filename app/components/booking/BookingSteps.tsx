'use client';

import { CheckIcon } from '@heroicons/react/24/solid';
import { cn } from '../../lib/utils';

interface Step {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface BookingStepsProps {
  steps: Step[];
  theme?: 'blue' | 'sky';
}

export function BookingSteps({ steps, theme = 'blue' }: BookingStepsProps) {
  const activeBorder = theme === 'sky' ? 'border-sky-600' : 'border-blue-600';
  const activeText = theme === 'sky' ? 'text-sky-600' : 'text-blue-600';

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.id} className="md:flex-1">
            <div
              className={cn(
                'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
                step.status === 'complete' || step.status === 'current'
                  ? activeBorder
                  : 'border-gray-200'
              )}
            >
              <span
                className={cn(
                  'text-sm font-medium',
                  step.status === 'complete' || step.status === 'current'
                    ? activeText
                    : 'text-gray-500'
                )}
              >
                {step.id}
              </span>
              <span className="text-sm font-medium">{step.name}</span>
              {step.description && (
                <span className="text-sm text-gray-500">{step.description}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
