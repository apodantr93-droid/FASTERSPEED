import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import StatCard from '@/components/common/StatCard';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import BarChart from '@/components/charts/BarChart';
import StatusBadge from '@/components/common/StatusBadge';
import { Package, CheckCircle, Clock, DollarSign, TrendingUp, Users, Truck, Store } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { shipments, drivers, clients, statuses } = useData();

  const stats = useMemo(() => {
    const total = shipments.length;
    const delivered = shipments.filter(s => s.status === 'delivered').length;
    const pending = shipments.filter(s => s.status === 'pending').length;
    const inTransit = shipments.filter(s => s.status === 'in_transit').length;
    const rejected = shipments.filter(s => s.status === 'rejected').length;
    const postponed = shipments.filter(s => s.status === 'postponed').length;
    const totalRevenue = shipments.reduce((sum, s) => sum + (s.price || 0), 0);

    return { total, delivered, pending, inTransit, rejected, postponed, totalRevenue };
  }, [shipments]);

  // Daily stats for line chart (last 7 days)
  const last7Days = useMemo(() => {
    const days: string[] = [];
    const deliveredData: number[] = [];
    const pendingData: number[] = [];
    const transitData: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' });
      days.push(dayName);

      const dayShipments = shipments.filter(s => s.createdAt.startsWith(dateStr));
      deliveredData.push(dayShipments.filter(s => s.status === 'delivered').length);
      pendingData.push(dayShipments.filter(s => s.status === 'pending').length);
      transitData.push(dayShipments.filter(s => s.status === 'in_transit').length);
    }

    return { days, deliveredData, pendingData, transitData };
  }, [shipments]);

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    shipments.forEach(s => {
      distribution[s.status] = (distribution[s.status] || 0) + 1;
    });
    const labels = statuses.filter(s => distribution[s.id]).map(s => s.nameAr);
    const data = statuses.filter(s => distribution[s.id]).map(s => distribution[s.id]);
    return { labels, data };
  }, [shipments, statuses]);

  // Driver performance for bar chart
  const driverPerformance = useMemo(() => {
    const labels = drivers.filter(d => d.isActive).map(d => d.name.split(' ')[0]);
    const completed = drivers.filter(d => d.isActive).map(d => d.completedCount);
    const assigned = drivers.filter(d => d.isActive).map(d => d.shipmentsCount);
    return { labels, completed, assigned };
  }, [drivers]);

  const recentShipments = useMemo(() =>
    [...shipments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    [shipments]
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
        <span className="text-sm text-slate-400">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الشحنات"
          value={stats.total}
          icon={<Package className="w-6 h-6 text-blue-400" />}
          iconBg="bg-blue-500/10"
          trend={12}
        />
        <StatCard
          title="الشحنات المكتملة"
          value={stats.delivered}
          icon={<CheckCircle className="w-6 h-6 text-green-400" />}
          iconBg="bg-green-500/10"
          trend={8}
        />
        <StatCard
          title="قيد التوصيل"
          value={stats.inTransit}
          icon={<Clock className="w-6 h-6 text-orange-400" />}
          iconBg="bg-orange-500/10"
          subtitle={`${stats.pending} مستلمة | ${stats.rejected} مرفوضة | ${stats.postponed} مؤجلة`}
        />
        <StatCard
          title="الإيرادات"
          value={`${stats.totalRevenue.toLocaleString()} ج.م`}
          icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
          iconBg="bg-emerald-500/10"
          trend={15}
        />
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{drivers.filter(d => d.isActive).length}</p>
            <p className="text-xs text-slate-400">مناديب نشطون</p>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{clients.filter(c => c.isActive).length}</p>
            <p className="text-xs text-slate-400">عملاء نشطون</p>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{Math.round((stats.delivered / (stats.total || 1)) * 100)}%</p>
            <p className="text-xs text-slate-400">نسبة النجاح</p>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{stats.inTransit + stats.pending}</p>
            <p className="text-xs text-slate-400">شحنات نشطة</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">أداء الشحنات (آخر 7 أيام)</h3>
          <LineChart
            labels={last7Days.days}
            datasets={[
              { label: 'مكتملة', data: last7Days.deliveredData, color: '#22C55E' },
              { label: 'مستلمة', data: last7Days.pendingData, color: '#3B82F6' },
              { label: 'جار التوصيل', data: last7Days.transitData, color: '#F97316' },
            ]}
            height={280}
          />
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">توزيع الحالات</h3>
          <PieChart
            labels={statusDistribution.labels}
            data={statusDistribution.data}
            height={260}
          />
        </div>
      </div>

      {/* Charts Row 2 + Recent Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">أداء المناديب</h3>
          <BarChart
            labels={driverPerformance.labels}
            datasets={[
              { label: 'مكتملة', data: driverPerformance.completed, color: '#22C55E' },
              { label: 'مسندة', data: driverPerformance.assigned, color: '#3B82F6' },
            ]}
            height={250}
          />
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">أحدث الشحنات</h3>
            <button
              onClick={() => navigate('/admin/shipments')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              عرض الكل
            </button>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {recentShipments.map(s => (
              <div
                key={s.id}
                onClick={() => navigate('/admin/shipments')}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
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
                <span className="text-xs text-slate-500 flex-shrink-0">
                  {new Date(s.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
