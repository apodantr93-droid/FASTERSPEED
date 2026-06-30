import { useState } from 'react';
import { useData } from '@/context/DataContext';
import StatusBadge from '@/components/common/StatusBadge';
import ShipmentTimeline from '@/components/shipment/ShipmentTimeline';
import { Search, Package, MapPin, X } from 'lucide-react';

export default function TrackShipment() {
  const { shipments } = useData();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [foundShipment, setFoundShipment] = useState<typeof shipments[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const shipment = shipments.find(s =>
      s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
    );
    setFoundShipment(shipment || null);
  };

  const handleClear = () => {
    setTrackingNumber('');
    setFoundShipment(null);
    setSearched(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/20">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">تتبع الشحنة</h2>
        <p className="text-slate-400 text-sm mt-1">أدخل رقم التتبع لمعرفة حالة شحنتك</p>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={trackingNumber}
              onChange={e => { setTrackingNumber(e.target.value); setSearched(false); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="أدخل رقم التتبع مثال: FD12345"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg pr-11 pl-11 py-3.5 text-sm text-white placeholder-slate-500 focus:border-orange-500 outline-none font-mono"
            />
            {trackingNumber && (
              <button onClick={handleClear} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
          >
            تتبع
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && !foundShipment && (
        <div className="text-center py-8 text-slate-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">لم يتم العثور على شحنة</p>
          <p className="text-sm mt-1">تأكد من رقم التتبع وأعد المحاولة</p>
        </div>
      )}

      {foundShipment && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Shipment Info Card */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white font-mono">{foundShipment.trackingNumber}</p>
                <StatusBadge statusId={foundShipment.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">الراسل</p>
                <p className="text-sm text-white">{foundShipment.senderName}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">المستلم</p>
                <p className="text-sm text-white">{foundShipment.receiverName}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">الهاتف</p>
                <p className="text-sm text-white">{foundShipment.receiverPhone}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> المحافظة</p>
                <p className="text-sm text-white">{foundShipment.governorate}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">الوزن</p>
                <p className="text-sm text-white">{foundShipment.weight} كجم</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">السعر</p>
                <p className="text-sm text-orange-400 font-semibold">{foundShipment.price} ج.م</p>
              </div>
            </div>

            {foundShipment.notes && (
              <div className="mt-3 bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs">ملاحظات</p>
                <p className="text-sm text-white">{foundShipment.notes}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-4">رحلة الشحنة</h3>
            <ShipmentTimeline statusHistory={foundShipment.statusHistory} />
          </div>
        </div>
      )}
    </div>
  );
}
