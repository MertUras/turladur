import { Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedHotels from './components/FeaturedHotels';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import Partners from './components/Partners';
import CTA from './components/CTA';
import Footer from './components/Footer';
import HotDeals from './components/HotDeals';
import Newsletter from './components/Newsletter';
import MobileOfferPopup from './components/MobileOfferPopup';
import Destinations from './components/Destinations';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default async function Home() {
  return (
    <main>
      <Header />
      <Suspense fallback={null}>
        <Hero />
      </Suspense>
      <Destinations />
      <CTA />
      <HotDeals />
      {/* Popüler Turlar */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">
              Popüler Turlar
            </h2>
            <Link
              href="/tours"
              className="text-neutral-950 hover:text-neutral-700 font-medium text-sm flex items-center group"
            >
              Tümünü Gör
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      <Stats />
      {/*<FeaturedHotels />*/}
      <Testimonials />
      <Newsletter />
      {/*<Partners />*/}
      <MobileOfferPopup />
      <Footer />
    </main>
  );
}
