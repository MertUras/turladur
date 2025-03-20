"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  TagIcon, 
  ChevronRightIcon, 
  ClockIcon, 
  CheckBadgeIcon, 
  ArrowRightIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TicketIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

// İş ortakları verileri - zenginleştirilmiş
const partners = [
  {
    id: 1,
    name: "Türkiye Turizm Tanıtım ve Geliştirme Ajansı",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TGA",
    category: "resmi",
    discount: "10% İndirim",
    special: "Resmi TGA Ortağı",
    color: "from-blue-600 to-blue-800",
    icon: GlobeAltIcon
  },
  {
    id: 2,
    name: "Türkiye Otelciler Birliği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TUROB",
    category: "birlik",
    discount: "15% İndirim",
    special: "Özel Fırsatlar",
    color: "from-indigo-600 to-indigo-800",
    icon: BuildingOfficeIcon
  },
  {
    id: 3,
    name: "Türkiye Seyahat Acentaları Birliği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TÜRSAB",
    category: "birlik",
    discount: "8% İndirim",
    special: "TÜRSAB Garantisi",
    color: "from-purple-600 to-purple-800",
    icon: UserGroupIcon
  },
  {
    id: 4,
    name: "Türkiye Turizm Yatırımcıları Derneği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TTYD",
    category: "dernek",
    discount: "5% İndirim",
    color: "from-emerald-600 to-emerald-800",
    icon: ArrowTrendingUpIcon
  },
  {
    id: 5,
    name: "Kültür ve Turizm Bakanlığı",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=KTB",
    category: "resmi",
    special: "Kültür Turlarında Avantaj",
    color: "from-red-600 to-red-800",
    icon: AcademicCapIcon
  },
  {
    id: 6,
    name: "Türkiye Otel Yöneticileri Derneği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TOYDED",
    category: "dernek",
    discount: "7% İndirim",
    color: "from-cyan-600 to-cyan-800",
    icon: BuildingOfficeIcon
  },
  {
    id: 7,
    name: "Profesyonel Otel Yöneticileri Derneği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=POYD",
    category: "dernek",
    special: "VIP Odalar",
    color: "from-amber-600 to-amber-800",
    icon: UserGroupIcon
  },
  {
    id: 8,
    name: "Türkiye Turist Rehberleri Birliği",
    logo: "https://placehold.co/200x80/e2e8f0/475569?text=TUREB",
    category: "birlik",
    discount: "12% İndirim",
    special: "Profesyonel Rehberler",
    color: "from-teal-600 to-teal-800",
    icon: GlobeAltIcon
  }
];

