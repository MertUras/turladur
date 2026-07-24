'use client';

import Image from 'next/image';
import Link from 'next/link';

type BrandLogoProps = {
  variant?: 'wordmark' | 'mark';
  /** light = siyah logo (beyaz navbar); dark = beyaz logo (şeffaf navbar / hero) */
  surface?: 'light' | 'dark';
  /**
   * Navbar scroll: eski Turladur gibi — üstte beyaz, kaydırınca siyah (crossfade).
   */
  adaptive?: boolean;
  href?: string | null;
  className?: string;
  priority?: boolean;
};

const ASSETS = {
  wordmark: {
    light: '/brand/wordmark-on-light.png',
    dark: '/brand/wordmark-on-dark.png',
  },
  mark: {
    light: '/brand/mark-on-light.png',
    dark: '/brand/mark-on-dark.png',
  },
} as const;

const SIZES = {
  wordmark: { width: 108, height: 32, className: 'h-8 w-auto max-w-[128px]' },
  mark: { width: 32, height: 32, className: 'h-8 w-8' },
} as const;

function layerClass(active: boolean, imageClass: string, onHero: boolean) {
  return [
    imageClass,
    'absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out',
    active ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none',
    onHero ? 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/** turta wordmark — şeffaf PNG; adaptive = scroll renk geçişi (eski header). */
export default function BrandLogo({
  variant = 'wordmark',
  surface = 'light',
  adaptive = false,
  href = '/',
  className = '',
  priority = false,
}: BrandLogoProps) {
  const size = SIZES[variant];
  const imageClass = `${size.className} object-contain object-left ${className}`;
  const onHero = surface === 'dark';

  const content = adaptive ? (
    <span
      className="relative inline-block h-8 w-[108px] shrink-0"
      aria-hidden={false}
    >
      {/* Scroll: siyah (beyaz navbar) */}
      <Image
        src={ASSETS[variant].light}
        alt=""
        aria-hidden
        width={size.width}
        height={size.height}
        priority={priority}
        className={layerClass(surface === 'light', imageClass, false)}
      />
      {/* En üst: beyaz (şeffaf navbar / hero) — eski text-white Turladur */}
      <Image
        src={ASSETS[variant].dark}
        alt=""
        aria-hidden
        width={size.width}
        height={size.height}
        priority={priority}
        className={layerClass(surface === 'dark', imageClass, true)}
      />
      <span className="sr-only">turta</span>
    </span>
  ) : (
    <Image
      src={ASSETS[variant][surface]}
      alt="turta"
      width={size.width}
      height={size.height}
      priority={priority}
      className={`${imageClass}${onHero ? ' drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]' : ''}`}
    />
  );

  if (href === null) return content;

  return (
    <Link
      href={href}
      className="inline-flex items-center transition-transform duration-300 hover:scale-[1.02]"
      aria-label="turta ana sayfa"
    >
      {content}
    </Link>
  );
}
