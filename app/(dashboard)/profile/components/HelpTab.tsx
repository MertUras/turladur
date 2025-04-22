'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

// Sample FAQ data
const faqs = [
  {
    question: "Rezervasyonumu nasıl iptal edebilirim?",
    answer: "Rezervasyonunuzu iptal etmek için \"Rezervasyonlarım\" sekmesinden ilgili rezervasyonu bulun ve \"İptal Et\" butonuna tıklayın. İptal koşulları, rezervasyon tarihinize ve seçtiğiniz hizmetin iptal politikasına göre değişiklik gösterebilir."
  },
  {
    question: "Ödeme yöntemimi nasıl değiştirebilirim?",
    answer: "\"Ödeme Bilgileri\" sekmesinden mevcut kartlarınızı yönetebilir ve yeni kart ekleyebilirsiniz. Onaylanmış bir rezervasyon için ödeme yöntemini değiştirmek isterseniz, müşteri hizmetleri ile iletişime geçmeniz gerekebilir."
  },
  {
    question: "Puanlarımı nasıl kullanabilirim?",
    answer: "Biriktirdiğiniz puanları yeni rezervasyonlarda indirim olarak kullanabilirsiniz. Ödeme sayfasında \"Puanlarımı Kullan\" seçeneğini işaretleyerek mevcut puanlarınızı kullanabilirsiniz. Her 100 puan 10₺ değerinde indirim sağlar."
  },
  {
    question: "Rezervasyon tarihimi değiştirebilir miyim?",
    answer: "Evet, çoğu rezervasyonun tarihini değiştirebilirsiniz. \"Rezervasyonlarım\" sekmesinden ilgili rezervasyonu bulun ve \"Değişiklik Talebi\" butonuna tıklayın. Değişiklik politikaları ve ek ücretler, rezervasyon tipine ve ilgili otelin veya turun politikalarına göre değişiklik gösterebilir."
  }
];

export default function HelpTab() {
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([0]);

  const toggleFAQ = (index: number) => {
    setExpandedFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Yardım ve Destek</h2>
        <p className="mt-1 text-sm text-neutral-600">Sıkça sorulan soruları bulun veya bizimle iletişime geçin.</p>
      </div>
      
      <div className="border border-neutral-200/80 rounded-xl overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button 
                className="flex justify-between items-center w-full text-left p-5 group focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-sm font-medium text-neutral-800 group-hover:text-sky-600 transition-colors">
                  {faq.question}
                </span>
                <ChevronDownIcon 
                  className={`h-5 w-5 text-neutral-400 group-hover:text-sky-600 transform transition-transform duration-200 ${expandedFAQs.includes(index) ? 'rotate-180' : ''}`} 
                />
              </button>
              {expandedFAQs.includes(index) && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center mt-8 pt-8 border-t border-neutral-200">
        <QuestionMarkCircleIcon className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Aradığınızı Bulamadınız mı?</h3>
        <p className="text-sm text-neutral-600 mb-5">Daha fazla yardım için destek ekibimizle iletişime geçebilirsiniz.</p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-5 py-2 bg-white hover:bg-neutral-50 text-sky-600 text-sm font-medium rounded-lg transition-colors border border-neutral-200 shadow-sm"
        >
          İletişime Geç
        </Link>
      </div>
    </div>
  );
} 