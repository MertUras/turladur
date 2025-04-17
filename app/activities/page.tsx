import { Metadata } from 'next';
import { dummyActivities } from '../lib/dummy-data';
import ActivityCard from '../components/ActivityCard';

export const metadata: Metadata = {
  title: 'Aktiviteler | TourTech - Türkiye\'nin Lider Turizm Teknolojileri Şirketi',
  description: 'Türkiye\'nin en iyi aktivitelerini keşfedin. Gastronomi, kültür turları, macera aktiviteleri ve daha fazlası.',
};

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Türkiye'nin En İyi <span className="text-blue-200">Aktiviteleri</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Unutulmaz deneyimler ve eşsiz aktiviteler için doğru adrestesiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 