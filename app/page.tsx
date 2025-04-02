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

export default async function Home() {
  return (
    <main>
      <Hero />
      <HotDeals />
      <Destinations />
      <Stats />
      <FeaturedHotels />
      <Testimonials />
      <Newsletter />
      <Partners />
      <CTA />
      <MobileOfferPopup />
    </main>
  );
}
