import Link from 'next/link';
import { ElementType } from 'react';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: ElementType;
  href: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'yellow' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  green: 'bg-green-50 text-green-700 hover:bg-green-100',
  amber: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
  purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
  red: 'bg-red-50 text-red-700 hover:bg-red-100',
};

export default function QuickAccessCard({ title, description, icon: Icon, href, color }: QuickAccessCardProps) {
  return (
    <Link href={href} className="block">
      <div className={`p-6 rounded-xl ${colorClasses[color]} transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm opacity-90">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 