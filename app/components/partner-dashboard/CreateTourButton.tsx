import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CreateTourButtonProps {
  className?: string;
}

export default function CreateTourButton({ className = '' }: CreateTourButtonProps) {
  return (
    <Link
      href="/partner-dashboard/tours/create"
      className={`inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    >
      <PlusIcon className="h-5 w-5 mr-2" />
      Yeni Tur Oluştur
    </Link>
  );
} 