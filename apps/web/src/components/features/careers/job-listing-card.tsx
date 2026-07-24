'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  MapPin,
} from 'lucide-react';

export type JobPosition = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};

type JobListingCardProps = {
  job: JobPosition;
};

export function JobListingCard({ job }: JobListingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200/50 bg-white shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
      <div className="p-6 md:p-8">
        <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 grow md:mr-4 md:mb-0">
            <h3 className="mb-2 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
              {job.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center rounded-md border border-neutral-200/80 bg-neutral-100 px-2.5 py-0.5 font-medium text-neutral-700">
                <Briefcase className="mr-1 h-3.5 w-3.5 text-neutral-500" />
                {job.department}
              </span>
              <span className="inline-flex items-center rounded-md border border-neutral-200/80 bg-neutral-100 px-2.5 py-0.5 font-medium text-neutral-700">
                <MapPin className="mr-1 h-3.5 w-3.5 text-neutral-500" />
                {job.location}
              </span>
              <span className="inline-flex items-center rounded-md border border-neutral-200/80 bg-neutral-100 px-2.5 py-0.5 font-medium text-neutral-700">
                <Clock className="mr-1 h-3.5 w-3.5 text-neutral-500" />
                {job.type}
              </span>
            </div>
          </div>
          <div className="shrink-0 md:ml-6">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="inline-flex items-center justify-center rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              aria-label={isExpanded ? 'Detayları gizle' : 'Detayları göster'}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <p
          className={`mb-5 text-sm leading-relaxed text-neutral-600 transition-all duration-300 ease-in-out ${
            isExpanded ? 'line-clamp-none' : 'line-clamp-2'
          }`}
        >
          {job.description}
        </p>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded
              ? 'max-h-[1000px] border-t border-neutral-200 pt-5 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
          style={{ transitionProperty: 'max-height, opacity, padding-top' }}
        >
          <div>
            <h4 className="mb-3 text-base font-semibold text-neutral-800">
              Temel Nitelikler:
            </h4>
            <ul className="mb-6 space-y-2 text-sm text-neutral-700">
              {job.requirements.map((req) => (
                <li key={req} className="flex items-start">
                  <ChevronRight className="mt-0.5 mr-2 h-4 w-4 shrink-0 text-sky-500" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium tracking-tight text-white shadow-sm transition-colors duration-200 ease-in-out hover:bg-sky-700 active:scale-[0.98] sm:w-auto"
            >
              <span>Hemen Başvur</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
