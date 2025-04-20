"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { ChatBubbleLeftRightIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

// Sadeleştirilmiş müşteri yorumları verisi
const testimonials = [
  {
    id: 1,
    name: "Ayşe Kaya",
    role: "Tur Operatörü",
    company: "Kapadokya Gezileri",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    content: "Tur operasyonlarımızı TourTech üzerinden yönetmeye başladıktan sonra müşteri memnuniyetimiz %95'e yükseldi ve satışlarımız iki katına çıktı! Çok memnunuz.",
  },
  {
    id: 2,
    name: "Mehmet Demir",
    role: "Seyahat Acentesi Sahibi",
    company: "Mavi Tur Seyahat",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "Analitik araçları sayesinde hangi turların popüler olduğunu anladık ve pazarlama stratejimizi buna göre şekillendirdik. Dönüşüm oranımız %35 arttı.",
  },
  {
    id: 3,
    name: "Zeynep Şahin",
    role: "Deneyim Sağlayıcı",
    company: "İstanbul Lezzet Turları",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "TourTech ile yeni bir kitleye ulaştık. Rezervasyonlarımız %75 arttı ve platformun kullanımı çok kolay. Operasyonel yükümüz azaldı.",
  },
  {
    id: 4,
    name: "Can Özkan",
    role: "Otel Müdürü",
    company: "Bodrum Paradise Resort",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    content: "Online satış kanalımız TourTech ile %60 büyüdü. Komisyon maliyetlerimizdeki %25'lik düşüş de cabası. Kesinlikle tavsiye ederim.",
  },
  {
    id: 5,
    name: "Ahmet Yılmaz",
    role: "Otel Sahibi",
    company: "Grand Hotel İstanbul",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "Rezervasyon yönetimi hiç bu kadar kolay olmamıştı. Otelimizin doluluk oranı %40 arttı ve gelirlerimizde gözle görülür bir artış sağladık.",
  }
];

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Görünürlük kontrolü
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = testimonialsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section 
      ref={testimonialsRef}
      className={`py-24 md:py-32 bg-neutral-50 border-y border-neutral-200/60 transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
    >
      <div className="container px-6 mx-auto max-w-7xl">
        {/* Başlık Bölümü */}
        <div className="text-center max-w-3xl mx-auto mb-16">
           <div className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
             <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1.5" />
             Müşteri Deneyimleri
           </div>
           <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
             İş Ortaklarımız Ne Diyor?
           </h2>
           <p className="text-lg text-neutral-600">
             TourTech'i kullanan işletmelerin başarılarını ve deneyimlerini kendi ağızlarından dinleyin.
           </p>
        </div>
        
        {/* Müşteri Değerlendirmeleri Marquee */}
        <div className="-mx-4 md:-mx-6 lg:-mx-8">
          <Marquee
            gradient={true}
            gradientColor={'rgb(248, 250, 252)'}
            gradientWidth={100}
            speed={25}
            pauseOnHover={true}
            className="py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="mx-4 w-80 sm:w-[350px] flex-shrink-0"
              >
                <div className="bg-white border border-neutral-200/80 rounded-xl p-6 flex flex-col h-full shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <p className="text-sm text-neutral-700 font-normal leading-relaxed mb-6 flex-grow italic before:content-['\201C'] before:mr-1 before:text-sky-500 before:text-xl before:font-serif after:content-['\201D'] after:ml-1 after:text-sky-500 after:text-xl after:font-serif">
                    {testimonial.content}
                  </p>
                  
                  <div className="mt-auto flex items-center pt-4 border-t border-neutral-100">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-neutral-800 text-sm leading-tight">{testimonial.name}</p>
                      <p className="text-xs text-neutral-500 leading-tight">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* CTA Butonu - Stil güncellendi */}
        <div className="mt-16 md:mt-20 text-center">
          <Link 
            href="/basari-hikayeleri"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-sky-700 border border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors font-medium rounded-lg shadow-sm text-sm"
          >
            Tüm Başarı Hikayelerini Gör
            <ArrowRightIcon className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
} 