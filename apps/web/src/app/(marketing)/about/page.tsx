import type { Metadata } from 'next';

import AboutPageContent from '@/components/features/about/about-page';

export const metadata: Metadata = {
  title: 'Hakkımızda | turta',
  description:
    'turta vizyonu, değerleri ve başarı öyküsü. Turizm sektörünü teknolojiyle dönüştürüyoruz.',
};

export default function AboutPage() {
  return <AboutPageContent />;
}
