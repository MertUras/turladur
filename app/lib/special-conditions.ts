import { PHONE_COUNTRIES, isValidFullPhone } from '@/app/lib/phone-rules';

export type SpecialConditionKey =
  | 'nutrition'
  | 'allergy'
  | 'health'
  | 'accessibility'
  | 'child_baby'
  | 'pregnancy'
  | 'transfer'
  | 'language'
  | 'celebration'
  | 'equipment'
  | 'other'
  | 'none';

export interface MultiSelectDetails {
  options: string[];
  other?: string;
}

export interface SpecialConditionsDetails {
  nutrition?: MultiSelectDetails;
  allergy?: string;
  health?: string;
  accessibility?: MultiSelectDetails;
  child_baby?: MultiSelectDetails;
  pregnancy?: { week?: string };
  transfer?: MultiSelectDetails & { location?: string };
  language?: MultiSelectDetails;
  celebration?: MultiSelectDetails;
  equipment?: {
    height?: string;
    weight?: string;
    shoeSize?: string;
    clothingSize?: string;
  };
  other?: string;
}

export interface SpecialConditionsData {
  selected: SpecialConditionKey[];
  details: SpecialConditionsDetails;
}

export const EMPTY_SPECIAL_CONDITIONS: SpecialConditionsData = {
  selected: [],
  details: {},
};

export const SPECIAL_CONDITION_OPTIONS: {
  id: SpecialConditionKey;
  label: string;
  requiresEquipment?: boolean;
}[] = [
  { id: 'nutrition', label: 'Beslenme tercihi veya gıda hassasiyeti' },
  { id: 'allergy', label: 'Alerji' },
  { id: 'health', label: 'Sağlık durumu' },
  { id: 'accessibility', label: 'Erişilebilirlik ihtiyacı' },
  { id: 'child_baby', label: 'Çocuk veya bebek ile katılım' },
  { id: 'pregnancy', label: 'Hamilelik durumu' },
  { id: 'transfer', label: 'Transfer veya buluşma noktası talebi' },
  { id: 'language', label: 'Dil tercihi' },
  { id: 'celebration', label: 'Özel gün veya kutlama' },
  { id: 'equipment', label: 'Ekipman veya beden ölçüsü bilgisi', requiresEquipment: true },
  { id: 'other', label: 'Diğer' },
  { id: 'none', label: 'Özel bir durumum yok' },
];

export const NUTRITION_OPTIONS = ['Vejetaryen', 'Vegan', 'Glütensiz', 'Laktozsuz', 'Helal', 'Diğer'];
export const ACCESSIBILITY_OPTIONS = [
  'Tekerlekli sandalye',
  'Yürüme desteği',
  'İşitme desteği',
  'Görme desteği',
  'Refakatçi ihtiyacı',
  'Diğer',
];
export const CHILD_BABY_OPTIONS = ['Bebek arabası', 'Çocuk koltuğu', 'Emzirme molası', 'Diğer'];
export const TRANSFER_OPTIONS = [
  'Otelden alım talebi',
  'Farklı buluşma noktası',
  'Dönüş transfer bilgisi',
  'Diğer',
];
export const LANGUAGE_OPTIONS = ['Türkçe', 'İngilizce', 'Almanca', 'İtalyanca', 'Rusça', 'Diğer'];
export const CELEBRATION_OPTIONS = ['Doğum günü', 'Yıldönümü', 'Balayı', 'Evlilik teklifi', 'Diğer'];

const EQUIPMENT_KEYWORDS = [
  'ekipman',
  'equipment',
  'kayak',
  'dalış',
  'bisiklet',
  'atv',
  'snowboard',
  'tırmanış',
  'dağcılık',
  'rafting',
  'yamaç paraşütü',
];

const MAX_TEXT_LENGTH = 500;

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function tourRequiresEquipment(tour: {
  inclusions?: unknown;
  features?: unknown;
  tags?: unknown;
  tourType?: string | null;
  difficultyLevel?: string | null;
}): boolean {
  const textSources = [
    ...parseJsonArray(tour.inclusions),
    ...parseJsonArray(tour.features),
    ...parseJsonArray(tour.tags),
    tour.tourType || '',
    tour.difficultyLevel || '',
  ]
    .join(' ')
    .toLowerCase();

  return EQUIPMENT_KEYWORDS.some((keyword) => textSources.includes(keyword));
}


export {
  PHONE_COUNTRIES as COUNTRY_CODES,
  getPhoneValidationError,
  isValidFullPhone,
  isValidLocalPhone,
} from '@/app/lib/phone-rules';

