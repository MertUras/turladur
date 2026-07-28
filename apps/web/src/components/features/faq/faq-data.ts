export type FaqItem = {
  question: string;
  answer: string;
};

/** Platform genel SSS — iletişim ve blog gibi marketing yüzeylerinde ortak. */
export const PLATFORM_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Rezervasyon iptali nasıl yapılır?',
    answer:
      "Rezervasyon iptallerinizi hesabınızın 'Rezervasyonlarım' bölümünden yapabilirsiniz. İptal koşulları rezervasyon tipine göre değişiklik gösterebilir. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz.",
  },
  {
    question: 'Ödeme seçenekleri nelerdir?',
    answer:
      'turta üzerinden kredi kartı, banka kartı, havale/EFT ve online ödeme sistemleri ile ödeme yapabilirsiniz. Bazı rezervasyonlarda taksit seçenekleri de sunulmaktadır.',
  },
  {
    question: 'Rezervasyon sonrası değişiklik yapabilir miyim?',
    answer:
      'Evet, çoğu rezervasyonda değişiklik yapabilirsiniz. Değişiklik koşulları ve ücretleri, rezervasyon tipine ve otel/tur politikasına göre değişiklik gösterebilir.',
  },
  {
    question: 'Grup rezervasyonları için özel fiyatlar mevcut mu?',
    answer:
      'Evet, 10 kişi ve üzeri grup rezervasyonları için özel fiyat ve avantajlar sunuyoruz. Grup rezervasyonları için iletişim formumuz üzerinden bize ulaşabilirsiniz.',
  },
  {
    question: 'Yurt dışı turlarında vize desteği sağlıyor musunuz?',
    answer:
      'Evet, yurt dışı turlarımızda vize süreçlerinize destek sağlıyoruz. Gerekli evraklar ve başvuru süreci hakkında detaylı bilgilendirme yapıyoruz.',
  },
];
