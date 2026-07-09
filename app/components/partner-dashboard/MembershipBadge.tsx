'use client';

import { TrophyIcon } from '@heroicons/react/24/solid';

export type MembershipTier = 'BRONZE' | 'SILVER' | 'GOLD';

const TIER_STYLES: Record<MembershipTier, { label: string; className: string; iconClassName: string }> = {
  GOLD: {
    label: 'Gold',
    className: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300',
    iconClassName: 'text-amber-500',
  },
  SILVER: {
    label: 'Silver',
    className: 'bg-slate-100 text-slate-700 ring-1 ring-slate-300',
    iconClassName: 'text-slate-400',
  },
  BRONZE: {
    label: 'Bronze',
    className: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300',
    iconClassName: 'text-orange-500',
  },
};

interface MembershipBadgeProps {
  tier?: MembershipTier | null;
  className?: string;
  /**
   * 'default': dashboard'da isim yanında kullanılan hafif/pastel rozet.
   * 'onImage': tur/aktivite kartlarında görsel üzerine bindirilen, daha
   * belirgin (beyaz zeminli, gölgeli) varyant.
   */
  variant?: 'default' | 'onImage';
}

// Partnerin (tur operatörü / aktivite sağlayıcısı) müşteri değerlendirmelerinden
// otomatik hesaplanan üyelik seviyesini (arma) gösteren küçük rozet. Tier
// bilinmiyorsa (henüz yüklenmediyse) hiçbir şey render etmez, böylece mevcut
// tasarım bozulmaz.
export default function MembershipBadge({ tier, className = '', variant = 'default' }: MembershipBadgeProps) {
  if (!tier || !TIER_STYLES[tier]) return null;
  const style = TIER_STYLES[tier];

  const baseClassName =
    variant === 'onImage'
      ? `bg-white/95 text-neutral-800 shadow-sm ring-1 ring-black/5 backdrop-blur-sm`
      : style.className;

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-semibold leading-none ${baseClassName} ${className}`}
      title={`${style.label} Üyelik`}
    >
      <TrophyIcon className={`h-3 w-3 ${style.iconClassName}`} />
      {style.label}
    </span>
  );
}
