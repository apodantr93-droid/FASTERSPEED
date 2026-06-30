import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { allGovernorates } from '@/data/pricing';
import { calculateShippingPrice } from '@/data/pricing';
import QRCodeModal from '@/components/shipment/QRCodeModal';
import type { ServiceType } from '@/types';
import { Send, Calculator, MapPin, User, Phone, Weight, FileText, ArrowLeft } from 'lucide-react';

export default function ClientNewShipment() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addShipment, statuses } = useData();
  const [form, setForm] = useState({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    governorate: allGovernorates[0],
    weight: 1,
    notes: '',
    serviceType: 'normal' as ServiceType,
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [showQR, setShowQR] = useState(false);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');

  const price = calculateShippingPrice('القاهرة', form.governorate, form.weight, form.serviceType);
  const defaultStatus = statuses.find(s => s.id === 'pending') || statuses[0];

  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};
    if (!form.receiverName.trim()) newErrors.receiverName = 'اسم المستلم مطلوب';
    if (!form.receiverPhone.trim()) newErrors.receiverPhone = 'هاتف المستلم مطلوب';
    if (!form.receiverAddress.trim()) newErrors.receiverAddress = 'العنوان مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const shipment = addShipment({
      senderName: currentUser?.name || '',
      senderPhone: currentUser?.phone || '',
      senderId: currentUser?.id,
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      receiverAddress: form.receiverAddress,
      governorate: form.governorate,
      weight: form.weight,
      notes: form.notes || undefined,
      status: defaultStatus?.id || 'pending',
      price: price.total,
      serviceType: form.serviceType,
    });

    setNewTrackingNumber(shipment.trackingNumber);
    setShowQR(true);

    setForm({
      receiverName: '', receiverPhone: '', receiverAddress: '',
      governorate: allGovernorates[0], weight: 1, notes: '', serviceType: 'normal',
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">طلب شحنة جديدة</h2>
        <button onClick={() => navigate('/client')} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </button>
      </div>

      {/* Price Preview */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
        <Calculator className="w-5 h-5 text-green-400" />
        <div className="flex-1">
          <p className="text-sm text-slate-300">السعر التقديري: <span className="text-xl font-bold text-orange-400">{price.total} ج.م</span></p>
          <p className="text-xs text-slate-500">أساسي: {price.basePrice} + وزن: {price.weightPrice} + خدمة: {price.serviceFee}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-5 border border-slate-700/50 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-medium text-orange-400">معلومات المستلم</h3>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1.5">اسم المستلم *</label>
          <input type="text" value={form.receiverName} onChange={e => setForm({ ...form, receiverName: e.target.value })} className={`w-full bg-slate-900 border ${errors.receiverName ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
          {errors.receiverName && <p className="text-xs text-red-400 mt-1">{errors.receiverName}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Phone className="w-3.5 h-3.5" /> هاتف المستلم *
          </label>
          <input type="tel" value={form.receiverPhone} onChange={e => setForm({ ...form, receiverPhone: e.target.value })} className={`w-full bg-slate-900 border ${errors.receiverPhone ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
          {errors.receiverPhone && <p className="text-xs text-red-400 mt-1">{errors.receiverPhone}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <MapPin className="w-3.5 h-3.5" /> العنوان *
          </label>
          <input type="text" value={form.receiverAddress} onChange={e => setForm({ ...form, receiverAddress: e.target.value })} className={`w-full bg-slate-900 border ${errors.receiverAddress ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
          {errors.receiverAddress && <p className="text-xs text-red-400 mt-1">{errors.receiverAddress}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
              <MapPin className="w-3.5 h-3.5" /> المحافظة
            </label>
            <select value={form.governorate} onChange={e => setForm({ ...form, governorate: e.target.value })} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
              {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
              <Weight className="w-3.5 h-3.5" /> الوزن
            </label>
            <input type="number" min="0.5" step="0.5" value={form.weight} onChange={e => setForm({ ...form, weight: parseFloat(e.target.value) || 0.5 })} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">الخدمة</label>
            <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value as ServiceType })} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
              <option value="normal">عادي</option>
              <option value="express">سريع</option>
              <option value="cold">مُبرَّد</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <FileText className="w-3.5 h-3.5" /> ملاحظات
          </label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none resize-none" />
        </div>

        <button type="submit" className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          إرسال الطلب
        </button>
      </form>

      {showQR && (
        <QRCodeModal
          trackingNumber={newTrackingNumber}
          shipmentInfo={{ sender: currentUser?.name, receiver: form.receiverName, governorate: form.governorate }}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}
