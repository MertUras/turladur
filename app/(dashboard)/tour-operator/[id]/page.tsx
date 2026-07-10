import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { parseJsonString } from '@/app/utils/format';
import {
  getOperatorAvatarUrl,
  getOperatorDisplayName,
  getValidImageUrl,
} from '@/app/lib/operator';
import StarRating from '@/app/components/StarRating';
import MembershipBadge from '@/app/components/partner-dashboard/MembershipBadge';
import OperatorReviewsSection from './components/OperatorReviewsSection';
import {
  MapPinIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface TourOperatorPageProps {
  params: Promise<{ id: string }>;
}

async function getTourOperatorProfile(id: string) {
  const tourOperator = await prisma.tourOperator.findUnique({
    where: { id },
    select: {
      id: true,
      companyName: true,
      email: true,
      phone: true,
      logo: true,
      description: true,
      address: true,
      city: true,
      country: true,
      website: true,
      rating: true,
      reviewCount: true,
      membershipTier: true,
      certified: true,
      license: true,
      _count: {
        select: { tours: true },
      },
    },
  });

  if (!tourOperator) return null;

  const [tours, reviews] = await Promise.all([
    prisma.tour.findMany({
      where: { tourOperatorId: id },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        discount: true,
        destinations: true,
        images: true,
        maxParticipants: true,
        inclusions: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.partnerReview.findMany({
      where: { tourOperatorId: id },
      select: {
        id: true,
        rating: true,
        comment: true,
        responseText: true,
        respondedAt: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        booking: {
          select: {
            tour: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { tourOperator, tours, reviews };
}

function parseDestinations(destinations: unknown): string[] {
  const raw = parseJsonString<any[]>(destinations as string, []);
  return raw
    .map((dest) => {
      if (typeof dest === 'string') return dest;
      if (typeof dest === 'object' && dest?.city) return dest.city;
      return '';
    })
    .filter(Boolean);
}

export default async function TourOperatorPage({ params }: TourOperatorPageProps) {
  const { id } = await params;
  const data = await getTourOperatorProfile(id);

  if (!data) {
    notFound();
  }

  const { tourOperator, tours, reviews } = data;
  const displayName = getOperatorDisplayName(tourOperator.companyName, tourOperator.email);
  const avatarUrl = getOperatorAvatarUrl(displayName, tourOperator.logo);
  const heroImage = getValidImageUrl(tourOperator.logo, avatarUrl);
  const rating = tourOperator.rating ?? 0;
  const reviewCount = tourOperator.reviewCount ?? 0;
  const location = [tourOperator.city, tourOperator.country].filter(Boolean).join(', ');

  const contactItems = [
    tourOperator.address || tourOperator.city || tourOperator.country
      ? {
          label: 'Adres',
          value: [tourOperator.address, tourOperator.city, tourOperator.country].filter(Boolean).join(', '),
          icon: MapPinIcon,
        }
      : null,
    tourOperator.phone
      ? { label: 'Telefon', value: tourOperator.phone, icon: PhoneIcon, href: `tel:${tourOperator.phone}` }
      : null,
    tourOperator.email
      ? { label: 'E-posta', value: tourOperator.email, icon: EnvelopeIcon, href: `mailto:${tourOperator.email}` }
      : null,
    tourOperator.website
      ? { label: 'Web Sitesi', value: tourOperator.website, icon: GlobeAltIcon, href: tourOperator.website }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    icon: typeof MapPinIcon;
    href?: string;
  }>;

  return (
    <main className="bg-neutral-50 text-neutral-800">
      <section className="relative h-[45vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
        <Image
          src={heroImage}
          alt={displayName}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          className="brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              {tourOperator.membershipTier && (
                <MembershipBadge tier={tourOperator.membershipTier} variant="onImage" className="text-sm px-2.5 py-1" />
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {displayName}
            </h1>

            <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 text-neutral-200 mb-10 text-sm">
              {location && (
                <div className="flex items-center bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  <MapPinIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" />
                  <span>{location}</span>
                </div>
              )}
              {reviewCount > 0 && (
                <div className="flex items-center bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  <StarRating rating={rating} size="sm" className="mr-1.5" />
                  <span>
                    {rating.toFixed(1)}/5 ({reviewCount} değerlendirme)
                  </span>
                </div>
              )}
              <div className="flex items-center bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg">
                <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" />
                <span>{tours.length} Aktif Tur</span>
              </div>
              {tourOperator.certified && (
                <div className="flex items-center bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  <ShieldCheckIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" />
                  <span>Onaylı Operatör</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Link
                href="#tours"
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center text-sm"
              >
                <span>Turları Görüntüle</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              {contactItems.length > 0 && (
                <Link
                  href="#contact"
                  className="px-6 py-3 bg-white hover:bg-neutral-100 text-sky-600 font-medium rounded-lg transition-colors shadow-sm border border-neutral-200 inline-flex items-center text-sm"
                >
                  <span>İletişime Geç</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Tur Operatörü Hakkında</h2>
              <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
                <p>
                  {tourOperator.description ||
                    'Bu tur operatörü hakkında henüz detaylı bilgi bulunmamaktadır.'}
                </p>
              </div>

              {(tourOperator.certified || tourOperator.license) && (
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                    <CheckCircleIcon className="w-6 h-6 text-sky-600 mr-2" />
                    <span>Güvenilirlik</span>
                  </h3>
                  <ul className="space-y-2">
                    {tourOperator.certified && (
                      <li className="flex items-center text-neutral-700">
                        <ShieldCheckIcon className="w-5 h-5 text-sky-600 mr-2" />
                        Turladur onaylı operatör
                      </li>
                    )}
                    {tourOperator.license && (
                      <li className="flex items-center text-neutral-700">
                        <BuildingOfficeIcon className="w-5 h-5 text-sky-600 mr-2" />
                        Lisans: {tourOperator.license}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div id="tours" className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50 scroll-mt-24">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">Turlar</h2>

              {tours.length > 0 ? (
                <div className="space-y-8">
                  {tours.map((tour) => {
                    const tourImages = parseJsonString<string[]>(tour.images, []);
                    const destinations = parseDestinations(tour.destinations);
                    const inclusions = parseJsonString<string[]>(tour.inclusions, []);
                    const discountedPrice =
                      tour.discount && tour.discount > 0
                        ? tour.price - (tour.price * tour.discount) / 100
                        : tour.price;

                    return (
                      <div
                        key={tour.id}
                        className="bg-white rounded-xl overflow-hidden shadow-md border border-neutral-200/50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="relative h-72 md:h-auto overflow-hidden">
                            <Image
                              src={getValidImageUrl(tourImages[0])}
                              alt={tour.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: 'cover' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex flex-wrap gap-2">
                                {destinations.slice(0, 3).map((destination, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs font-medium border border-neutral-200/80"
                                  >
                                    {destination}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="p-6 md:col-span-2 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                                <div className="flex-grow">
                                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{tour.name}</h3>
                                  <div className="flex flex-wrap items-center text-sm text-neutral-600 gap-x-4 gap-y-1 mb-3">
                                    <div className="flex items-center">
                                      <CalendarDaysIcon className="w-4 h-4 mr-1 text-sky-600" />
                                      <span>{tour.duration} gün</span>
                                    </div>
                                    {tour.maxParticipants && (
                                      <div className="flex items-center">
                                        <UserGroupIcon className="w-4 h-4 mr-1 text-sky-600" />
                                        <span>Maks. {tour.maxParticipants} kişi</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0 md:pt-1">
                                  {tour.discount && tour.discount > 0 ? (
                                    <>
                                      <div className="flex items-center justify-end gap-2 mb-0.5">
                                        <span className="line-through text-neutral-400 text-base">
                                          {tour.price.toLocaleString('tr-TR')} ₺
                                        </span>
                                        <span className="bg-red-50 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-100">
                                          %{tour.discount}
                                        </span>
                                      </div>
                                      <span className="text-2xl font-bold text-sky-600">
                                        {discountedPrice.toLocaleString('tr-TR')} ₺
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-2xl font-bold text-sky-600">
                                      {tour.price.toLocaleString('tr-TR')} ₺
                                    </span>
                                  )}
                                  <p className="text-neutral-500 text-xs">kişi başı</p>
                                </div>
                              </div>

                              {tour.description && (
                                <p className="text-neutral-700 mb-5 line-clamp-3">{tour.description}</p>
                              )}

                              {inclusions.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-semibold text-neutral-900 mb-3">Tur Özellikleri</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {inclusions.slice(0, 5).map((feature, index) => (
                                      <span
                                        key={index}
                                        className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs flex items-center border border-neutral-200"
                                      >
                                        <CheckCircleIcon className="w-3 h-3 mr-1.5 text-green-600" />
                                        {feature}
                                      </span>
                                    ))}
                                    {inclusions.length > 5 && (
                                      <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-medium border border-sky-200">
                                        +{inclusions.length - 5} daha
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end mt-auto pt-4 border-t border-neutral-100">
                              <Link
                                href={`/tour/${tour.id}`}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center text-sm"
                              >
                                <span>Detayları Gör</span>
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-neutral-100 text-neutral-600 p-6 rounded-xl border border-neutral-200/80">
                  <p className="font-medium text-center">Bu tur operatörüne ait aktif tur bulunmamaktadır.</p>
                </div>
              )}
            </div>

            {reviews.length > 0 && (
              <OperatorReviewsSection
                reviews={reviews.map((review) => ({
                  id: review.id,
                  rating: review.rating,
                  comment: review.comment,
                  createdAt: review.createdAt.toISOString(),
                  responseText: review.responseText,
                  respondedAt: review.respondedAt?.toISOString() ?? null,
                  user: review.user,
                  booking: review.booking,
                }))}
                rating={rating}
                reviewCount={reviewCount}
              />
            )}
          </div>

          <div className="space-y-8">
            {contactItems.length > 0 && (
              <div id="contact" className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50 scroll-mt-24">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">İletişim Bilgileri</h2>
                <ul className="space-y-4">
                  {contactItems.map((item) => (
                    <li
                      key={item.label}
                      className="flex pt-4 border-t border-neutral-100 first:border-t-0 first:pt-0"
                    >
                      <div className="flex-shrink-0 p-2 bg-sky-100 rounded-lg mr-4 text-sky-700">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 mb-0.5">{item.label}</p>
                        {item.href ? (
                          <Link
                            href={item.href}
                            target={item.label === 'Web Sitesi' ? '_blank' : undefined}
                            className="text-neutral-600 text-sm hover:text-sky-600 transition-colors"
                          >
                            {item.value}
                          </Link>
                        ) : (
                          <p className="text-neutral-600 text-sm">{item.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Özet</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Üyelik Seviyesi</span>
                  <MembershipBadge tier={tourOperator.membershipTier} />
                </li>
                <li className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Aktif Tur</span>
                  <span className="font-semibold text-neutral-900">{tours.length}</span>
                </li>
                {reviewCount > 0 && (
                  <li className="flex justify-between items-center py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Ortalama Puan</span>
                    <span className="font-semibold text-neutral-900">{rating.toFixed(1)}/5</span>
                  </li>
                )}
                {reviewCount > 0 && (
                  <li className="flex justify-between items-center py-2">
                    <span className="text-neutral-600">Değerlendirme</span>
                    <span className="font-semibold text-neutral-900">{reviewCount}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-2xl p-8 shadow-md">
              <h3 className="text-xl font-bold text-white mb-3">Yardıma mı ihtiyacınız var?</h3>
              <p className="text-sky-100 mb-6 text-sm">
                Bu operatörün turları hakkında sorularınız için iletişim bilgilerini kullanabilirsiniz.
              </p>
              {contactItems.length > 0 ? (
                <Link
                  href="#contact"
                  className="px-6 py-3 bg-white hover:bg-neutral-100 text-sky-700 font-semibold rounded-lg transition-colors shadow-sm inline-flex items-center text-sm"
                >
                  <span>İletişim Bilgileri</span>
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white hover:bg-neutral-100 text-sky-700 font-semibold rounded-lg transition-colors shadow-sm inline-flex items-center text-sm"
                >
                  <span>Bize Ulaşın</span>
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
