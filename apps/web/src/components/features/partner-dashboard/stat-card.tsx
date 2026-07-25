import { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
  changeText?: string;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  amber: 'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700',
  red: 'bg-red-50 text-red-700',
};

const changeColorClasses = {
  increase: 'text-green-600',
  decrease: 'text-red-600',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  changeText,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {change && changeType && (
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${changeColorClasses[changeType]}`}
              >
                {change}
              </span>
              {changeText && (
                <span className="ml-2 text-sm text-gray-500">{changeText}</span>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
