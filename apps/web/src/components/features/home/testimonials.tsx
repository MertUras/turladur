'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import { MessageCircle, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ayşe Kaya',
    role: 'Tur Operatörü',
    company: 'Kapadokya Gezileri',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    content:
      "Tur operasyonlarımızı turta üzerinden yönetmeye başladıktan sonra müşteri memnuniyetimiz %95'e yükseldi ve satışlarımız iki katına çıktı! Çok memnunuz.",
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    role: 'Seyahat Acentesi Sahibi',
    company: 'Mavi Tur Seyahat',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    content:
      'Analitik araçları sayesinde hangi turların popüler olduğunu anladık ve pazarlama stratejimizi buna göre şekillendirdik. Dönüşüm oranımız %35 arttı.',
  },
  {
    id: 3,
    name: 'Zeynep Şahin',
    role: 'Deneyim Sağlayıcı',
    company: 'İstanbul Lezzet Turları',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    content:
      'turta ile yeni bir kitleye ulaştık. Rezervasyonlarımız %75 arttı ve platformun kullanımı çok kolay. Operasyonel yükümüz azaldı.',
  },
  {
    id: 4,
    name: 'Can Özkan',
    role: 'Otel Müdürü',
    company: 'Bodrum Paradise Resort',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    content:
      "Online satış kanalımız turta ile %60 büyüdü. Komisyon maliyetlerimizdeki %25'lik düşüş de cabası. Kesinlikle tavsiye ederim.",
  },
  {
    id: 5,
    name: 'Ahmet Yılmaz',
    role: 'Otel Sahibi',
    company: 'Grand Hotel İstanbul',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    content:
      'Rezervasyon yönetimi hiç bu kadar kolay olmamıştı. Otelimizin doluluk oranı %40 arttı ve gelirlerimizde gözle görülür bir artış sağladık.',
  },
];

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = testimonialsRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section
      ref={testimonialsRef}
      className={`border-y border-neutral-200/60 bg-neutral-50 py-24 transition-opacity duration-1000 ease-out md:py-32 ${isVisible ? 'opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800">
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Müşteri Deneyimleri
          </div>
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            İş Ortaklarımız Ne Diyor?
          </h2>
          <p className="text-lg text-neutral-600">
            turta kullanan işletmelerin başarılarını ve deneyimlerini kendi
            ağızlarından dinleyin.
          </p>
        </div>

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
                className="mx-4 w-80 flex-shrink-0 sm:w-[350px]"
              >
                <div className="flex h-full flex-col rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <p className="mb-6 flex-grow text-sm font-normal italic leading-relaxed text-neutral-700 before:mr-1 before:font-serif before:text-xl before:text-neutral-400 before:content-['\201C'] after:ml-1 after:font-serif after:text-xl after:text-neutral-400 after:content-['\201D']">
                    {testimonial.content}
                  </p>

                  <div className="mt-auto flex items-center border-t border-neutral-100 pt-4">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold leading-tight text-neutral-800">
                        {testimonial.name}
                      </p>
                      <p className="text-xs leading-tight text-neutral-500">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        <div className="mt-16 text-center md:mt-20">
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            Tüm Başarı Hikayelerini Gör
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
