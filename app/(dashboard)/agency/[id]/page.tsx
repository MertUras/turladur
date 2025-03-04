import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyAgencies, dummyTours } from "@/app/lib/dummy-data";

interface AgencyPageProps {
  params: {
    id: string;
  };
}

export default function AgencyPage({ params }: AgencyPageProps) {
  // Acente verilerini al
  const agency = dummyAgencies.find((agency) => agency.id === params.id);
  
  // Acente bulunamazsa 404 sayfasına yönlendir
  if (!agency) {
    notFound();
  }
  
  // Acenteye ait turları al
  const agencyTours = dummyTours.filter((tour) => tour.agencyId === agency.id);
  
  // Acente resimlerini parse et
  const agencyImages = JSON.parse(agency.images as string) as string[];
  
  // Acente özelliklerini parse et
  const agencyFeatures = JSON.parse(agency.features as string) as string[];

  return (
    <div className="bg-white">
      {/* Üst Banner */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src={agencyImages[0]}
          alt={agency.name}
          fill
          priority
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center">
            <div className="inline-block mb-4">
              <div className="h-1 w-24 bg-white mb-1 mx-auto"></div>
              <div className="h-1 w-12 bg-white mx-auto"></div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{agency.name}</h1>
            <div className="flex items-center justify-center space-x-2 text-white mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>{agency.city}, {agency.country}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <span>{agency.rating} / 5 ({agency.reviewCount} değerlendirme)</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#tours" className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors">
                Turları Görüntüle
              </Link>
              <Link href="#contact" className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol Kolon - Acente Bilgileri */}
          <div className="lg:col-span-2">
            {/* Acente Açıklaması */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Acente Hakkında</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{agency.description}</p>
              
              {/* Acente Özellikleri */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Özellikler</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {agencyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-700 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Acente Resimleri */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fotoğraf Galerisi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agencyImages.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                    <Image
                      src={image}
                      alt={`${agency.name} - Resim ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Turlar */}
            <div id="tours" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Turlar</h2>
              <div className="space-y-6">
                {agencyTours.map((tour) => {
                  const tourImages = JSON.parse(tour.images as string) as string[];
                  const tourFeatures = JSON.parse(tour.features as string) as string[];
                  
                  return (
                    <div key={tour.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="relative h-64 md:h-auto">
                          <Image
                            src={tourImages[0]}
                            alt={tour.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="p-6 md:col-span-2">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{tour.name}</h3>
                              <p className="text-gray-600">{tour.location} • {tour.duration} • {tour.groupSize} kişilik gruplar</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-700">
                                {tour.discount && tour.discount > 0 ? (
                                  <>
                                    <span className="line-through text-gray-400 text-lg mr-2">{tour.price} ₺</span>
                                    {tour.price - (tour.price * (tour.discount || 0) / 100)} ₺
                                  </>
                                ) : (
                                  `${tour.price} ₺`
                                )}
                              </div>
                              <p className="text-gray-500 text-sm">kişi başı</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{tour.description}</p>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Tur Özellikleri</h4>
                            <div className="flex flex-wrap gap-2">
                              {tourFeatures.slice(0, 5).map((feature, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                                  {feature}
                                </span>
                              ))}
                              {tourFeatures.length > 5 && (
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                                  +{tourFeatures.length - 5} daha
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Link href={`/tour/${tour.id}`} className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors">
                              Detayları Görüntüle
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - İletişim ve Harita */}
          <div>
            {/* İletişim Bilgileri */}
            <div id="contact" className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h2>
              <ul className="space-y-4">
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-700 mr-3 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Adres</p>
                    <p className="text-gray-700">{agency.address}, {agency.city}, {agency.country}</p>
                  </div>
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-700 mr-3 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Telefon</p>
                    <p className="text-gray-700">{agency.phone}</p>
                  </div>
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-700 mr-3 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">E-posta</p>
                    <p className="text-gray-700">{agency.email}</p>
                  </div>
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-700 mr-3 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Web Sitesi</p>
                    <p className="text-gray-700">{agency.website}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Çalışma Saatleri */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Çalışma Saatleri</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-700">Pazartesi - Cuma</span>
                  <span className="font-medium text-gray-900">09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Cumartesi</span>
                  <span className="font-medium text-gray-900">10:00 - 16:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Pazar</span>
                  <span className="font-medium text-gray-900">Kapalı</span>
                </li>
              </ul>
            </div>

            {/* Harita */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Konum</h2>
              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Harita burada görüntülenecek</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700">
                  <span className="font-medium">Koordinatlar:</span> {agency.latitude}, {agency.longitude}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 