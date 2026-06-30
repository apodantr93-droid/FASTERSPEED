import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import StatusBadge from '@/components/common/StatusBadge';
import ShipmentForm from '@/components/shipment/ShipmentForm';
import QRCodeModal from '@/components/shipment/QRCodeModal';
import ExportButton from '@/components/common/ExportButton';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ShipmentTimeline from '@/components/shipment/ShipmentTimeline';
import { Plus, Search, Filter, Eye, Trash2, QrCode, X } from 'lucide-react';

export default function ShipmentsPage() {
  const { shipments, deleteShipment, statuses } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewShipment, setViewShipment] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return shipments.filter(s => {
      const matchesSearch = !search ||
        s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
        s.senderName.includes(search) ||
        s.receiverName.includes(search);
      const matchesStatus = !statusFilter || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [shipments, search, statusFilter]);

  const shipmentToView = shipments.find(s => s.id === viewShipment);

  const exportColumns = [
    { header: 'رقم التتبع', key: 'trackingNumber' },
    { header: 'الراسل', key: 'senderName' },
    { header: 'المستلم', key: 'receiverName' },
    { header: 'العنوان', key: 'receiverAddress' },
    { header: 'المحافظة', key: 'governorate' },
    { header: 'الوزن', key: 'weight' },
    { header: 'الحالة', key: 'status' },
    { header: 'المندوب', key: 'driverName' },
    { header: 'السعر', key: 'price' },
    { header: 'التاريخ', key: 'createdAt' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">إدارة الشحنات</h2>
        <div className="flex items-center gap-2">
          <ExportButton data={filtered} columns={exportColumns} filename="shipments" title="الشحنات" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            شحنة جديدة
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث برقم التتبع، الراسل، المستلم..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg pr-10 pl-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none min-w-[160px]"
          >
            <option value="">كل الحالات</option>
            {statuses.map(s => <option key={s.id} value={s.id}>{s.nameAr}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">رقم التتبع</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">الراسل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">المستلم</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300 hidden md:table-cell">المحافظة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">الحالة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300 hidden lg:table-cell">المندوب</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">السعر</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-300">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{s.trackingNumber}</td>
                  <td className="px-4 py-3 text-sm text-white">{s.senderName}</td>
                  <td className="px-4 py-3 text-sm text-white">{s.receiverName}</td>
                  <td className="px-4 py-3 text-sm text-slate-400 hidden md:table-cell">{s.governorate}</td>
                  <td className="px-4 py-3"><StatusBadge statusId={s.status} /></td>
                  <td className="px-4 py-3 text-sm text-slate-400 hidden lg:table-cell">{s.driverName || '-'}</td>
                  <td className="px-4 py-3 text-sm text-emerald-400">{s.price} ج.م</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setViewShipment(s.id)}
                        className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedTracking(s.trackingNumber)}
                        className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-orange-400 transition-colors"
                        title="QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-sm">
                    لا توجد شحنات مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && <ShipmentForm onClose={() => setShowForm(false)} onSuccess={() => {}} />}

      {/* QR Modal */}
      {selectedTracking && (
        <QRCodeModal
          trackingNumber={selectedTracking}
          onClose={() => setSelectedTracking(null)}
        />
      )}

      {/* View Modal */}
      {shipmentToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewShipment(null)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">تفاصيل الشحنة</h3>
              <button onClick={() => setViewShipment(null)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">رقم التتبع</p>
                  <p className="text-blue-400 font-mono font-semibold">{shipmentToView.trackingNumber}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">الحالة</p>
                  <StatusBadge statusId={shipmentToView.status} />
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">الراسل</p>
                  <p className="text-white">{shipmentToView.senderName}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">المستلم</p>
                  <p className="text-white">{shipmentToView.receiverName}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">الهاتف</p>
                  <p className="text-white">{shipmentToView.receiverPhone}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">المحافظة</p>
                  <p className="text-white">{shipmentToView.governorate}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">الوزن</p>
                  <p className="text-white">{shipmentToView.weight} كجم</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">السعر</p>
                  <p className="text-orange-400 font-semibold">{shipmentToView.price} ج.م</p>
                </div>
              </div>
              {shipmentToView.notes && (
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">ملاحظات</p>
                  <p className="text-white text-sm">{shipmentToView.notes}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">سجل الحالة</h4>
                <ShipmentTimeline statusHistory={shipmentToView.statusHistory} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="حذف الشحنة"
        message="هل أنت متأكد من حذف هذه الشحنة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() => { if (deleteId) { deleteShipment(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
        type="danger"
      />
    </div>
  );
}
