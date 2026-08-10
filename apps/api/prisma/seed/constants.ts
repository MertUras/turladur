/** Shared demo seed constants — password Demo1234! for all actors. */
export const DEMO_PASSWORD = 'Demo1234!';

export const COUNT = 5;

export const TOURS_PER_AGENCY = 5;
export const EXPERIENCES_PER_AGENCY = 5;

export const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
] as const;

export const TOUR_TEMPLATES = [
  {
    title: 'Kapadokya Peri Bacaları',
    city: 'Nevşehir',
    category: 'CULTURAL' as const,
    days: 3,
    price: 4890,
  },
  {
    title: 'Antalya Likya Yolu',
    city: 'Antalya',
    category: 'NATURE' as const,
    days: 4,
    price: 6290,
  },
  {
    title: 'İstanbul Boğaz & Tarih',
    city: 'İstanbul',
    category: 'CITY' as const,
    days: 2,
    price: 3490,
  },
  {
    title: 'Ege Gastronomi Rotası',
    city: 'İzmir',
    category: 'GASTRONOMY' as const,
    days: 3,
    price: 5190,
  },
  {
    title: 'Karadeniz Yayla Escape',
    city: 'Trabzon',
    category: 'ADVENTURE' as const,
    days: 5,
    price: 7450,
  },
] as const;

export const EXPERIENCE_TEMPLATES = [
  {
    title: 'Çömlek Atölyesi',
    location: 'Avanos',
    category: 'Kültür',
    duration: '2 saat',
    price: 890,
  },
  {
    title: 'Tekne Turu',
    location: 'Kaş',
    category: 'Deniz',
    duration: '4 saat',
    price: 1450,
  },
  {
    title: 'Şarap Tadımı',
    location: 'Urla',
    category: 'Gastronomi',
    duration: '3 saat',
    price: 1200,
  },
  {
    title: 'Yamaç Paraşütü',
    location: 'Fethiye',
    category: 'Macera',
    duration: '1 saat',
    price: 3500,
  },
  {
    title: 'Balon İzleme',
    location: 'Göreme',
    category: 'Doğa',
    duration: '3 saat',
    price: 2100,
  },
] as const;

export const AGENCY_CITIES = [
  'Ankara',
  'İstanbul',
  'Antalya',
  'İzmir',
  'Trabzon',
] as const;
