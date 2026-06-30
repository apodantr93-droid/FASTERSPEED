import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { allGovernorates } from '@/data/pricing';
import { calculateShippingPrice } from '@/data/pricing';
import QRCodeModal from '@/components/shipment/QRCodeModal';
import type { ServiceType } from '@/types';
import { Calculator, Save } from 'lucide-react';

export default function DriverNewShipment() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addShipment, statuses } = useData();
  const [form, setForm] = useState({
    senderName: currentUser?.name || '',
    senderPhone: currentUser?.phone || '',
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
    if (!form.senderName.trim()) newErrors.senderName = 'مطلوب';
    if (!form.senderPhone.trim()) newErrors.senderPhone = 'مطلوب';
    if (!form.receiverName.trim()) newErrors.receiverName = 'مطلوب';
    if (!form.receiverPhone.trim()) newErrors.receiverPhone = 'مطلوب';
    if (!form.receiverAddress.trim()) newErrors.receiverAddress = 'مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const shipment = addShipment({
      senderName: form.senderName,
      senderPhone: form.senderPhone,
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

    // Reset form
    setForm({
      senderName: currentUser?.name || '',
      senderPhone: currentUser?.phone || '',
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      governorate: allGovernorates[0],
      weight: 1,
      notes: '',
      serviceType: 'normal',
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">شحنة جديدة</h2>
        <button onClick={() => navigate('/driver')} className="text-sm text-slate-400 hover:text-white transition-colors">رجوع</button>
      </div>

      {/* Price Preview */}
      <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
        <Calculator className="w-5 h-5 text-orange-400" />
        <div className="flex-1">
          <p className="text-sm text-slate-300">السعر التقديري: <span className="text-xl font-bold text-orange-400">{price.total} ج.م</span></p>
          <p className="text-xs text-slate-500">أساسي: {price.basePrice} + وزن: {price.weightPrice} + خدمة: {price.serviceFee}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-5 border border-slate-700/50 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">اسم الراسل *</label>
            <input type="text" value={form.senderName} onChange={e => setForm({ ...form, senderName: e.target.value })} className={`w-full bg-slate-900 border ${errors.senderName ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">هاتف الراسل *</label>
            <input type="tel" value={form.senderPhone} onChange={e => setForm({ ...form, senderPhone: e.target.value })} className={`w-full bg-slate-900 border ${errors.senderPhone ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-4">
          <h3 className="text-sm font-medium text-orange-400 mb-3">معلومات المستلم</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">اسم المستلم *</label>
              <input type="text" value={form.receiverName} onChange={e => setForm({ ...form, receiverName: e.target.value })} className={`w-full bg-slate-900 border ${errors.receiverName ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">هاتف المستلم *</label>
              <input type="tel" value={form.receiverPhone} onChange={e => setForm({ ...form, receiverPhone: e.target.value })} className={`w-full bg-slate-900 border ${errors.receiverPhone ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1.5">العنوان *</label>
          <input type="text" value={form.receiverAddress} onChange={e => setForm({ ...form, receiverAddress: e.target.value })} className={`w-full bg-slate-900 border ${errors.receiverAddress ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">المحافظة</label>
            <select value={form.governorate} onChange={e => setForm({ ...form, governorate: e.target.value })} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
              {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">الوزن</label>
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
          <label className="block text-sm text-slate-300 mb-1.5">ملاحظات</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none resize-none" />
        </div>

        <button type="submit" className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          حفظ الشحنة وتوليد QR Code
        </button>
      </form>

      {showQR && (
        <QRCodeModal
          trackingNumber={newTrackingNumber}
          shipmentInfo={{ sender: form.senderName, receiver: form.receiverName, governorate: form.governorate }}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}
