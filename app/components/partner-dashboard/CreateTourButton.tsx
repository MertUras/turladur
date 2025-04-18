import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CreateTourButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function CreateTourButton({ className = '', variant = 'primary' }: CreateTourButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm';
  const primaryClasses = 'border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
  const secondaryClasses = 'border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400';
  
  const buttonClasses = `${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses} ${className}`;
  
  return (
    <Link
      href="/partner-dashboard/tours/create"
      className={buttonClasses}
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      Yeni Tur Oluştur
    </Link>
  );
} 