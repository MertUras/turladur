import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { dummyActivities } from '../../../lib/dummy-data';

interface ActivityPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const activity = dummyActivities.find(a => a.id === params.id);

  return {
    title: `${activity?.name} | TourTech`,
    description: activity?.description,
  };
}

export default function ActivityPage({ params }: ActivityPageProps) {
  const activity = dummyActivities.find(a => a.id === params.id);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Aktivite Bulunamadı</h1>
          <p className="text-gray-600 mb-8">Aradığınız aktivite bulunamadı veya kaldırılmış olabilir.</p>
          <Link
            href="/activities"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Aktiviteleri Keşfet
          </Link>
        </div>
      </div>
    );
  }

  const images = JSON.parse(activity.images as string);
  const inclusions = JSON.parse(activity.inclusions as string);
  const exclusions = JSON.parse(activity.exclusions as string);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-blue-500 bg-opacity-20 px-4 py-2 rounded-full mb-6">
              <span className="text-blue-100 text-sm font-medium">{activity.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {activity.name}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {activity.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-blue-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{activity.duration} saat</span>
              </div>
              <div className="flex items-center text-blue-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center text-blue-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Maksimum {activity.maxParticipants} kişi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {images.map((image: string, index: number) => (
                  <div key={index} className="relative h-64 rounded-xl overflow-hidden group">
                    <Image
                      src={image}
                      alt={`${activity.name} - Fotoğraf ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivite Hakkında</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">{activity.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Dahil Olanlar
                    </h3>
                    <ul className="space-y-3">
                      {inclusions.map((item: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Dahil Olmayanlar
                    </h3>
                    <ul className="space-y-3">
                      {exclusions.map((item: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Konum</h2>
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${activity.latitude},${activity.longitude}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">{activity.location}</p>
                  <p className="text-gray-600">{activity.city}, {activity.country}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">₺{activity.price}</span>
                    {activity.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through ml-2">₺{activity.price + activity.discount}</span>
                    )}
                  </div>
                  {activity.discount > 0 && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      %{activity.discount} İndirim
                    </span>
                  )}
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <svg className="w-6 h-6 text-gray-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Konum</p>
                      <p className="text-gray-900 font-medium">{activity.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <svg className="w-6 h-6 text-gray-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Süre</p>
                      <p className="text-gray-900 font-medium">{activity.duration} saat</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <svg className="w-6 h-6 text-gray-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Maksimum Katılımcı</p>
                      <p className="text-gray-900 font-medium">{activity.maxParticipants} kişi</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg">
                  Rezervasyon Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 