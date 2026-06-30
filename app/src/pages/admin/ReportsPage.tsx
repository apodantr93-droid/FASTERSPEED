import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import ExportButton from '@/components/common/ExportButton';
import { Package, DollarSign, Users, Truck } from 'lucide-react';

type ReportType = 'shipments' | 'drivers' | 'clients' | 'revenue';
type PeriodType = 'week' | 'month' | 'quarter' | 'year';

export default function ReportsPage() {
  const { shipments, drivers, clients, statuses } = useData();
  const [reportType, setReportType] = useState<ReportType>('shipments');
  const [period, setPeriod] = useState<PeriodType>('month');

  const filteredShipments = useMemo(() => {
    const now = new Date();
    const periods: Record<PeriodType, number> = { week: 7, month: 30, quarter: 90, year: 365 };
    const days = periods[period];
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return shipments.filter(s => new Date(s.createdAt) >= cutoff);
  }, [shipments, period]);

  const stats = useMemo(() => {
    const total = filteredShipments.length;
    const delivered = filteredShipments.filter(s => s.status === 'delivered').length;
    const revenue = filteredShipments.reduce((sum, s) => sum + (s.price || 0), 0);
    const activeDrivers = drivers.filter(d => d.isActive).length;
    const activeClients = clients.filter(c => c.isActive).length;
    return { total, delivered, revenue, activeDrivers, activeClients };
  }, [filteredShipments, drivers, clients]);

  // Daily chart data
  const dailyData = useMemo(() => {
    const days: string[] = [];
    const counts: number[] = [];
    const now = new Date();
    const dayCount = period === 'week' ? 7 : period === 'month' ? 15 : 12;

    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date(now);
      if (period === 'year') {
        d.setMonth(d.getMonth() - i);
        days.push(d.toLocaleDateString('ar-EG', { month: 'short' }));
        const monthStr = d.toISOString().slice(0, 7);
        counts.push(filteredShipments.filter(s => s.createdAt.startsWith(monthStr)).length);
      } else {
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        days.push(d.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric' }));
        counts.push(filteredShipments.filter(s => s.createdAt.startsWith(dateStr)).length);
      }
    }
    return { days, counts };
  }, [filteredShipments, period]);

  // Status distribution
  const statusDist = useMemo(() => {
    const dist: Record<string, number> = {};
    filteredShipments.forEach(s => { dist[s.status] = (dist[s.status] || 0) + 1; });
    const labels = statuses.filter(s => dist[s.id]).map(s => s.nameAr);
    const data = statuses.filter(s => dist[s.id]).map(s => dist[s.id]);
    return { labels, data };
  }, [filteredShipments, statuses]);

  // Driver report data
  const driverReportData = useMemo(() => {
    return drivers.filter(d => d.isActive).map(d => ({
      name: d.name,
      shipmentsCount: d.shipmentsCount,
      completedCount: d.completedCount,
      rate: d.shipmentsCount > 0 ? Math.round((d.completedCount / d.shipmentsCount) * 100) : 0,
    })).sort((a, b) => b.completedCount - a.completedCount);
  }, [drivers]);

  // Client report data
  const clientReportData = useMemo(() => {
    return clients.filter(c => c.isActive).map(c => ({
      name: c.name,
      storeName: c.storeName || '-',
      shipmentsCount: c.shipmentsCount,
    })).sort((a, b) => b.shipmentsCount - a.shipmentsCount);
  }, [clients]);

  const exportColumns = [
    { header: 'رقم التتبع', key: 'trackingNumber' },
    { header: 'الراسل', key: 'senderName' },
    { header: 'المستلم', key: 'receiverName' },
    { header: 'الحالة', key: 'status' },
    { header: 'المحافظة', key: 'governorate' },
    { header: 'السعر', key: 'price' },
    { header: 'التاريخ', key: 'createdAt' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">التقارير والتحليلات</h2>
        <div className="flex items-center gap-2">
          <ExportButton data={filteredShipments} columns={exportColumns} filename="report" title="تقرير الشحنات" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
          {([
            { type: 'shipments' as ReportType, label: 'الشحنات', icon: Package },
            { type: 'drivers' as ReportType, label: 'المناديب', icon: Truck },
            { type: 'clients' as ReportType, label: 'العملاء', icon: Users },
            { type: 'revenue' as ReportType, label: 'الإيرادات', icon: DollarSign },
          ]).map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                reportType === type ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
          {([
            { type: 'week' as PeriodType, label: 'أسبوع' },
            { type: 'month' as PeriodType, label: 'شهر' },
            { type: 'quarter' as PeriodType, label: 'ربع سنة' },
            { type: 'year' as PeriodType, label: 'سنة' },
          ]).map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setPeriod(type)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                period === type ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-1">إجمالي الشحنات</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
          <p className="text-xs text-slate-400 mt-1">المكتملة</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 text-center">
          <p className="text-2xl font-bold text-orange-400">{stats.revenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">الإيرادات (ج.م)</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.activeDrivers}</p>
          <p className="text-xs text-slate-400 mt-1">المناديب</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.activeClients}</p>
          <p className="text-xs text-slate-400 mt-1">العملاء</p>
        </div>
      </div>

      {/* Charts */}
      {reportType === 'shipments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-4">الشحنات اليومية</h3>
            <LineChart labels={dailyData.days} datasets={[{ label: 'الشحنات', data: dailyData.counts, color: '#3B82F6' }]} height={280} />
          </div>
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-4">توزيع الحالات</h3>
            <PieChart labels={statusDist.labels} data={statusDist.data} height={260} />
          </div>
        </div>
      )}

      {reportType === 'drivers' && (
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">أداء المناديب</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">المندوب</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-300">الشحنات المسندة</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-300">المكتملة</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-300">نسبة الإنجاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {driverReportData.map(d => (
                  <tr key={d.name} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-sm text-white">{d.name}</td>
                    <td className="px-4 py-3 text-sm text-center text-blue-400">{d.shipmentsCount}</td>
                    <td className="px-4 py-3 text-sm text-center text-green-400">{d.completedCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all" style={{ width: `${d.rate}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 w-8">{d.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'clients' && (
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">أكثر العملاء نشاطاً</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">العميل</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">المتجر</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-300">عدد الشحنات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {clientReportData.map(c => (
                  <tr key={c.name} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-sm text-white">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{c.storeName}</td>
                    <td className="px-4 py-3 text-sm text-center text-blue-400">{c.shipmentsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-4">الإيرادات اليومية</h3>
            <LineChart
              labels={dailyData.days}
              datasets={[{ label: 'الإيرادات', data: dailyData.days.map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (dailyData.days.length - 1 - i));
                const dateStr = d.toISOString().split('T')[0];
                return filteredShipments.filter(s => s.createdAt.startsWith(dateStr)).reduce((sum, s) => sum + (s.price || 0), 0);
              }), color: '#F97316' }]}
              height={280}
            />
          </div>
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-4">ملخص الإيرادات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                <span className="text-slate-400">إجمالي الإيرادات</span>
                <span className="text-xl font-bold text-orange-400">{stats.revenue.toLocaleString()} ج.م</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                <span className="text-slate-400">متوسط سعر الشحنة</span>
                <span className="text-lg font-bold text-blue-400">{stats.total > 0 ? Math.round(stats.revenue / stats.total) : 0} ج.م</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                <span className="text-slate-400">الشحنات المكتملة</span>
                <span className="text-lg font-bold text-green-400">{stats.delivered}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
