import { StatTrend } from './types';

const TR_MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const TR_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatPercentTrend(
  current: number,
  previous: number,
  changeText = 'Geçen aya göre'
): StatTrend | undefined {
  if (current === 0 && previous === 0) return undefined;

  if (previous === 0) {
    return {
      change: current > 0 ? '+100%' : '0%',
      changeType: current >= 0 ? 'increase' : 'decrease',
      changeText,
    };
  }

  const pct = ((current - previous) / previous) * 100;
  const rounded = Math.round(pct);
  return {
    change: `${rounded >= 0 ? '+' : ''}${rounded}%`,
    changeType: rounded >= 0 ? 'increase' : 'decrease',
    changeText,
  };
}

export function formatAbsoluteTrend(
  current: number,
  previous: number,
  changeText: string
): StatTrend | undefined {
  if (current === 0 && previous === 0) return undefined;

  const diff = current - previous;
  return {
    change: `${diff >= 0 ? '+' : ''}${diff}`,
    changeType: diff >= 0 ? 'increase' : 'decrease',
    changeText,
  };
}

export function formatRatingTrend(
  current: number,
  previous: number,
  changeText = 'Geçen aya göre'
): StatTrend | undefined {
  if (current === 0 && previous === 0) return undefined;

  const diff = current - previous;
  if (Math.abs(diff) < 0.05) return undefined;

  return {
    change: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`,
    changeType: diff >= 0 ? 'increase' : 'decrease',
    changeText,
  };
}

export function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatTurkishDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTurkishTime(date: Date): string {
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTurkishCurrency(amount: number): string {
  return `${amount.toLocaleString('tr-TR')}₺`;
}

export function monthLabel(date: Date): string {
  return TR_MONTHS[date.getMonth()];
}

export function dayLabel(date: Date): string {
  return TR_DAYS[date.getDay()];
}

export function extractLocation(destinations: unknown, fallback?: string | null): string {
  if (Array.isArray(destinations) && destinations.length > 0) {
    const first = destinations[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && 'name' in first) {
      return String((first as { name: unknown }).name);
    }
  }
  return fallback || 'Belirtilmemiş';
}

export function groupRevenueByPeriod(
  bookings: { startDate: Date; totalPrice: number }[],
  range: 'week' | 'month' | 'year',
  now = new Date()
): { label: string; revenue: number }[] {
  if (range === 'week') {
    const points: { label: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = startOfDay(addDays(now, -i));
      const nextDay = startOfDay(addDays(day, 1));
      const revenue = bookings
        .filter(
          (b) =>
            b.startDate >= day &&
            b.startDate < nextDay
        )
        .reduce((sum, b) => sum + b.totalPrice, 0);
      points.push({ label: dayLabel(day), revenue });
    }
    return points;
  }

  if (range === 'month') {
    const points: { label: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(addMonths(now, -i));
      const monthEnd = endOfMonth(monthStart);
      const revenue = bookings
        .filter((b) => b.startDate >= monthStart && b.startDate <= monthEnd)
        .reduce((sum, b) => sum + b.totalPrice, 0);
      points.push({ label: monthLabel(monthStart), revenue });
    }
    return points;
  }

  const points: { label: string; revenue: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = startOfMonth(addMonths(now, -i));
    const monthEnd = endOfMonth(monthStart);
    const revenue = bookings
      .filter((b) => b.startDate >= monthStart && b.startDate <= monthEnd)
      .reduce((sum, b) => sum + b.totalPrice, 0);
    points.push({
      label: `${monthLabel(monthStart).slice(0, 3)} ${monthStart.getFullYear()}`,
      revenue,
    });
  }
  return points;
}

export { TR_MONTHS };
