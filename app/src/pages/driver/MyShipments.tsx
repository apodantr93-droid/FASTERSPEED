import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import StatusBadge from '@/components/common/StatusBadge';
import ShipmentTimeline from '@/components/shipment/ShipmentTimeline';
import { Search, Package, Eye, ChevronUp } from 'lucide-react';

export default function DriverMyShipments() {
  const { currentUser } = useAuth();
  const { shipments, statuses, updateShipment } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const myShipments = useMemo(() => {
    return shipments
      .filter(s => {
        const isMine = s.driverId === currentUser?.id || s.senderId === currentUser?.id;
        const matchesSearch = !search || s.trackingNumber.toLowerCase().includes(search.toLowerCase()) || s.receiverName.includes(search);
        const matchesStatus = !statusFilter || s.status === statusFilter;
        return isMine && matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [shipments, currentUser, search, statusFilter]);

  const handleStatusUpdate = (shipmentId: string, newStatus: string) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;

    const statusName = statuses.find(s => s.id === newStatus)?.nameAr || newStatus;
    const newHistory = [
      ...shipment.statusHistory,
      {
        status: newStatus,
        statusName,
        timestamp: new Date().toISOString(),
        note: `تم تحديث الحالة إلى ${statusName}`,
        updatedBy: currentUser?.id || 'driver',
      },
    ];

    updateShipment(shipmentId, { status: newStatus, statusHistory: newHistory });
    setUpdatingId(null);
  };

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
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setUpdatingId(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                  تحديث
                </button>
                <button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
                  {expandedId === s.id ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === s.id && (
              <div className="px-4 pb-4 border-t border-slate-700/50 pt-4">
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">الراسل</p>
                    <p className="text-white">{s.senderName}</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">المستلم</p>
                    <p className="text-white">{s.receiverName}</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">الهاتف</p>
                    <p className="text-white">{s.receiverPhone}</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">السعر</p>
                    <p className="text-orange-400 font-semibold">{s.price} ج.م</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">سجل الحالة</h4>
                  <ShipmentTimeline statusHistory={s.statusHistory} />
                </div>
              </div>
            )}

            {/* Status Update */}
            {updatingId === s.id && (
              <div className="px-4 pb-4 border-t border-slate-700/50 pt-4">
                <p className="text-sm text-white mb-3">تحديث حالة الشحنة:</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(st => (
                    <button
                      key={st.id}
                      onClick={() => handleStatusUpdate(s.id, st.id)}
                      disabled={s.status === st.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        s.status === st.id
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-700 text-slate-300 hover:bg-blue-500/20 hover:text-blue-400'
                      }`}
                    >
                      {st.nameAr}
                    </button>
                  ))}
                </div>
                <button onClick={() => setUpdatingId(null)} className="mt-3 text-xs text-slate-500 hover:text-slate-300">إلغاء</button>
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
