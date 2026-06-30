import { useData } from '@/context/DataContext';

interface StatusBadgeProps {
  statusId: string;
  className?: string;
}

const defaultColors: Record<string, string> = {
  pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_transit: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  postponed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  returned: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const defaultNames: Record<string, string> = {
  pending: 'مستلمة',
  in_transit: 'جار التوصيل',
  delivered: 'مكتملة',
  rejected: 'مرفوضة',
  postponed: 'مؤجلة',
  returned: 'مرتجعة',
};

export default function StatusBadge({ statusId, className = '' }: StatusBadgeProps) {
  const { statuses } = useData();
  const status = statuses.find(s => s.id === statusId);

  const colorClass = defaultColors[statusId] || `bg-slate-500/20 text-slate-400 border-slate-500/30`;
  const name = status?.nameAr || defaultNames[statusId] || statusId;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colorClass} ${className}`}>
      {name}
    </span>
  );
}
