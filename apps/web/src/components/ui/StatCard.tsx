import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  className?: string;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'blue', className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={cn('mt-1 text-sm', trend.positive ? 'text-green-600' : 'text-red-600')}>
              {trend.positive ? '+' : '-'}{Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', colorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
