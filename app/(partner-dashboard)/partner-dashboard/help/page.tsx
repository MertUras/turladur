'use client';

import { useState } from 'react';
import { ChevronDownIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface FaqItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const faqs: FaqItem[] = [
    {
      question: 'Turladur panelini nasıl kullanabilirim?',
      answer: 'Turladur panel, turlarınızı yönetmek için tasarlanmış kullanıcı dostu bir arayüzdür. Sol taraftaki menüden istediğiniz bölüme tıklayarak ilgili özelliklere erişebilirsiniz. Örneğin, Turlarım menüsüne tıklayarak turlarınızı görüntüleyebilir ve yönetebilirsiniz.'
    },
    {
      question: 'Yeni bir tur nasıl oluştururum?',
      answer: 'Yeni bir tur oluşturmak için "Turlarım" sayfasına gidin ve sağ üst köşedeki "Yeni Tur Ekle" butonuna tıklayın. Açılan formda tur bilgilerini doldurun ve kaydedin. Tur adı, açıklama, fiyat, süre ve konum gibi bilgileri eksiksiz doldurmanız önerilir.'
    },
    {
      question: 'Rezervasyonları nasıl yönetebilirim?',
      answer: 'Rezervasyonlar menüsüne tıklayarak tüm rezervasyonlarınızı görebilirsiniz. Buradan rezervasyonları onaylayabilir, iptal edebilir veya detaylarını inceleyebilirsiniz. Ayrıca, rezervasyon sahibi ile iletişime geçmek için ilgili rezervasyonun detay sayfasında iletişim bilgilerine ulaşabilirsiniz.'
    },
    {
      question: 'Müşteri yorumlarını nasıl yanıtlarım?',
      answer: 'Yorumlar sayfasında tüm müşteri yorumlarını görebilirsiniz. Her yorumun altında bulunan "Yanıtla" butonuna tıklayarak yanıt verebilirsiniz. Olumlu veya olumsuz tüm yorumları profesyonel bir şekilde yanıtlamanız tavsiye edilir.'
    },
    {
      question: 'Ödemeler ne zaman hesabıma geçer?',
      answer: 'Rezervasyon tamamlandıktan sonra ödeme, sistem tarafından 24 saat içinde onaylanır ve 3-5 iş günü içinde banka hesabınıza aktarılır. Finansal Durum sayfasından tüm ödeme hareketlerinizi takip edebilirsiniz.'
    },
    {
      question: 'Şifremi unuttum, ne yapmalıyım?',
      answer: 'Giriş sayfasında "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinize sıfırlama bağlantısı gönderilmesini sağlayabilirsiniz. Bu bağlantı üzerinden yeni bir şifre oluşturabilirsiniz.'
    },
    {
      question: 'Tur fiyatını nasıl güncelleyebilirim?',
      answer: 'Turlarım sayfasından ilgili turun yanındaki "Düzenle" butonuna tıklayarak tur detaylarını güncelleyebilirsiniz. Fiyat alanını değiştirdikten sonra "Kaydet" butonuna tıklayarak değişiklikleri kaydedebilirsiniz.'
    },
    {
      question: 'Tur için kontenjan nasıl belirlerim?',
      answer: 'Tur oluşturma veya düzenleme formunda "Kontenjan" alanına maksimum katılımcı sayısını girebilirsiniz. Bu sayıya ulaşıldığında sistem otomatik olarak yeni rezervasyonları kapatacaktır.'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Yardım ve Destek Merkezi</h1>
        <p className="text-gray-500">Sıkça sorulan sorular ve destek bilgileri</p>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-indigo-600" />
          Sıkça Sorulan Sorular
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <button
                className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <ChevronDownIcon 
                  className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-indigo-600" />
            Canlı Destek
          </h2>
          <p className="text-gray-600 mb-4">
            Teknik ekibimiz hafta içi 09:00-18:00 saatleri arasında canlı destek üzerinden sorularınızı yanıtlamaya hazır.
          </p>
          <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition">
            Canlı Desteğe Bağlan
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <EnvelopeIcon className="h-6 w-6 mr-2 text-indigo-600" />
            E-posta Desteği
          </h2>
          <p className="text-gray-600 mb-4">
            Sorularınız ve önerileriniz için bize e-posta gönderebilirsiniz. En kısa sürede yanıt vermeye çalışacağız.
          </p>
          <a 
            href="mailto:destek@turladur.com" 
            className="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition text-center"
          >
            E-posta Gönder
          </a>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <PhoneIcon className="h-6 w-6 mr-2 text-indigo-600" />
          İletişim Bilgileri
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex">
            <span className="font-medium w-32">Telefon:</span>
            <span>+90 (212) 123 45 67</span>
          </li>
          <li className="flex">
            <span className="font-medium w-32">E-posta:</span>
            <span>destek@turladur.com</span>
          </li>
          <li className="flex">
            <span className="font-medium w-32">Adres:</span>
            <span>Maslak Mah. Büyükdere Cad. No:123 Sarıyer/İstanbul</span>
          </li>
          <li className="flex">
            <span className="font-medium w-32">Çalışma Saatleri:</span>
            <span>Hafta içi 09:00 - 18:00</span>
          </li>
        </ul>
      </div>
      
      <div className="text-center">
        <p className="text-gray-500 text-sm">Turladur © 2023. Tüm hakları saklıdır.</p>
      </div>
    </div>
  );
} 