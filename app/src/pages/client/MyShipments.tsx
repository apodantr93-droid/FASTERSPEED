import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import StatusBadge from '@/components/common/StatusBadge';
import ShipmentTimeline from '@/components/shipment/ShipmentTimeline';
import { Search, Package, Eye, ChevronUp } from 'lucide-react';

export default function ClientMyShipments() {
  const { currentUser } = useAuth();
  const { shipments, statuses } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const myShipments = useMemo(() => {
    return shipments
      .filter(s => {
        const isMine = s.senderId === currentUser?.id;
        const matchesSearch = !search || s.trackingNumber.toLowerCase().includes(search.toLowerCase()) || s.receiverName.includes(search);
        const matchesStatus = !statusFilter || s.status === statusFilter;
        return isMine && matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [shipments, currentUser, search, statusFilter]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">شحناتي</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث برقم التتبع أو اسم المستلم..." className="w-full bg-slate-800 border border-slate-700 rounded-lg pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
          <option value="">كل الحالات</option>
          {statuses.map(s => <option key={s.id} value={s.id}>{s.nameAr}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {myShipments.map(s => (
          <div key={s.id} className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white font-mono">{s.trackingNumber}</span>
                  <StatusBadge statusId={s.status} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{s.receiverName} — {s.governorate} — {s.weight} كجم</p>
              </div>
              <button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
                {expandedId === s.id ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {expandedId === s.id && (
              <div className="px-4 pb-4 border-t border-slate-700/50 pt-4">
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">المستلم</p>
                    <p className="text-white">{s.receiverName}</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">الهاتف</p>
                    <p className="text-white">{s.receiverPhone}</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">العنوان</p>
                    <p className="text-white">{s.receiverAddress}</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">السعر</p>
                    <p className="text-orange-400 font-semibold">{s.price} ج.م</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">تتبع الشحنة</h4>
                  <ShipmentTimeline statusHistory={s.statusHistory} />
                </div>
              </div>
            )}
          </div>
        ))}

        {myShipments.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد شحنات</p>
          </div>
        )}
      </div>
    </div>
  );
}
