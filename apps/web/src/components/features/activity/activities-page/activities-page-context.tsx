'use client';

import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react';
import type { Experience } from './activities-page.types';

export type ActivitiesPageUiContextValue = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  selectedCategory: string | undefined;
  setSelectedCategory: Dispatch<SetStateAction<string | undefined>>;
  minPrice: number | string;
  setMinPrice: Dispatch<SetStateAction<number | string>>;
  maxPrice: number | string;
  setMaxPrice: Dispatch<SetStateAction<number | string>>;
  maxDuration: number | string;
  setMaxDuration: Dispatch<SetStateAction<number | string>>;
  selectedActivityType: string | undefined;
  setSelectedActivityType: Dispatch<SetStateAction<string | undefined>>;
  selectedCity: string | undefined;
  setSelectedCity: Dispatch<SetStateAction<string | undefined>>;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  isFilterMenuOpen: boolean;
  setIsFilterMenuOpen: Dispatch<SetStateAction<boolean>>;
  filterMenuRef: RefObject<HTMLDivElement | null>;
  resetFilters: () => void;
  categories: { id: string; name: string }[];
  showAllCategories: boolean;
  setShowAllCategories: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  displayedActivities: Experience[];
  allFilteredActivities: Experience[];
  cities: string[];
  activityTypes: { id: string; name: string }[];
  sortOptions: { id: string; name: string }[];
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  activeFilters: { key: string; value: string | number; label: string }[];
  removeFilter: (key: string) => void;
  loadMoreActivities: () => void;
};

const ActivitiesPageUiContext =
  createContext<ActivitiesPageUiContextValue | null>(null);

export function ActivitiesPageUiProvider({
  value,
  children,
}: {
  value: ActivitiesPageUiContextValue;
  children: ReactNode;
}) {
  return (
    <ActivitiesPageUiContext.Provider value={value}>
      {children}
    </ActivitiesPageUiContext.Provider>
  );
}

export function useActivitiesPageUi(): ActivitiesPageUiContextValue {
  const ctx = useContext(ActivitiesPageUiContext);
  if (!ctx) {
    throw new Error(
      'useActivitiesPageUi must be used within ActivitiesPageUiProvider',
    );
  }
  return ctx;
}
