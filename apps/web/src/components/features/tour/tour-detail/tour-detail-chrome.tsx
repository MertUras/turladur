'use client';

import { ChevronDown as ChevronDownIcon } from 'lucide-react';
import BottomBookingBar from '@/components/booking/bottom-booking-bar';
import { useTourDetailUi } from './tour-detail-context';

/** Split from tour-detail-client.tsx (Faz 7) — scroll/video/bottom bar; UI unchanged. */
export function TourDetailChrome() {
  const {
    tour,
    availableTourDates,
    selectedTourDate,
    showScrollIndicator,
    expanded,
    setExpanded,
    handleDateSelect,
    handleParticipantsChange,
  } = useTourDetailUi();

  return (
    <>
      {/* Animasyonlu Scroll İndikatörü - Simplified */}
      {showScrollIndicator && (
        <div className="fixed bottom-28 right-6 hidden md:flex flex-col items-center animate-bounce-subtle z-30 pointer-events-none">
          {/* Removed text */}
          <div className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md border border-neutral-200/80">
            <ChevronDownIcon className="w-5 h-5 text-neutral-500" />
          </div>
        </div>
      )}

      {/* Video Tour Düğmesi - Simplified */}
      <div className="fixed top-1/2 right-6 transform -translate-y-1/2 hidden lg:block z-30">
        <button className="group relative w-12 h-12 bg-white rounded-full shadow-md border border-neutral-200/80 flex items-center justify-center hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950">
          {/* Removed ping animation */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-neutral-950"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
            />
          </svg>
          {/* Simplified Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-800 text-white text-xs font-medium px-2.5 py-1 rounded shadow-sm pointer-events-none">
            Video Turu
          </span>
        </button>
      </div>

      {/* BottomBookingBar Component */}
      <BottomBookingBar
        tour={tour ? { ...tour, tourDates: availableTourDates } : undefined}
        onDateSelect={handleDateSelect}
        onParticipantsChange={handleParticipantsChange}
        isExpanded={expanded}
        onExpandedChange={setExpanded}
        selectedDate={selectedTourDate}
      />
    </>
  );
}
