import Image from "next/image";
import Link from "next/link";
import { parseJsonString, formatCurrency } from "@/app/utils/format";

interface FeaturedSectionProps {
  title: string;
  description: string;
  items: any[];
  type: 'hotel' | 'tour' | 'experience';
  viewAllLink: string;
  bgColor?: string;
}

export default function FeaturedSection({ 
  title, 
  description, 
  items, 
  type, 
  viewAllLink,
  bgColor = "bg-gray-50"
}: FeaturedSectionProps) {
  // Renk ve stil ayarları
  const colorScheme = {
    hotel: {
      badge: "bg-white text-blue-600",
      button: "bg-blue-500 hover:bg-blue-600",
      tag: "bg-blue-50 text-blue-700",
    },
    tour: {
      badge: "bg-green-500 text-white",
      button: "bg-green-500 hover:bg-green-600",
      tag: "bg-green-50 text-green-700",
    },
    experience: {
      badge: "bg-purple-500 text-white",
      button: "bg-purple-500 hover:bg-purple-600",
      tag: "bg-purple-50 text-purple-700",
    }
  };

  return (
    <section className={`py-20 ${bgColor}`}>
      <div className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600 max-w-2xl">{description}</p>
          </div>
          <Link href={viewAllLink} className="text-blue-500 font-medium mt-4 md:mt-0 hover:text-blue-700 transition-colors">
            Tümünü Gör →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={parseJsonString<string[]>(item.images, [])[0]}
                  alt={item.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Tip bazında farklı badge'ler */}
                {type === 'hotel' && (
                  <div className={`absolute top-4 right-4 ${colorScheme[type].badge} px-3 py-1 rounded-full text-sm font-medium`}>
                    {item.stars} Yıldızlı
                  </div>
                )}
                
                {type === 'tour' && (
                  <>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>{item.duration} Gün</span>
                      </div>
                    </div>
                    <div className={`absolute top-4 right-4 ${colorScheme[type].badge} px-3 py-1 rounded-full text-sm font-medium`}>
                      {formatCurrency(item.price)}
                    </div>
                  </>
                )}
                
                {type === 'experience' && (
                  <>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>{item.duration} Saat</span>
                      </div>
                    </div>
                    <div className={`absolute top-4 right-4 ${colorScheme[type].badge} px-3 py-1 rounded-full text-sm font-medium`}>
                      {formatCurrency(item.price)}
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                
                {/* Tip bazında farklı alt bilgiler */}
                {type === 'hotel' && (
                  <div className="flex items-center mt-1 text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    {item.city}, {item.country}
                  </div>
                )}
                
                {type === 'tour' && (
                  <div className="flex items-center mt-1 text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                    </svg>
                    {parseJsonString<string[]>(item.destinations, []).slice(0, 2).join(", ")}
                  </div>
                )}
                
                {type === 'experience' && (
                  <div className="flex items-center mt-1 text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    {item.city}, {item.country}
                  </div>
                )}
                
                {/* Etiketler */}
                {type === 'hotel' && (
                  <div className="flex flex-wrap gap-2 my-3">
                    {parseJsonString<string[]>(item.amenities, []).slice(0, 3).map((amenity, index) => (
                      <span key={index} className={`${colorScheme[type].tag} text-xs px-2 py-1 rounded-full`}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
                
                {type === 'experience' && (
                  <div className="flex flex-wrap gap-2 my-3">
                    <span className={`${colorScheme[type].tag} text-xs px-2 py-1 rounded-full`}>
                      {item.category}
                    </span>
                  </div>
                )}
                
                <p className="text-gray-600 line-clamp-2 text-sm my-4">{item.description}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Link 
                    href={`/${type}/${item.id}`} 
                    className={`${colorScheme[type].button} text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center`}
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 