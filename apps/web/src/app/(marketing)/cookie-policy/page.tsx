import type { Metadata } from 'next';

import { LegalPageShell } from '@/components/features/legal/legal-page-shell';

export const metadata: Metadata = {
  title: 'Çerez Politikası | turta',
  description: 'turta web sitesinde kullanılan çerezler ve tercih yönetimi.',
};

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Çerez Politikası"
      description="Sitemizde kullanılan çerez türleri ve amaçları hakkında bilgilendirme."
    >
      <section>
        <h2 className="text-lg font-semibold text-neutral-900">
          1. Çerez nedir?
        </h2>
        <p>
          Çerezler, siteyi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük
          metin dosyalarıdır. Oturum, güvenlik ve tercihlerinizi hatırlamak için
          kullanılır.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-neutral-900">
          2. Kullandığımız türler
        </h2>
        <p>
          Zorunlu çerezler (oturum/güvenlik), performans çerezleri (anonim
          istatistik) ve tercih çerezleri kullanılabilir. Pazarlama çerezleri
          yalnızca onayınızla etkinleşir.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-neutral-900">3. Yönetim</h2>
        <p>
          Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilirsiniz.
          Zorunlu çerezler olmadan bazı özellikler (giriş, rezervasyon)
          çalışmayabilir.
        </p>
      </section>
    </LegalPageShell>
  );
}
