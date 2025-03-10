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
}

export function BookingSteps({ steps }: BookingStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="md:flex-1">
            <div className={cn(
              "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
              step.status === 'complete' ? 'border-blue-600' : 
              step.status === 'current' ? 'border-blue-600' : 
              'border-gray-200'
            )}>
              <span className={cn(
                "text-sm font-medium",
                step.status === 'complete' ? 'text-blue-600' : 
                step.status === 'current' ? 'text-blue-600' : 
                'text-gray-500'
              )}>
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