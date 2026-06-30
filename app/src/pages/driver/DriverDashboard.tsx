import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Package, CheckCircle, Clock, Plus, ScanLine, TrendingUp } from 'lucide-react';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { shipments } = useData();

  const myShipments = useMemo(() =>
    shipments.filter(s => s.driverId === currentUser?.id || s.senderId === currentUser?.id),
    [shipments, currentUser]
  );

  const stats = useMemo(() => {
    const total = myShipments.length;
    const completed = myShipments.filter(s => s.status === 'delivered').length;
    const inTransit = myShipments.filter(s => s.status === 'in_transit').length;
    const pending = myShipments.filter(s => s.status === 'pending').length;
    return { total, completed, inTransit, pending };
  }, [myShipments]);

  const recentShipments = useMemo(() =>
    [...myShipments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [myShipments]
  );

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">مرحباً، {currentUser?.name}</h2>
        <p className="text-sm text-slate-400 mt-1">نظرة عامة على شحناتك اليوم</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="شحنات اليوم" value={stats.total} icon={<Package className="w-6 h-6 text-blue-400" />} iconBg="bg-blue-500/10" />
        <StatCard title="المكتملة" value={stats.completed} icon={<CheckCircle className="w-6 h-6 text-green-400" />} iconBg="bg-green-500/10" />
        <StatCard title="المتبقية" value={stats.inTransit + stats.pending} icon={<Clock className="w-6 h-6 text-orange-400" />} iconBg="bg-orange-500/10" />
        <StatCard title="نسبة الإنجاز" value={`${completionRate}%`} icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} iconBg="bg-emerald-500/10" />
      </div>

      {/* Progress */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">تقدم العمل اليومي</span>
          <span className="text-sm text-orange-400">{stats.completed} / {stats.total}</span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/driver/new')}
          className="flex flex-col items-center gap-2 p-5 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Plus className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-white">شحنة جديدة</span>
        </button>
        <button
          onClick={() => navigate('/driver/scan')}
          className="flex flex-col items-center gap-2 p-5 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
            <ScanLine className="w-6 h-6 text-orange-400" />
          </div>
          <span className="text-sm font-medium text-white">مسح QR</span>
        </button>
      </div>

      {/* Recent Shipments */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">الشحنات الحديثة</h3>
          <button onClick={() => navigate('/driver/shipments')} className="text-xs text-blue-400 hover:text-blue-300">عرض الكل</button>
        </div>
        <div className="space-y-2">
          {recentShipments.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">{s.trackingNumber}</span>
                  <StatusBadge statusId={s.status} />
                </div>
                <p className="text-xs text-slate-400 truncate">{s.receiverName} — {s.governorate}</p>
              </div>
            </div>
          ))}
          {recentShipments.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-4">لا توجد شحنات مسندة</p>
          )}
        </div>
      </div>
    </div>
  );
}
