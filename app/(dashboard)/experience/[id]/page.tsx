import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyExperiences, dummyProviders } from "@/app/lib/dummy-data";

interface ExperiencePageProps {
  params: {
    id: string;
  };
}

export default function ExperiencePage({ params }: ExperiencePageProps) {
  // Deneyim verilerini al
  const experience = dummyExperiences.find((exp) => exp.id === params.id);
  
  // Deneyim bulunamazsa 404 sayfasına yönlendir
  if (!experience) {
    notFound();
  }
  
  // Deneyim sağlayıcı bilgilerini al
  const provider = dummyProviders.find((provider) => provider.id === experience.providerId);
  
  // Deneyim resimlerini parse et
  const experienceImages = JSON.parse(experience.images as string) as string[];
  
  // Deneyim özelliklerini parse et
  const experienceFeatures = JSON.parse(experience.features as string) as string[];
  
  // Deneyim programını parse et
  const experienceSchedule = JSON.parse(experience.schedule as string) as Array<{
    time: string;
    activity: string;
    description: string;
  }>;

  return (
    <div className="bg-white">
      {/* Üst Banner */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src={experienceImages[0]}
          alt={experience.name}
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
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{experience.name}</h1>
            <div className="flex items-center justify-center space-x-2 text-white mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>{experience.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{experience.duration}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <span>Maks. {experience.groupSize} kişi</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#schedule" className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors">
                Program Detayları
              </Link>
              <Link href="#booking" className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Rezervasyon Yap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol Kolon - Deneyim Bilgileri */}
          <div className="lg:col-span-2">
            {/* Deneyim Açıklaması */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Deneyim Hakkında</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{experience.description}</p>
              
              {/* Deneyim Özellikleri */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Deneyim Özellikleri</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {experienceFeatures.map((feature, index) => (
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

            {/* Deneyim Resimleri */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fotoğraf Galerisi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {experienceImages.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                    <Image
                      src={image}
                      alt={`${experience.name} - Resim ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Deneyim Programı */}
            <div id="schedule" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Detayları</h2>
              <div className="space-y-6">
                {experienceSchedule.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900">{item.activity}</h3>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{item.time}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Rezervasyon ve Bilgiler */}
          <div>
            {/* Rezervasyon Kartı */}
            <div id="booking" className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rezervasyon</h2>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Fiyat</span>
                  <div className="text-right">
                    {experience.discount && experience.discount > 0 ? (
                      <>
                        <span className="line-through text-gray-400 text-sm mr-2">{experience.price} ₺</span>
                        <span className="text-2xl font-bold text-blue-700">{experience.price - (experience.price * (experience.discount || 0) / 100)} ₺</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-blue-700">{experience.price} ₺</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-500 text-sm text-right">kişi başı</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tarih Seçin</label>
                  <select id="date" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Tarih Seçin</option>
                    <option value="2023-07-15">15 Temmuz 2023</option>
                    <option value="2023-07-22">22 Temmuz 2023</option>
                    <option value="2023-07-29">29 Temmuz 2023</option>
                    <option value="2023-08-05">5 Ağustos 2023</option>
                    <option value="2023-08-12">12 Ağustos 2023</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Saat Seçin</label>
                  <select id="time" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Saat Seçin</option>
                    <option value="09:00">09:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">Kişi Sayısı</label>
                  <select id="people" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="1">1 Kişi</option>
                    <option value="2">2 Kişi</option>
                    <option value="3">3 Kişi</option>
                    <option value="4">4 Kişi</option>
                    <option value="5">5 Kişi</option>
                    <option value="6">6+ Kişi (Özel Teklif)</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full bg-blue-700 text-white py-3 rounded-md font-medium hover:bg-blue-800 transition-colors">
                Rezervasyon Yap
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">Ödeme şimdi yapılmayacak</p>
              </div>
            </div>

            {/* Deneyim Sağlayıcı Bilgileri */}
            {provider && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Deneyim Sağlayıcı</h2>
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={JSON.parse(provider.images as string)[0]}
                      alt={provider.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400 mr-1">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      <span>{provider.rating} / 5 ({provider.reviewCount} değerlendirme)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{provider.description.substring(0, 150)}...</p>
                <Link href={`/provider/${provider.id}`} className="text-blue-700 font-medium hover:text-blue-800 transition-colors flex items-center">
                  Sağlayıcı hakkında daha fazla bilgi
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Dahil Olanlar / Olmayanlar */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Dahil Olanlar / Olmayanlar</h2>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Dahil Olanlar</h3>
                <ul className="space-y-2">
                  {experience.included && JSON.parse(experience.included as string).map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600 mr-2 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dahil Olmayanlar</h3>
                <ul className="space-y-2">
                  {experience.excluded && JSON.parse(experience.excluded as string).map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600 mr-2 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
