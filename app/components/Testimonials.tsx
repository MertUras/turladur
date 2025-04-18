"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

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
      className={`py-24 bg-white transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Başlık Bölümü */}
        <div className="text-center max-w-3xl mx-auto mb-16">
           <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-6">
             Referanslarımız
           </div>
           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
             Müşterilerimizin Deneyimleri
           </h2>
           <p className="text-lg text-gray-600 leading-relaxed">
             TourTech'i kullanan işletmelerin başarılarını ve deneyimlerini kendi ağızlarından dinleyin.
           </p>
        </div>
        
        {/* Müşteri Değerlendirmeleri Marquee */}
        <div className="-mx-4">
          <Marquee
            gradient={false}
            speed={30}
            pauseOnHover={true}
            className="py-8"
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="mx-4 w-80 sm:w-96 flex-shrink-0"
              >
                <div className="bg-gray-50/70 border-t-2 border-black p-6 flex flex-col h-full transition-shadow duration-300 hover:shadow-lg">
                  <p className="text-base text-gray-800 font-normal leading-relaxed mb-8 flex-grow">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="mt-auto flex items-center pt-4 border-t border-gray-200/80">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* CTA Butonu - Tema rengine döndürüldü */}
        <div className="mt-20 text-center">
          <Link 
            href="/basari-hikayeleri"
            className="inline-block px-8 py-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-medium rounded-md shadow-sm"
          >
            Tüm Başarı Hikayelerini Gör
          </Link>
        </div>
      </div>
    </section>
  );
} 