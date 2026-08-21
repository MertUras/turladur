import Link from 'next/link';
import {
  ChevronDown as ChevronDownIcon,
  HelpCircle as QuestionMarkCircleIcon,
  Mail as EnvelopeIcon,
} from 'lucide-react';

import { PLATFORM_FAQ_ITEMS, type FaqItem } from './faq-data';

type FaqSectionProps = {
  items?: FaqItem[];
  /** İletişim CTA hedefi — `/contact` veya `#contactForm` */
  contactHref?: string;
};

export function FaqSection({
  items = PLATFORM_FAQ_ITEMS,
  contactHref = '/contact',
}: FaqSectionProps) {
  const isHash = contactHref.startsWith('#');

  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800">
            <QuestionMarkCircleIcon className="mr-1.5 h-4 w-4" />
            Sıkça Sorulan Sorular
          </div>
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            Aklınızdaki Soruların Yanıtları
          </h2>
          <p className="text-lg text-neutral-600">
            Seyahat ve rezervasyon süreçlerinizle ilgili en çok sorulan
            soruların yanıtlarını burada bulabilirsiniz.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="space-y-3">
            {items.map((faq) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-lg border border-neutral-200/80 bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-medium transition-colors hover:bg-neutral-50">
                  <span className="text-base font-semibold text-neutral-800">
                    {faq.question}
                  </span>
                  <span className="ml-4 flex-shrink-0 transform transition-transform duration-200 group-open:rotate-180">
                    <ChevronDownIcon className="h-5 w-5 text-neutral-500" />
                  </span>
                </summary>
                <div className="border-t border-neutral-200/60 px-5 pb-5 pt-2">
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 border-t border-neutral-200 pt-8 text-center">
            <p className="mb-5 text-sm text-neutral-600">
              Aradığınız sorunun cevabını bulamadınız mı?
            </p>
            {isHash ? (
              <a
                href={contactHref}
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-950 shadow-sm transition-colors hover:bg-neutral-100"
              >
                <EnvelopeIcon className="mr-2 h-4 w-4" />
                Bize Sorun
              </a>
            ) : (
              <Link
                href={contactHref}
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-950 shadow-sm transition-colors hover:bg-neutral-100"
              >
                <EnvelopeIcon className="mr-2 h-4 w-4" />
                Bize Sorun
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