export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;

  const matched = PHONE_COUNTRIES.find((country) => trimmed.startsWith(country.dial));
  if (matched) {
    const local = trimmed.slice(matched.dial.length).replace(/\D/g, '');
    return isValidFullPhone(matched.dial, local);
  }

  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function validateMultiSelect(
  details: MultiSelectDetails | undefined,
  fieldLabel: string,
  errors: Record<string, string>
) {
  if (!details?.options?.length) {
    errors[fieldLabel] = 'En az bir seçenek belirtmelisiniz.';
    return;
  }
  if (details.options.includes('Diğer') && !details.other?.trim()) {
    errors[fieldLabel] = '"Diğer" seçeneği için açıklama gereklidir.';
  }
  if (details.other && details.other.length > MAX_TEXT_LENGTH) {
    errors[fieldLabel] = `Açıklama en fazla ${MAX_TEXT_LENGTH} karakter olabilir.`;
  }
}

export function validateSpecialConditions(
  data: SpecialConditionsData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.selected.length || data.selected.includes('none')) {
    return errors;
  }

  if (data.selected.includes('nutrition')) {
    validateMultiSelect(data.details.nutrition, 'nutrition', errors);
  }

  if (data.selected.includes('allergy')) {
    const text = data.details.allergy?.trim();
    if (!text) {
      errors.allergy = 'Alerjinizi ve gerekli önlemleri belirtmelisiniz.';
    } else if (text.length > MAX_TEXT_LENGTH) {
      errors.allergy = `Açıklama en fazla ${MAX_TEXT_LENGTH} karakter olabilir.`;
    }
  }

  if (data.selected.includes('health') && data.details.health) {
    if (data.details.health.length > MAX_TEXT_LENGTH) {
      errors.health = `Açıklama en fazla ${MAX_TEXT_LENGTH} karakter olabilir.`;
    }
  }

  if (data.selected.includes('accessibility')) {
    validateMultiSelect(data.details.accessibility, 'accessibility', errors);
  }

  if (data.selected.includes('child_baby')) {
    validateMultiSelect(data.details.child_baby, 'child_baby', errors);
  }

  if (data.selected.includes('pregnancy') && data.details.pregnancy?.week) {
    const week = Number(data.details.pregnancy.week);
    if (Number.isNaN(week) || week < 1 || week > 42) {
      errors.pregnancy = 'Geçerli bir hafta bilgisi girin (1-42).';
    }
  }

  if (data.selected.includes('transfer')) {
    validateMultiSelect(data.details.transfer, 'transfer', errors);
    const needsLocation =
      data.details.transfer?.options?.includes('Otelden alım talebi') ||
      data.details.transfer?.options?.includes('Farklı buluşma noktası');
    if (needsLocation && !data.details.transfer?.location?.trim()) {
      errors.transferLocation = 'Konum veya otel bilgisi gereklidir.';
    }
  }

  if (data.selected.includes('language')) {
    validateMultiSelect(data.details.language, 'language', errors);
  }

  if (data.selected.includes('celebration')) {
    validateMultiSelect(data.details.celebration, 'celebration', errors);
  }

  if (data.selected.includes('other')) {
    const text = data.details.other?.trim();
    if (!text) {
      errors.other = 'Lütfen durumunuzu açıklayın.';
    } else if (text.length > MAX_TEXT_LENGTH) {
      errors.other = `Açıklama en fazla ${MAX_TEXT_LENGTH} karakter olabilir.`;
    }
  }

  return errors;
}

function formatMultiSelect(label: string, details?: MultiSelectDetails, extra?: string): string | null {
  if (!details?.options?.length) return null;
  const parts = [...details.options];
  if (details.other?.trim()) {
    parts.push(`Diğer: ${details.other.trim()}`);
  }
  let line = `${label}: ${parts.join(', ')}`;
  if (extra?.trim()) {
    line += ` (${extra.trim()})`;
  }
  return line;
}

