import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import StatusBadge from '@/components/common/StatusBadge';
import ExportButton from '@/components/common/ExportButton';
import { Calendar } from 'lucide-react';

export default function HistoryPage() {
  const { currentUser } = useAuth();
  const { shipments } = useData();
  const [monthFilter, setMonthFilter] = useState('');

  const myShipments = useMemo(() =>
    shipments
      .filter(s => s.senderId === currentUser?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [shipments, currentUser]
  );

  const months = useMemo(() => {
    const monthSet = new Set<string>();
    myShipments.forEach(s => {
      const d = new Date(s.createdAt);
      monthSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(monthSet).sort().reverse();
  }, [myShipments]);

  const filtered = useMemo(() => {
    if (!monthFilter) return myShipments;
    return myShipments.filter(s => s.createdAt.startsWith(monthFilter));
  }, [myShipments, monthFilter]);

  const totalCost = filtered.reduce((sum, s) => sum + (s.price || 0), 0);

  const exportColumns = [
    { header: 'رقم التتبع', key: 'trackingNumber' },
    { header: 'المستلم', key: 'receiverName' },
    { header: 'المحافظة', key: 'governorate' },
    { header: 'الوزن', key: 'weight' },
    { header: 'الحالة', key: 'status' },
    { header: 'السعر', key: 'price' },
    { header: 'التاريخ', key: 'createdAt' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">سجل الشحنات</h2>
        <ExportButton data={filtered} columns={exportColumns} filename="shipment-history" title="سجل الشحنات" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg pr-10 pl-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
            <option value="">كل الفترات</option>
            {months.map(m => {
              const [year, month] = m.split('-');
              const date = new Date(parseInt(year), parseInt(month) - 1);
              return <option key={m} value={m}>{date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</option>;
            })}
          </select>
        </div>
        <div className="bg-slate-800 rounded-lg px-4 py-2.5 border border-slate-700/50">
          <span className="text-sm text-slate-400">الإجمالي: </span>
          <span className="text-sm font-semibold text-orange-400">{totalCost.toLocaleString()} ج.م</span>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">رقم التتبع</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">المستلم</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">المحافظة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">الحالة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">السعر</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{s.trackingNumber}</td>
                  <td className="px-4 py-3 text-sm text-white">{s.receiverName}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{s.governorate}</td>
                  <td className="px-4 py-3"><StatusBadge statusId={s.status} /></td>
                  <td className="px-4 py-3 text-sm text-orange-400">{s.price} ج.م</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{new Date(s.createdAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                    لا توجد شحنات في السجل
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
