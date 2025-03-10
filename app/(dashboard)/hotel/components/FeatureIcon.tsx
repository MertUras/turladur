'use client';

import React from 'react';
import { 
  WifiIcon, 
  BeakerIcon, 
  CakeIcon, 
  SparklesIcon, 
  CameraIcon, 
  CheckBadgeIcon, 
  UserGroupIcon, 
  TvIcon, 
  HomeModernIcon, 
  SunIcon, 
  TagIcon, 
  BuildingOfficeIcon, 
  CloudIcon, 
  CheckIcon
} from '@heroicons/react/24/outline';

export interface FeatureIconProps {
  type: string;
  className?: string;
}

export default function FeatureIcon({ type, className = "w-3.5 h-3.5 text-blue-500" }: FeatureIconProps) {
  switch (type) {
    case 'wifi':
      return <WifiIcon className={className} />;
    case 'pool':
      return <BeakerIcon className={className} />;
    case 'breakfast':
      return <CakeIcon className={className} />;
    case 'spa':
      return <SparklesIcon className={className} />;
    case 'sea-view':
      return <CameraIcon className={className} />;
    case 'all-inclusive':
      return <CheckBadgeIcon className={className} />;
    case 'kids-friendly':
      return <UserGroupIcon className={className} />;
    case 'bar':
      return <BeakerIcon className={className} />;
    case 'tv':
      return <TvIcon className={className} />;
    case 'balcony':
      return <HomeModernIcon className={className} />;
    case 'climate':
      return <SunIcon className={className} />;
    case 'free':
      return <TagIcon className={className} />;
    case 'gym':
      return <BuildingOfficeIcon className={className} />;
    case 'marina':
      return <CloudIcon className={className} />;
    case 'aquapark':
      return <BeakerIcon className={className} />;
    case 'default':
    default:
      return <CheckIcon className={className} />;
  }
} 