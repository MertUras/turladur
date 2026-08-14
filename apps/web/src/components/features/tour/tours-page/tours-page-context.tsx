'use client';

import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { LegacyTourCard as Tour } from '@/lib/tours/legacy-tour';
import type {
  DepartureCityOption,
  FilterOptions,
  RegionOption,
} from './tours-page.types';

export type ToursPageUiContextValue = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setIsFilterOpen: Dispatch<SetStateAction<boolean>>;
  activeFilterCount: number;
  filterOptions: FilterOptions;
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
  filteredDepartureCities: DepartureCityOption[];
  filteredRegions: RegionOption[];
  departureSearch: string;
  setDepartureSearch: Dispatch<SetStateAction<string>>;
  regionSearch: string;
  setRegionSearch: Dispatch<SetStateAction<string>>;
  resetFilters: () => void;
  view: 'grid' | 'list';
  setView: Dispatch<SetStateAction<'grid' | 'list'>>;
  sortBy: string;
  handleSortChange: (sort: string) => void;
  isLoading: boolean;
  loading: boolean;
  itemsPerPage: number;
  filteredTours: Tour[];
  currentTours: Tour[];
  totalItems: number;
  totalTours: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  handlePageChange: (page: number) => void;
  fetchError: string | null;
  loadingMore: boolean;
};

const ToursPageUiContext = createContext<ToursPageUiContextValue | null>(null);

export function ToursPageUiProvider({
  value,
  children,
}: {
  value: ToursPageUiContextValue;
  children: ReactNode;
}) {
  return (
    <ToursPageUiContext.Provider value={value}>
      {children}
    </ToursPageUiContext.Provider>
  );
}

export function useToursPageUi(): ToursPageUiContextValue {
  const ctx = useContext(ToursPageUiContext);
  if (!ctx) {
    throw new Error('useToursPageUi must be used within ToursPageUiProvider');
  }
  return ctx;
}
