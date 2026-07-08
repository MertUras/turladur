import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Prisma'nın `Json?` alanları veritabanında null, düzgün bir dizi ya da
 * (eski seed verilerinde olduğu gibi) JSON.stringify edilmiş bir metin
 * olarak saklanmış olabilir. Bu fonksiyon her durumda güvenli bir dizi
 * döndürür, böylece `.map`/`.filter` çağrıları asla patlamaz.
 */
export function parseJsonArray<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (typeof value === 'string' && value.trim() !== '') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch {
      // JSON değilse tek elemanlı dizi olarak kabul et
      return [value as unknown as T];
    }
  }

  return [];
}

interface ScheduleItem {
  time: string;
  activity: string;
}

/**
 * Program akışı öğelerini normalize eder. Eski verilerde `activity`
 * alanı yerine `description` kullanılmış olabilir, bu yüzden ikisini de
 * destekler.
 */
export function parseJsonSchedule(value: unknown): ScheduleItem[] {
  return parseJsonArray<Record<string, unknown>>(value)
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      time: typeof item.time === 'string' ? item.time : '',
      activity:
        typeof item.activity === 'string'
          ? item.activity
          : typeof item.description === 'string'
          ? item.description
          : '',
    }));
}

// Tarih formatı
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Para birimi formatı
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount);
};

// Durum sınıfları
export const getStatusClass = (status: string) => {
  const statusClasses = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
};

// Durum çevirisi
export const translateStatus = (status: string) => {
  const statusTranslations = {
    confirmed: 'Onaylandı',
    pending: 'Beklemede',
    cancelled: 'İptal Edildi',
    completed: 'Tamamlandı'
  };
  return statusTranslations[status as keyof typeof statusTranslations] || status;
}; 