"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// İş ortakları verileri - zenginleştirilmiş
const partners = [
  {
    id: 1,
    name: "Türkiye Turizm Tanıtım ve Geliştirme Ajansı",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TGA",
    category: "resmi",
    discount: "10% İndirim",
    special: "Resmi TGA Ortağı"
  },
  {
    id: 2,
    name: "Türkiye Otelciler Birliği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TUROB",
    category: "birlik",
    discount: "15% İndirim",
    special: "Özel Fırsatlar"
  },
  {
    id: 3,
    name: "Türkiye Seyahat Acentaları Birliği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TÜRSAB",
    category: "birlik",
    discount: "8% İndirim",
    special: "TÜRSAB Garantisi"
  },
  {
    id: 4,
    name: "Türkiye Turizm Yatırımcıları Derneği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TTYD",
    category: "dernek",
    discount: "5% İndirim"
  },
  {
    id: 5,
    name: "Kültür ve Turizm Bakanlığı",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=KTB",
    category: "resmi",
    special: "Kültür Turlarında Avantaj"
  },
  {
    id: 6,
    name: "Türkiye Otel Yöneticileri Derneği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TOYDED",
    category: "dernek",
    discount: "7% İndirim"
  },
  {
    id: 7,
    name: "Profesyonel Otel Yöneticileri Derneği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=POYD",
    category: "dernek",
    special: "VIP Odalar"
  },
  {
    id: 8,
    name: "Türkiye Turist Rehberleri Birliği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TUREB",
    category: "birlik",
    discount: "12% İndirim",
    special: "Profesyonel Rehberler"
  }
];

// Örnek logo URL'leri (gerçek logolar yerine)
const placeholderLogos = [
  "https://placehold.co/200x80/e2e8f0/475569?text=TGA",
  "https://placehold.co/200x80/e2e8f0/475569?text=TUROB",
  "https://placehold.co/200x80/e2e8f0/475569?text=TÜRSAB",
  "https://placehold.co/200x80/e2e8f0/475569?text=TTYD",
  "https://placehold.co/200x80/e2e8f0/475569?text=KTB",
  "https://placehold.co/200x80/e2e8f0/475569?text=TOYDED",
  "https://placehold.co/200x80/e2e8f0/475569?text=POYD",
  "https://placehold.co/200x80/e2e8f0/475569?text=TUREB"
];

// Kategori filtreleri
const categories = [
  { id: "tumu", label: "Tümü" },
  { id: "resmi", label: "Resmi Kurumlar" },
  { id: "birlik", label: "Birlikler" },
  { id: "dernek", label: "Dernekler" },
  { id: "indirim", label: "İndirimler" }
];

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState("tumu");
  const [isVisible, setIsVisible] = useState(false);
  const partnersRef = useRef<HTMLDivElement>(null);

  // Görünürlük kontrolü
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (partnersRef.current) {
      observer.observe(partnersRef.current);
    }
    
    return () => {
      if (partnersRef.current) {
        observer.unobserve(partnersRef.current);
      }
    };
  }, []);

  // Filtrelenmiş ortaklar
  const filteredPartners = partners.filter(
    (partner) => {
      if (activeCategory === "tumu") return true;
      if (activeCategory === "indirim") return partner.discount;
      return partner.category === activeCategory;
    }
  );

  return (
    <section 
      ref={partnersRef}
      className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden"
    >
      {/* Dekoratif arka plan öğeleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900 to-transparent"></div>
        </div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-blue-600 mb-1"></div>
            <div className="h-1 w-12 bg-blue-600"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Özel Fırsatlar ve İş Ortakları
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            TourTech olarak sektörün önde gelen kurumlarıyla yaptığımız işbirlikleri sayesinde sizlere özel indirimler ve ayrıcalıklar sunuyoruz
          </p>
        </div>

        {/* Öne çıkan işbirliği teklifi */}
        <div className={`mb-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden transition-all duration-1000 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-10 md:w-2/3 text-white">
              <div className="inline-block mb-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                Sınırlı Zaman Teklifi
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">TÜRSAB İşbirliği Özel Kampanyası</h3>
              <p className="text-blue-100 mb-6">
                TÜRSAB üyesi acenteler aracılığıyla yapacağınız tüm rezervasyonlarda ekstra %15 indirim fırsatı! Üstelik ek hizmetlerde de özel avantajlar sizi bekliyor.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/kampanyalar/tursab" 
                  className="inline-flex items-center px-5 py-2.5 bg-white text-blue-800 rounded-md font-medium hover:bg-blue-50 transition-colors"
                >
                  Kampanyayı İncele
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <span className="inline-flex items-center px-5 py-2.5 bg-blue-500 bg-opacity-30 text-white rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Son 7 Gün
                </span>
              </div>
            </div>
            <div className="p-6 md:w-1/3 flex items-center justify-center">
              <div className="relative h-32 w-full max-w-xs">
                <Image
                  src="https://placehold.co/300x150/3b82f6/ffffff?text=TÜRSAB+Özel"
                  alt="TÜRSAB Özel Teklif"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kategori filtreleri */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* İş ortakları logoları - kartlara dönüştürüldü */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filteredPartners.map((partner, idx) => (
            <div
              key={partner.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col transition-all duration-500 transform hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 overflow-hidden"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="p-6 flex items-center justify-center border-b border-gray-100">
                <div className="relative h-16 w-full">
                  <Image
                    src={placeholderLogos[idx % placeholderLogos.length]}
                    alt={partner.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
              
              <div className="p-5">
                <h4 className="text-sm font-medium text-gray-800 mb-2">{partner.name}</h4>
                
                {partner.discount && (
                  <div className="flex items-center mb-2 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium">{partner.discount}</span>
                  </div>
                )}
                
                {partner.special && (
                  <div className="flex items-center mb-2 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="font-medium">{partner.special}</span>
                  </div>
                )}
                
                <Link 
                  href={`/partners/${partner.id}`}
                  className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  Teklifleri Gör
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* İşbirliği butonu */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg inline-block max-w-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Kurumsal Müşterilerimize Özel</h3>
            <p className="text-gray-600 mb-4">Şirketiniz veya kurumunuz için özel indirimler ve avantajlardan yararlanmak ister misiniz?</p>
            
            <Link 
              href="/kurumsal/isbirligi" 
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-all duration-300 font-medium"
            >
              <span>Kurumsal İşbirliği Başlatın</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 