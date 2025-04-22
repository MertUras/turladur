'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Link componentini kullanmak daha uygun olabilir
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

interface JobListingCardProps {
  job: JobPosition;
}

export default function JobListingCard({ job }: JobListingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyClick = () => {
    // TODO: Gerçek başvuru sayfasına yönlendirme mantığı
    console.log(`Apply button clicked for job: ${job.id}`);
    // window.location.href = `/apply/${job.id}`;
  };

  return (
    <div className={`bg-white border border-neutral-200/50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out`}>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div className="flex-grow mb-4 md:mb-0 md:mr-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight mb-2">
              {job.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium border border-neutral-200/80">
                <BriefcaseIcon className="w-3.5 h-3.5 mr-1 text-neutral-500" />
                {job.department}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium border border-neutral-200/80">
                <MapPinIcon className="w-3.5 h-3.5 mr-1 text-neutral-500" />
                {job.location}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium border border-neutral-200/80">
                <ClockIcon className="w-3.5 h-3.5 mr-1 text-neutral-500" />
                {job.type}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 md:ml-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="inline-flex items-center justify-center p-2 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
              aria-label={isExpanded ? "Detayları gizle" : "Detayları göster"}
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        <p className={`text-neutral-600 text-sm mb-5 leading-relaxed transition-all duration-300 ease-in-out ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}>
          {job.description}
        </p>
        
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 pt-5 border-t border-neutral-200' : 'max-h-0 opacity-0'}`}
          style={{ transitionProperty: 'max-height, opacity, padding-top' }}
        >
          <div>
            <h4 className="text-base font-semibold text-neutral-800 mb-3">Temel Nitelikler:</h4>
            <ul className="space-y-2 text-sm text-neutral-700 mb-6">
              {job.requirements.map((req, reqIndex) => (
                <li key={reqIndex} className="flex items-start">
                  <ChevronRightIcon className="flex-shrink-0 w-4 h-4 text-sky-500 mr-2 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={handleApplyClick}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 ease-in-out shadow-sm active:scale-[0.98] tracking-tight w-full sm:w-auto"
            >
              <span>Hemen Başvur</span>
              <ArrowRightIcon className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 