export function formatSpecialConditionsSummary(data: SpecialConditionsData): string[] {
  if (!data.selected.length || data.selected.includes('none')) {
    return ['Özel bir durum belirtilmedi.'];
  }

  const lines: string[] = [];

  const optionLabel = (id: SpecialConditionKey) =>
    SPECIAL_CONDITION_OPTIONS.find((o) => o.id === id)?.label || id;

  for (const key of data.selected) {
    switch (key) {
      case 'nutrition': {
        const line = formatMultiSelect(optionLabel(key), data.details.nutrition);
        if (line) lines.push(line);
        break;
      }
      case 'allergy':
        if (data.details.allergy?.trim()) {
          lines.push(`${optionLabel(key)}: ${data.details.allergy.trim()}`);
        }
        break;
      case 'health':
        if (data.details.health?.trim()) {
          lines.push(`${optionLabel(key)}: ${data.details.health.trim()}`);
        } else {
          lines.push(optionLabel(key));
        }
        break;
      case 'accessibility': {
        const line = formatMultiSelect(optionLabel(key), data.details.accessibility);
        if (line) lines.push(line);
        break;
      }
      case 'child_baby': {
        const line = formatMultiSelect(optionLabel(key), data.details.child_baby);
        if (line) lines.push(line);
        break;
      }
      case 'pregnancy':
        if (data.details.pregnancy?.week) {
          lines.push(`${optionLabel(key)}: ${data.details.pregnancy.week}. hafta`);
        } else {
          lines.push(optionLabel(key));
        }
        break;
      case 'transfer': {
        const line = formatMultiSelect(
          optionLabel(key),
          data.details.transfer,
          data.details.transfer?.location
        );
        if (line) lines.push(line);
        break;
      }
      case 'language': {
        const line = formatMultiSelect(optionLabel(key), data.details.language);
        if (line) lines.push(line);
        break;
      }
      case 'celebration': {
        const line = formatMultiSelect(optionLabel(key), data.details.celebration);
        if (line) lines.push(line);
        break;
      }
      case 'equipment': {
        const eq = data.details.equipment;
        if (eq) {
          const parts = [
            eq.height && `Boy: ${eq.height}`,
            eq.weight && `Kilo: ${eq.weight}`,
            eq.shoeSize && `Ayakkabı: ${eq.shoeSize}`,
            eq.clothingSize && `Beden: ${eq.clothingSize}`,
          ].filter(Boolean);
          if (parts.length) {
            lines.push(`${optionLabel(key)}: ${parts.join(', ')}`);
          }
        }
        break;
      }
      case 'other':
        if (data.details.other?.trim()) {
          lines.push(`${optionLabel(key)}: ${data.details.other.trim()}`);
        }
        break;
    }
  }

  return lines.length ? lines : ['Özel bir durum belirtilmedi.'];
}

export function formatSpecialConditionsTable(
  data: SpecialConditionsData
): { category: string; detail: string }[] {
  if (!data.selected.length || data.selected.includes('none')) {
    return [];
  }

  const rows: { category: string; detail: string }[] = [];
  const optionLabel = (id: SpecialConditionKey) =>
    SPECIAL_CONDITION_OPTIONS.find((o) => o.id === id)?.label || id;

  for (const key of data.selected) {
    switch (key) {
      case 'nutrition': {
        const line = formatMultiSelect('', data.details.nutrition);
        if (line) rows.push({ category: optionLabel(key), detail: line.replace(/^: /, '') });
        break;
      }
      case 'allergy':
        if (data.details.allergy?.trim()) {
          rows.push({ category: optionLabel(key), detail: data.details.allergy.trim() });
        }
        break;
      case 'health':
        rows.push({
          category: optionLabel(key),
          detail: data.details.health?.trim() || 'Belirtildi',
        });
        break;
      case 'accessibility': {
        const line = formatMultiSelect('', data.details.accessibility);
        if (line) rows.push({ category: optionLabel(key), detail: line.replace(/^: /, '') });
        break;
      }
      case 'child_baby': {
        const line = formatMultiSelect('', data.details.child_baby);
        if (line) rows.push({ category: optionLabel(key), detail: line.replace(/^: /, '') });
        break;
      }
      case 'pregnancy':
        rows.push({
          category: optionLabel(key),
          detail: data.details.pregnancy?.week
            ? `${data.details.pregnancy.week}. hafta`
            : 'Belirtildi',
        });
        break;
      case 'transfer': {
        const line = formatMultiSelect(
          '',
          data.details.transfer,
          data.details.transfer?.location
        );
        if (line) rows.push({ category: optionLabel(key), detail: line.replace(/^: /, '') });
        break;
      }
      case 'language': {
        const line = formatMultiSelect('', data.details.language);
        if (line) rows.push({ category: optionLabel(key), detail: line.replace(/^: /, '') });
        break;
      }
      case 'celebration': {
        const line = formatMultiSelect('', data.details.celebration);
        if (line) rows.push({ category: optionLabel(key), detail: line.replace(/^: /, '') });
        break;
      }
      case 'equipment': {
        const eq = data.details.equipment;
        if (eq) {
          const parts = [
            eq.height && `Boy: ${eq.height}`,
            eq.weight && `Kilo: ${eq.weight}`,
            eq.shoeSize && `Ayakkabı: ${eq.shoeSize}`,
            eq.clothingSize && `Beden: ${eq.clothingSize}`,
          ].filter(Boolean);
          if (parts.length) {
            rows.push({ category: optionLabel(key), detail: parts.join(', ') });
          }
        }
        break;
      }
      case 'other':
        if (data.details.other?.trim()) {
          rows.push({ category: optionLabel(key), detail: data.details.other.trim() });
        }
        break;
    }
  }

  return rows;
}

export function buildSpecialRequestsText(data: SpecialConditionsData): string | null {
  const summary = formatSpecialConditionsSummary(data);
  if (summary.length === 1 && summary[0] === 'Özel bir durum belirtilmedi.') {
    return null;
  }
  return summary.join(' | ');
}

export const MAX_SPECIAL_CONDITION_TEXT = MAX_TEXT_LENGTH;
