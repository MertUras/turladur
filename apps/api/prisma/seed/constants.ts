/** Shared demo seed constants — password Demo1234! for all actors. */
export const DEMO_PASSWORD = 'Demo1234!';

export const COUNT = 5;

export const TOURS_PER_AGENCY = 5;
export const EXPERIENCES_PER_AGENCY = 5;

/** Fallback only — prefer destination covers on templates. */
export const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
] as const;

/**
 * Destination-matched Unsplash covers (CDN/R2 untouched — public URLs only).
 * gallery[0] = hero; gallery[1+] = detail strip.
 */
export const TOUR_TEMPLATES = [
  {
    title: 'Kapadokya Peri Bacaları',
    city: 'Nevşehir',
    category: 'CULTURAL' as const,
    days: 3,
    price: 4890,
    coverUrl:
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1640127249334-aa4db85a0710?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1664288696902-47e4957dc6fa?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Antalya Likya Yolu',
    city: 'Antalya',
    category: 'NATURE' as const,
    days: 4,
    price: 6290,
    coverUrl:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596622723231-b093c8b6e8e7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'İstanbul Boğaz & Tarih',
    city: 'İstanbul',
    category: 'CITY' as const,
    days: 2,
    price: 3490,
    coverUrl:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527838832700-505075fba6c5?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Ege Gastronomi Rotası',
    city: 'İzmir',
    category: 'GASTRONOMY' as const,
    days: 3,
    price: 5190,
    coverUrl:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Karadeniz Yayla Escape',
    city: 'Trabzon',
    category: 'ADVENTURE' as const,
    days: 5,
    price: 7450,
    coverUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
] as const;

export const EXPERIENCE_TEMPLATES = [
  {
    title: 'Çömlek Atölyesi',
    location: 'Avanos',
    category: 'Kültür',
    duration: '2 saat',
    price: 890,
    imageUrl:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Tekne Turu',
    location: 'Kaş',
    category: 'Deniz',
    duration: '4 saat',
    price: 1450,
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Şarap Tadımı',
    location: 'Urla',
    category: 'Gastronomi',
    duration: '3 saat',
    price: 1200,
    imageUrl:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Yamaç Paraşütü',
    location: 'Fethiye',
    category: 'Macera',
    duration: '1 saat',
    price: 3500,
    imageUrl:
      'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Balon İzleme',
    location: 'Göreme',
    category: 'Doğa',
    duration: '3 saat',
    price: 2100,
    imageUrl:
      'https://images.unsplash.com/photo-1640127249334-aa4db85a0710?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1640127249334-aa4db85a0710?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=1200&q=80',
    ],
  },
] as const;

export const AGENCY_CITIES = [
  'Ankara',
  'İstanbul',
  'Antalya',
  'İzmir',
  'Trabzon',
] as const;
