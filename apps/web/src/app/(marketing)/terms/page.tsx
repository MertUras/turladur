import type { Metadata } from 'next';

import { LegalPageShell } from '@/components/features/legal/legal-page-shell';

export const metadata: Metadata = {
  title: 'Kullanım Şartları | turta',
  description:
    'turta platformunu kullanırken geçerli olan şartlar ve sorumluluklar.',
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Kullanım Şartları"
      description="Platformu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız."
    >
      <section>
        <h2 className="text-lg font-semibold text-neutral-900">
          1. Hizmet kapsamı
        </h2>
        <p>
          turta; turlar, aktiviteler ve ilgili rezervasyon hizmetlerini dijital
          olarak sunar. Partner içerikleri partnerlerin sorumluluğundadır;
          platform aracılık ve teknik altyapı sağlar.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-neutral-900">
          2. Hesap ve güvenlik
        </h2>
        <p>
          Hesap bilgilerinizin gizliliğinden siz sorumlusunuz. Yetkisiz erişim
          şüphesinde derhal destek ekibine bildirin. Yanıltıcı bilgi veya kötüye
          kullanım hesap kısıtlamasına yol açabilir.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-neutral-900">
          3. Rezervasyon ve iptal
        </h2>
        <p>
          Rezervasyon koşulları seçilen ürün ve partner politikasına göre
          değişir. Ödeme, iptal ve iade kuralları rezervasyon anında gösterilen
          bilgilere tabidir.
        </p>
      </section>
    </LegalPageShell>
  );
}