// Kategori filtreleri
const categories = [
  { id: "tumu", label: "Tümü", icon: <GlobeAltIcon className="h-4 w-4" /> },
  { id: "resmi", label: "Resmi Kurumlar", icon: <AcademicCapIcon className="h-4 w-4" /> },
  { id: "birlik", label: "Birlikler", icon: <UserGroupIcon className="h-4 w-4" /> },
  { id: "dernek", label: "Dernekler", icon: <BuildingOfficeIcon className="h-4 w-4" /> },
  { id: "indirim", label: "İndirimler", icon: <TicketIcon className="h-4 w-4" /> }
];

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState("tumu");
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveredCard, setIsHoveredCard] = useState<number | null>(null);
  const [isHoveredButton, setIsHoveredButton] = useState(false);
  const [countdownDays, setCountdownDays] = useState(7);
  const partnersRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // İstemci tarafında çalıştığını kontrol et
  useEffect(() => {
    setIsClient(true);
    // Geri sayım güncellemesi (Her gün değişecek)
    const interval = setInterval(() => {
      if (countdownDays > 1) {
        setCountdownDays(prev => prev - 1);
      } else {
        clearInterval(interval);
      }
    }, 86400000); // 24 saat (demo amaçlı)
    
    return () => clearInterval(interval);
  }, []);

  // Görünürlük kontrolü
  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isClient]);

  // Filtrelenmiş ortaklar
  const filteredPartners = partners.filter(
    (partner) => {
      if (activeCategory === "tumu") return true;
      if (activeCategory === "indirim") return partner.discount;
      return partner.category === activeCategory;
    }
  );

  // Kategoriye geçiş animasyonu
  const handleCategoryChange = (categoryId: string) => {
    if (categoryRef.current) {
      categoryRef.current.classList.add('scale-95', 'opacity-80');
      setTimeout(() => {
        setActiveCategory(categoryId);
        if (categoryRef.current) {
          categoryRef.current.classList.remove('scale-95', 'opacity-80');
        }
      }, 150);
    } else {
      setActiveCategory(categoryId);
    }
  };

  return (
    <section 
      ref={partnersRef}
      className="py-24 bg-gradient-to-b from-blue-50 via-white to-blue-50 relative overflow-hidden"
    >
      {/* Dekoratif arka plan öğeleri - Geliştirilmiş */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply opacity-10 animate-blob animation-delay-4000"></div>
        
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900 to-transparent"></div>
        </div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center mb-4 gap-2">
            <div className="flex flex-col">
              <div className="h-1 w-24 bg-blue-600 mb-1 rounded-full"></div>
              <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
            </div>
            <GlobeAltIcon className="h-6 w-6 text-blue-600 ml-2 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Özel Fırsatlar ve İş Ortakları
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            TourTech olarak sektörün önde gelen kurumlarıyla yaptığımız işbirlikleri sayesinde sizlere özel indirimler ve ayrıcalıklar sunuyoruz
          </p>
        </div>

        {/* Öne çıkan işbirliği teklifi - Geliştirilmiş */}
        <div className={`mb-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 delay-150 transform hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row items-center relative">
            {/* Dekoratif öğeler */}
            <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-white rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full opacity-20"></div>
            </div>
            
            <div className="p-8 md:p-10 md:w-2/3 text-white relative z-10">
              <div className="inline-flex items-center mb-3 px-3 py-1.5 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-medium">
                <ClockIcon className="h-4 w-4 mr-1.5" />
                <span>Sınırlı Zaman Teklifi</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">TÜRSAB İşbirliği Özel Kampanyası</h3>
              <p className="text-blue-100 mb-6">
                TÜRSAB üyesi acenteler aracılığıyla yapacağınız tüm rezervasyonlarda ekstra %15 indirim fırsatı! Üstelik ek hizmetlerde de özel avantajlar sizi bekliyor.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/kampanyalar/tursab" 
                  className="group inline-flex items-center px-5 py-2.5 bg-white text-blue-800 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                  onMouseEnter={() => setIsHoveredButton(true)}
                  onMouseLeave={() => setIsHoveredButton(false)}
                >
                  <span>Kampanyayı İncele</span>
                  <ChevronRightIcon className={`h-4 w-4 ml-2 transition-transform duration-300 ${isHoveredButton ? 'translate-x-1' : ''}`} />
                </Link>
                <span className="inline-flex items-center px-5 py-2.5 bg-blue-500 bg-opacity-30 backdrop-blur-sm text-white rounded-lg">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>Son <span className="font-bold">{isClient ? countdownDays : 7}</span> Gün</span>
                </span>
              </div>
              
              {/* Özellik kartları */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="flex items-start bg-white bg-opacity-10 rounded-lg p-3">
                  <CheckBadgeIcon className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">TÜRSAB Garantisi</h4>
                    <p className="text-xs text-blue-200">Güvenli rezervasyon</p>
                  </div>
                </div>
                <div className="flex items-start bg-white bg-opacity-10 rounded-lg p-3">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">%15 Bonus İndirim</h4>
                    <p className="text-xs text-blue-200">Tüm rezervasyonlarda</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 md:w-1/3 flex items-center justify-center relative z-10">
              <div className="relative h-36 w-full max-w-xs transform transition-all duration-700 hover:scale-105">
                <Image
                  src="https://placehold.co/300x150/3b82f6/ffffff?text=TÜRSAB+Özel"
                  alt="TÜRSAB Özel Teklif"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kategori filtreleri - Geliştirilmiş */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div ref={categoryRef} className="transition-all duration-150">
            <div className="flex flex-wrap justify-center gap-3 bg-white p-2 rounded-xl shadow-md">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* İş ortakları logoları - Geliştirilmiş kartlar */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {filteredPartners.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 overflow-hidden group"
                style={{ transitionDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setIsHoveredCard(partner.id)}
                onMouseLeave={() => setIsHoveredCard(null)}
              >
                <div className={`p-6 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r ${partner.color} group-hover:opacity-90`}>
                  <div className="relative h-16 w-3/4">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <Icon className="h-8 w-8 text-white opacity-70" />
                </div>
                
                <div className="p-5">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">{partner.name}</h4>
                  
                  <div className="flex flex-col space-y-2 mb-4">
                    {partner.discount && (
                      <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-md">
                        <TagIcon className="h-4 w-4 mr-1.5" />
                        <span className="font-medium text-sm">{partner.discount}</span>
                      </div>
                    )}
                    
                    {partner.special && (
                      <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
                        <CheckBadgeIcon className="h-4 w-4 mr-1.5" />
                        <span className="font-medium text-sm">{partner.special}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href={`/partners/${partner.id}`}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center group cursor-pointer"
                  >
                    <span>Teklifleri Gör</span>
                    <ChevronRightIcon 
                      className={`h-4 w-4 ml-1 transition-transform duration-300 ${isHoveredCard === partner.id ? 'translate-x-1' : ''}`} 
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* İşbirliği butonu - Geliştirilmiş */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-lg inline-block max-w-2xl relative overflow-hidden">
            {/* Dekoratif öğeler */}
            <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-200 rounded-full opacity-30"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-200 rounded-full opacity-30"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center bg-blue-100 text-blue-700 p-3 rounded-full mb-4">
                <BuildingOfficeIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kurumsal Müşterilerimize Özel</h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">Şirketiniz veya kurumunuz için özel indirimler ve avantajlardan yararlanmak ister misiniz?</p>
              
              <Link 
                href="/kurumsal/isbirligi" 
                className="group inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>Kurumsal İşbirliği Başlatın</span>
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 

// Animasyon stilleri için CSS 
const styles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;

// Stili ekleyen yardımcı fonksiyon
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}