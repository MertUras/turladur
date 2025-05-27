import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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