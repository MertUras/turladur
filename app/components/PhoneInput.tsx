'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  PHONE_COUNTRIES,
  clampLocalPhoneDigits,
  formatLocalPhoneDisplay,
  getPhoneCountry,
  type PhoneCountry,
} from '@/app/lib/phone-rules';

export type CountryOption = PhoneCountry;

export const COUNTRY_OPTIONS: CountryOption[] = PHONE_COUNTRIES;

interface PhoneInputProps {
  countryCode: string;
  onCountryCodeChange: (dial: string) => void;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function formatFullPhone(countryCode: string, localNumber: string): string {
  const digits = localNumber.replace(/\D/g, '');
  if (!digits) return '';
  return `${countryCode} ${formatLocalPhoneDisplay(countryCode, digits)}`;
}

export function parsePhoneValue(
  fullPhone: string,
  defaultDial = '+90'
): { countryCode: string; localNumber: string } {
  const trimmed = fullPhone.trim();
  if (!trimmed) {
    return { countryCode: defaultDial, localNumber: '' };
  }

  const matched = COUNTRY_OPTIONS.find((c) => trimmed.startsWith(c.dial));
  if (matched) {
    const local = clampLocalPhoneDigits(matched.dial, trimmed.slice(matched.dial.length));
    return { countryCode: matched.dial, localNumber: local };
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('90') && digits.length > 10) {
    return {
      countryCode: '+90',
      localNumber: clampLocalPhoneDigits('+90', digits.slice(2)),
    };
  }

  return {
    countryCode: defaultDial,
    localNumber: clampLocalPhoneDigits(defaultDial, digits),
  };
}

export default function PhoneInput({
  countryCode,
  onCountryCodeChange,
  value,
  onChange,
  error,
  required,
}: PhoneInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = getPhoneCountry(countryCode);
  const digits = value.replace(/\D/g, '');
  const displayValue = formatLocalPhoneDisplay(countryCode, digits);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocalChange = (raw: string) => {
    onChange(clampLocalPhoneDigits(countryCode, raw));
  };

  const handleCountrySelect = (dial: string) => {
    onCountryCodeChange(dial);
    const clamped = clampLocalPhoneDigits(dial, value);
    if (clamped !== digits) {
      onChange(clamped);
    }
    setDropdownOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Telefon
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div
        ref={containerRef}
        className={`flex rounded-lg border ${
          error ? 'border-red-300' : 'border-neutral-300'
        } focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500`}
      >
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-1.5 h-full px-3 py-2.5 rounded-l-lg bg-neutral-50 border-r border-neutral-300 hover:bg-neutral-100 transition-colors text-sm"
            aria-label="Ülke kodu seç"
            aria-expanded={dropdownOpen}
          >
            <span className="text-base leading-none" aria-hidden="true">
              {selectedCountry.flag}
            </span>
            <span className="text-neutral-700 font-medium">{selectedCountry.dial}</span>
            <ChevronDownIcon
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 max-h-60 overflow-y-auto bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
              {COUNTRY_OPTIONS.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country.dial)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-sky-50 transition-colors ${
                    country.dial === countryCode ? 'bg-sky-50/60 text-sky-800' : 'text-neutral-700'
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden="true">
                    {country.flag}
                  </span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-neutral-500 text-xs">{country.dial}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="tel"
          value={displayValue}
          onChange={(e) => handleLocalChange(e.target.value)}
          className="flex-1 py-2.5 px-4 rounded-r-lg border-0 focus:ring-0 text-neutral-900 placeholder-neutral-400"
          placeholder={selectedCountry.placeholder}
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={selectedCountry.maxDigits + selectedCountry.formatGroups.length - 1}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
