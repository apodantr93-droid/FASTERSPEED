import { useData } from '@/context/DataContext';
import { Check, Truck, Package, Clock, AlertTriangle, RotateCcw, MapPin } from 'lucide-react';

interface ShipmentTimelineProps {
  statusHistory: { status: string; statusName?: string; timestamp: string; note?: string; updatedBy?: string }[];
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Package className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  delivered: <Check className="w-4 h-4" />,
  rejected: <AlertTriangle className="w-4 h-4" />,
  postponed: <Clock className="w-4 h-4" />,
  returned: <RotateCcw className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  pending: 'bg-blue-500 border-blue-500',
  in_transit: 'bg-orange-500 border-orange-500',
  delivered: 'bg-green-500 border-green-500',
  rejected: 'bg-red-500 border-red-500',
  postponed: 'bg-yellow-500 border-yellow-500',
  returned: 'bg-purple-500 border-purple-500',
};

export default function ShipmentTimeline({ statusHistory }: ShipmentTimelineProps) {
  const { statuses } = useData();

  const sorted = [...statusHistory].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute right-[19px] top-0 bottom-0 w-0.5 bg-slate-700" />

      <div className="space-y-6">
        {sorted.map((step, index) => {
          const status = statuses.find(s => s.id === step.status);
          const name = step.statusName || status?.nameAr || step.status;
          const colorClass = statusColors[step.status] || 'bg-slate-500 border-slate-500';
          const isLast = index === sorted.length - 1;

          return (
            <div key={index} className="relative flex items-start gap-4">
              {/* Dot/Icon */}
              <div className={`relative z-10 w-10 h-10 rounded-full ${colorClass} bg-opacity-20 border-2 flex items-center justify-center flex-shrink-0 ${isLast ? 'ring-4 ring-offset-2 ring-offset-slate-800 ring-orange-500/30' : ''}`}>
                <span className={step.status === 'delivered' ? 'text-green-400' : step.status === 'rejected' ? 'text-red-400' : step.status === 'in_transit' ? 'text-orange-400' : 'text-blue-400'}>
                  {statusIcons[step.status] || <MapPin className="w-4 h-4" />}
                </span>
              </div>

              {/* Content */}
              <div className={`flex-1 pt-1 ${isLast ? '' : ''}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-semibold ${isLast ? 'text-orange-400' : 'text-white'}`}>
                    {name}
                  </span>
                  {isLast && (
                    <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                      الحالية
                    </span>
                  )}
                </div>
                {step.note && <p className="text-sm text-slate-400 mt-0.5">{step.note}</p>}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-slate-500">
                    {new Date(step.timestamp).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(step.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {step.updatedBy && <span className="text-xs text-slate-600">بواسطة: {step.updatedBy}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
