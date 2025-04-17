import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim | TourTech - Profesyonel Seyahat Deneyimi',
  description: 'TourTech ile iletişime geçin. Sorunlarınız, önerileriniz veya rezervasyonlarınız için bize ulaşın. 7/24 müşteri hizmetleri desteği.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 