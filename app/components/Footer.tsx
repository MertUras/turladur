'use client';

import Link from 'next/link';
import BrandLogo from './BrandLogo';

interface FooterProps {
  className?: string;
}

// Simplified social links data
const socialLinks = [
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        fill="currentColor"
      >
        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
      </svg>
    ),
  },
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    icon: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
      >
        <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
      </svg>
    ),
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        fill="currentColor"
      >
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
      </svg>
    ),
  },
];

// Simplified link sections
const footerLinks = [
  {
    title: 'Keşfet',
    links: [
      { label: 'Turlar', href: '/tours' },
      { label: 'Rotalar', href: '/routes' },
      { label: 'Aktiviteler', href: '/activities' },
      { label: 'Konaklama', href: '/hotel' }, // Assuming a hotel page exists
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Şirket',
    links: [
      { label: 'Hakkımızda', href: '/about' },
      { label: 'Kariyer', href: '/careers' },
      { label: 'Basın', href: '/press' },
      { label: 'İletişim', href: '/contact' },
    ],
  },
  {
    title: 'Destek',
    links: [
      { label: 'S.S.S.', href: '/faq' },
      { label: 'Gizlilik Politikası', href: '/privacy' },
      { label: 'Kullanım Şartları', href: '/terms' },
      { label: 'Çerez Politikası', href: '/cookie-policy' },
    ],
  },
];

// Legal links for the bottom row
const legalLinks = [
  { label: 'Kullanım Şartları', href: '/terms' },
  { label: 'Gizlilik Politikası', href: '/privacy' },
  { label: 'Çerez Politikası', href: '/cookie-policy' },
  { label: 'Erişilebilirlik', href: '/accessibility' },
];

export default function Footer({ className = '' }: FooterProps) {
  // Mobile accordion state is removed
  const currentYear = new Date().getFullYear();

  return (
    // Changed background to black, adjusted padding
    <footer
      className={`bg-neutral-900 text-neutral-400 pt-16 pb-8 ${className}`}
    >
      <div className="container mx-auto px-6">
        {/* Top section: Logo, description, links, social */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* Logo, description, and social links */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <Link href="/" className="flex items-center group">
                <BrandLogo variant="wordmark" surface="dark" href={null} />
              </Link>
            </div>
            <p className="text-sm mb-7 leading-relaxed text-neutral-300">
              Keşfet. Deneyimle. Hatırla.
            </p>
            <p className="text-sm mb-7 leading-relaxed text-neutral-400">
              Türkiye&apos;nin turizm ekosistemini tek platformda
              buluşturuyoruz.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections - 3 columns, no mobile accordion */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-sm text-white mb-4 tracking-wide">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile accordion is removed */}
        </div>

        {/* Middle subscription section is removed */}

        {/* Bottom section - Copyright and legal links */}
        <div className="border-t border-neutral-800 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-neutral-500 text-xs mb-4 sm:mb-0">
              © {currentYear} turta. Tüm hakları saklıdır.
            </div>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
