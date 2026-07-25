'use client';

import { Trophy } from 'lucide-react';

import type { MembershipTier } from '@/lib/tours/legacy-tour';

const TIER_STYLES: Record<
  MembershipTier,
  { label: string; className: string; iconClassName: string }
> = {
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

export default function MembershipBadge({
  tier,
  className = '',
  variant = 'default',
}: {
  tier?: MembershipTier | null;
  className?: string;
  variant?: 'default' | 'onImage';
}) {
  if (!tier || !TIER_STYLES[tier]) return null;
  const style = TIER_STYLES[tier];
  const baseClassName =
    variant === 'onImage'
      ? 'bg-white/95 text-neutral-800 shadow-sm ring-1 ring-black/5 backdrop-blur-sm'
      : style.className;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none ${baseClassName} ${className}`}
      title={`${style.label} Üyelik`}
    >
      <Trophy className={`h-3 w-3 ${style.iconClassName}`} />
      {style.label}
    </span>
  );
}
