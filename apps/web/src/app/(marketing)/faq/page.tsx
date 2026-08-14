import type { Metadata } from 'next';

import { FaqSection } from '@/components/features/faq/faq-section';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | turta',
  description:
    'Rezervasyon, ödeme ve partner süreçleriyle ilgili sıkça sorulan sorular.',
};

export default function FaqPage() {
  return (
    <div className="pt-8">
      <FaqSection contactHref="/contact" />
    </div>
  );
}
