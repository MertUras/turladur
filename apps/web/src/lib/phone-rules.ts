export interface PhoneCountry {
  code: string;
  dial: string;
  flag: string;
  name: string;
  minDigits: number;
  maxDigits: number;
  pattern?: RegExp;
  placeholder: string;
  formatGroups: number[];
  validationMessage: string;
}

export function formatPhoneDigits(digits: string, groups: number[]): string {
  const parts: string[] = [];
  let index = 0;
  for (const size of groups) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  if (index < digits.length) {
    parts.push(digits.slice(index));
  }
  return parts.join(' ');
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    code: 'TR',
    dial: '+90',
    flag: '🇹🇷',
    name: 'Türkiye',
    minDigits: 10,
    maxDigits: 10,
    pattern: /^5\d{9}$/,
    placeholder: '5XX XXX XX XX',
    formatGroups: [3, 3, 2, 2],
    validationMessage:
      'Geçerli bir Türkiye cep telefonu girin (5XX XXX XX XX).',
  },
  {
    code: 'US',
    dial: '+1',
    flag: '🇺🇸',
    name: 'ABD',
    minDigits: 10,
    maxDigits: 10,
    pattern: /^[2-9]\d{9}$/,
    placeholder: '555 123 4567',
    formatGroups: [3, 3, 4],
    validationMessage: 'Geçerli bir ABD telefon numarası girin (10 hane).',
  },
  {
    code: 'GB',
    dial: '+44',
    flag: '🇬🇧',
    name: 'Birleşik Krallık',
    minDigits: 10,
    maxDigits: 10,
    pattern: /^7\d{9}$/,
    placeholder: '7XXX XXX XXX',
    formatGroups: [4, 3, 3],
    validationMessage:
      'Geçerli bir Birleşik Krallık telefon numarası girin (10 hane).',
  },
  {
    code: 'DE',
    dial: '+49',
    flag: '🇩🇪',
    name: 'Almanya',
    minDigits: 10,
    maxDigits: 11,
    pattern: /^[1-9]\d{9,10}$/,
    placeholder: '1XX XXXXXXXX',
    formatGroups: [3, 7, 1],
    validationMessage:
      'Geçerli bir Almanya telefon numarası girin (10-11 hane).',
  },
  {
    code: 'FR',
    dial: '+33',
    flag: '🇫🇷',
    name: 'Fransa',
    minDigits: 9,
    maxDigits: 9,
    pattern: /^[67]\d{8}$/,
    placeholder: '6 XX XX XX XX',
    formatGroups: [1, 2, 2, 2, 2],
    validationMessage: 'Geçerli bir Fransa telefon numarası girin (9 hane).',
  },
  {
    code: 'NL',
    dial: '+31',
    flag: '🇳🇱',
    name: 'Hollanda',
    minDigits: 9,
    maxDigits: 9,
    pattern: /^6\d{8}$/,
    placeholder: '6 XX XX XX XX',
    formatGroups: [1, 2, 2, 2, 2],
    validationMessage: 'Geçerli bir Hollanda telefon numarası girin (9 hane).',
  },
  {
    code: 'IT',
    dial: '+39',
    flag: '🇮🇹',
    name: 'İtalya',
    minDigits: 9,
    maxDigits: 10,
    pattern: /^3\d{8,9}$/,
    placeholder: '3XX XXX XXXX',
    formatGroups: [3, 3, 4],
    validationMessage: 'Geçerli bir İtalya telefon numarası girin (9-10 hane).',
  },
  {
    code: 'ES',
    dial: '+34',
    flag: '🇪🇸',
    name: 'İspanya',
    minDigits: 9,
    maxDigits: 9,
    pattern: /^[67]\d{8}$/,
    placeholder: '6XX XXX XXX',
    formatGroups: [3, 3, 3],
    validationMessage: 'Geçerli bir İspanya telefon numarası girin (9 hane).',
  },
  {
    code: 'RU',
    dial: '+7',
    flag: '🇷🇺',
    name: 'Rusya',
    minDigits: 10,
    maxDigits: 10,
    pattern: /^9\d{9}$/,
    placeholder: '9XX XXX XX XX',
    formatGroups: [3, 3, 2, 2],
    validationMessage: 'Geçerli bir Rusya telefon numarası girin (10 hane).',
  },
  {
    code: 'SA',
    dial: '+966',
    flag: '🇸🇦',
    name: 'Suudi Arabistan',
    minDigits: 9,
    maxDigits: 9,
    pattern: /^5\d{8}$/,
    placeholder: '5X XXX XXXX',
    formatGroups: [2, 3, 4],
    validationMessage:
      'Geçerli bir Suudi Arabistan telefon numarası girin (9 hane).',
  },
  {
    code: 'AE',
    dial: '+971',
    flag: '🇦🇪',
    name: 'BAE',
    minDigits: 9,
    maxDigits: 9,
    pattern: /^5\d{8}$/,
    placeholder: '5X XXX XXXX',
    formatGroups: [2, 3, 4],
    validationMessage: 'Geçerli bir BAE telefon numarası girin (9 hane).',
  },
  {
    code: 'AZ',
    dial: '+994',
    flag: '🇦🇿',
    name: 'Azerbaycan',
    minDigits: 9,
    maxDigits: 9,
    pattern: /^\d{9}$/,
    placeholder: 'XX XXX XX XX',
    formatGroups: [2, 3, 2, 2],
    validationMessage:
      'Geçerli bir Azerbaycan telefon numarası girin (9 hane).',
  },
  {
    code: 'GR',
    dial: '+30',
    flag: '🇬🇷',
    name: 'Yunanistan',
    minDigits: 10,
    maxDigits: 10,
    pattern: /^6\d{9}$/,
    placeholder: '6XX XXX XXXX',
    formatGroups: [3, 3, 4],
    validationMessage:
      'Geçerli bir Yunanistan telefon numarası girin (10 hane).',
  },
];

