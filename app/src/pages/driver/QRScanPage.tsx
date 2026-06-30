import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/common/StatusBadge';
import ShipmentTimeline from '@/components/shipment/ShipmentTimeline';
import { ScanLine, Search, Package, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function QRScanPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { shipments, statuses, updateShipment } = useData();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [foundShipment, setFoundShipment] = useState<typeof shipments[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleSearch = () => {
    const shipment = shipments.find(s =>
      s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
    );
    if (shipment) {
      setFoundShipment(shipment);
      setShowDetails(true);
    } else {
      setFoundShipment(null);
      setShowDetails(false);
      alert('لم يتم العثور على شحنة بهذا الرقم');
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (!foundShipment) return;

    const statusName = statuses.find(s => s.id === newStatus)?.nameAr || newStatus;
    const newHistory = [
      ...foundShipment.statusHistory,
      {
        status: newStatus,
        statusName,
        timestamp: new Date().toISOString(),
        note: `تم تحديث الحالة إلى ${statusName}`,
        updatedBy: currentUser?.id || 'driver',
      },
    ];

    updateShipment(foundShipment.id, { status: newStatus, statusHistory: newHistory });
    setFoundShipment({ ...foundShipment, status: newStatus, statusHistory: newHistory });
    setUpdatingStatus(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">مسح QR Code</h2>
        <button onClick={() => navigate('/driver')} className="text-sm text-slate-400 hover:text-white">رجوع</button>
      </div>

      {/* Scanner Simulation */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/20">
          <ScanLine className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">ادخل رقم التتبع</h3>
        <p className="text-sm text-slate-400 mb-4">أدخل رقم التتبع أو امسح QR Code للبحث عن الشحنة</p>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="رقم التتبع مثال: FD12345"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg pr-10 pl-4 py-3 text-sm text-white placeholder-slate-500 focus:border-orange-500 outline-none font-mono"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            بحث
          </button>
        </div>
      </div>

      {/* Shipment Details */}
      {foundShipment && showDetails && (
        <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white font-mono">{foundShipment.trackingNumber}</p>
                <StatusBadge statusId={foundShipment.status} />
              </div>
            </div>
            <button onClick={() => setShowDetails(false)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">الراسل</p>
                <p className="text-white">{foundShipment.senderName}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">المستلم</p>
                <p className="text-white">{foundShipment.receiverName}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">الهاتف</p>
                <p className="text-white">{foundShipment.receiverPhone}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">المحافظة</p>
                <p className="text-white">{foundShipment.governorate}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">الوزن</p>
                <p className="text-white">{foundShipment.weight} كجم</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">السعر</p>
                <p className="text-orange-400 font-semibold">{foundShipment.price} ج.م</p>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <button
                onClick={() => setUpdatingStatus(!updatingStatus)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mb-2"
              >
                {updatingStatus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                تحديث الحالة
              </button>
              {updatingStatus && (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-900 rounded-lg">
                  {statuses.map(st => (
                    <button
                      key={st.id}
                      onClick={() => handleStatusUpdate(st.id)}
                      disabled={foundShipment.status === st.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        foundShipment.status === st.id
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800 text-slate-300 hover:bg-blue-500/20 hover:text-blue-400 border border-slate-700'
                      }`}
                    >
                      {st.nameAr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">سجل الحالة</h4>
              <ShipmentTimeline statusHistory={foundShipment.statusHistory} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
