import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import StatCard from '@/components/common/StatCard';
import PieChart from '@/components/charts/PieChart';
import StatusBadge from '@/components/common/StatusBadge';
import { Package, CheckCircle, Clock, XCircle, Plus, Search, Calculator } from 'lucide-react';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { shipments, statuses } = useData();

  const myShipments = useMemo(() =>
    shipments.filter(s => s.senderId === currentUser?.id),
    [shipments, currentUser]
  );

  const stats = useMemo(() => {
    const total = myShipments.length;
    const delivered = myShipments.filter(s => s.status === 'delivered').length;
    const inTransit = myShipments.filter(s => s.status === 'in_transit').length;
    const rejected = myShipments.filter(s => s.status === 'rejected').length;
    return { total, delivered, inTransit, rejected };
  }, [myShipments]);

  const statusDist = useMemo(() => {
    const dist: Record<string, number> = {};
    myShipments.forEach(s => { dist[s.status] = (dist[s.status] || 0) + 1; });
    const labels = statuses.filter(s => dist[s.id]).map(s => s.nameAr);
    const data = statuses.filter(s => dist[s.id]).map(s => dist[s.id]);
    return { labels, data };
  }, [myShipments, statuses]);

  const recentShipments = useMemo(() =>
    [...myShipments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [myShipments]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">مرحباً، {currentUser?.name}</h2>
        <p className="text-sm text-slate-400 mt-1">نظرة عامة على شحنات متجرك</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الشحنات" value={stats.total} icon={<Package className="w-6 h-6 text-blue-400" />} iconBg="bg-blue-500/10" />
        <StatCard title="المكتملة" value={stats.delivered} icon={<CheckCircle className="w-6 h-6 text-green-400" />} iconBg="bg-green-500/10" />
        <StatCard title="قيد التوصيل" value={stats.inTransit} icon={<Clock className="w-6 h-6 text-orange-400" />} iconBg="bg-orange-500/10" />
        <StatCard title="المرفوضة" value={stats.rejected} icon={<XCircle className="w-6 h-6 text-red-400" />} iconBg="bg-red-500/10" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => navigate('/client/new')} className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all">
          <Plus className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-medium text-white">شحنة جديدة</span>
        </button>
        <button onClick={() => navigate('/client/track')} className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all">
          <Search className="w-5 h-5 text-orange-400" />
          <span className="text-xs font-medium text-white">تتبع شحنة</span>
        </button>
        <button onClick={() => navigate('/client/calculator')} className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-green-500/50 transition-all">
          <Calculator className="w-5 h-5 text-green-400" />
          <span className="text-xs font-medium text-white">حاسبة السعر</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Shipments */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">شحناتي الأخيرة</h3>
            <button onClick={() => navigate('/client/shipments')} className="text-xs text-blue-400 hover:text-blue-300">عرض الكل</button>
          </div>
          <div className="space-y-2">
            {recentShipments.map(s => (
              <div key={s.id} onClick={() => navigate('/client/track')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate font-mono">{s.trackingNumber}</span>
                    <StatusBadge statusId={s.status} />
                  </div>
                  <p className="text-xs text-slate-400 truncate">{s.receiverName} — {s.governorate}</p>
                </div>
              </div>
            ))}
            {recentShipments.length === 0 && <p className="text-center text-slate-500 text-sm py-4">لا توجد شحنات</p>}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">توزيع الحالات</h3>
          {statusDist.data.length > 0 ? (
            <PieChart labels={statusDist.labels} data={statusDist.data} height={220} />
          ) : (
            <p className="text-center text-slate-500 text-sm py-8">لا توجد بيانات</p>
          )}
        </div>
      </div>
    </div>
  );
}