const PHONE_RULES_BY_DIAL = new Map(
  PHONE_COUNTRIES.map((country) => [country.dial, country]),
);

const DEFAULT_RULE = PHONE_COUNTRIES[0];

export function getPhoneCountry(dial: string): PhoneCountry {
  return PHONE_RULES_BY_DIAL.get(dial) ?? DEFAULT_RULE;
}

export function formatLocalPhoneDisplay(
  dial: string,
  localNumber: string,
): string {
  const digits = localNumber.replace(/\D/g, '');
  if (!digits) return '';
  const rule = getPhoneCountry(dial);
  return formatPhoneDigits(digits, rule.formatGroups);
}

export function clampLocalPhoneDigits(
  dial: string,
  localNumber: string,
): string {
  const rule = getPhoneCountry(dial);
  return localNumber.replace(/\D/g, '').slice(0, rule.maxDigits);
}

export function isValidLocalPhone(
  localNumber: string,
  countryDial = '+90',
): boolean {
  const digits = localNumber.replace(/\D/g, '');
  if (!digits) return false;

  const rule = getPhoneCountry(countryDial);
  if (digits.length < rule.minDigits || digits.length > rule.maxDigits)
    return false;
  if (rule.pattern && !rule.pattern.test(digits)) return false;
  return true;
}

export function isValidFullPhone(
  countryDial: string,
  localNumber: string,
): boolean {
  if (!isValidLocalPhone(localNumber, countryDial)) return false;
  const fullDigits = `${countryDial.replace(/\D/g, '')}${localNumber.replace(/\D/g, '')}`;
  return fullDigits.length >= 10 && fullDigits.length <= 15;
}

export function getPhoneValidationError(
  localNumber: string,
  countryDial: string,
): string | null {
  const digits = localNumber.replace(/\D/g, '');
  const rule = getPhoneCountry(countryDial);

  if (!digits) {
    return 'Telefon numarası gereklidir.';
  }

  if (digits.length < rule.minDigits || digits.length > rule.maxDigits) {
    return rule.validationMessage;
  }

  if (rule.pattern && !rule.pattern.test(digits)) {
    return rule.validationMessage;
  }

  return null;
}
