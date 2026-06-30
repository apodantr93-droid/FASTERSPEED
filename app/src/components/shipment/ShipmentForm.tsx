import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { allGovernorates } from '@/data/pricing';
import { calculateShippingPrice } from '@/data/pricing';
import type { ServiceType } from '@/types';
import { X, Calculator } from 'lucide-react';

interface ShipmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<ShipmentData>;
}

interface ShipmentData {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  governorate: string;
  weight: number;
  notes: string;
  serviceType: ServiceType;
  driverId: string;
}

export default function ShipmentForm({ onClose, onSuccess, initialData }: ShipmentFormProps) {
  const { addShipment, drivers, statuses } = useData();
  const { currentUser } = useAuth();

  const [form, setForm] = useState<ShipmentData>({
    senderName: initialData?.senderName || currentUser?.name || '',
    senderPhone: initialData?.senderPhone || currentUser?.phone || '',
    receiverName: initialData?.receiverName || '',
    receiverPhone: initialData?.receiverPhone || '',
    receiverAddress: initialData?.receiverAddress || '',
    governorate: initialData?.governorate || allGovernorates[0],
    weight: initialData?.weight || 1,
    notes: initialData?.notes || '',
    serviceType: (initialData?.serviceType as ServiceType) || 'normal',
    driverId: initialData?.driverId || drivers[0]?.id || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShipmentData, string>>>({});

  const activeDrivers = drivers.filter(d => d.isActive);
  const defaultStatus = statuses.find(s => s.id === 'pending') || statuses[0];

  const price = calculateShippingPrice('القاهرة', form.governorate, form.weight, form.serviceType);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShipmentData, string>> = {};
    if (!form.senderName.trim()) newErrors.senderName = 'اسم الراسل مطلوب';
    if (!form.senderPhone.trim()) newErrors.senderPhone = 'هاتف الراسل مطلوب';
    if (!form.receiverName.trim()) newErrors.receiverName = 'اسم المستلم مطلوب';
    if (!form.receiverPhone.trim()) newErrors.receiverPhone = 'هاتف المستلم مطلوب';
    if (!form.receiverAddress.trim()) newErrors.receiverAddress = 'العنوان مطلوب';
    if (!form.governorate) newErrors.governorate = 'المحافظة مطلوبة';
    if (form.weight <= 0) newErrors.weight = 'الوزن يجب أن يكون أكبر من 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const statusId = defaultStatus?.id || 'pending';
    addShipment({
      senderName: form.senderName,
      senderPhone: form.senderPhone,
      senderId: currentUser?.role === 'client' ? currentUser.id : undefined,
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      receiverAddress: form.receiverAddress,
      governorate: form.governorate,
      weight: form.weight,
      notes: form.notes || undefined,
      status: statusId,
      driverId: form.driverId || undefined,
      price: price.total,
      serviceType: form.serviceType,
    });

    onSuccess();
    onClose();
  };

  const handleChange = (field: keyof ShipmentData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">إضافة شحنة جديدة</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Price Calculator Preview */}
          <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
            <Calculator className="w-5 h-5 text-orange-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-300">السعر التقديري: <span className="text-lg font-bold text-orange-400">{price.total} ج.م</span></p>
              <p className="text-xs text-slate-500">أساسي: {price.basePrice} + وزن: {price.weightPrice} + خدمة: {price.serviceFee}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sender Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-blue-400">معلومات الراسل</h4>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">اسم الراسل *</label>
                <input
                  type="text"
                  value={form.senderName}
                  onChange={e => handleChange('senderName', e.target.value)}
                  className={`w-full bg-slate-900 border ${errors.senderName ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                />
                {errors.senderName && <p className="text-xs text-red-400 mt-1">{errors.senderName}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">هاتف الراسل *</label>
                <input
                  type="tel"
                  value={form.senderPhone}
                  onChange={e => handleChange('senderPhone', e.target.value)}
                  className={`w-full bg-slate-900 border ${errors.senderPhone ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                />
                {errors.senderPhone && <p className="text-xs text-red-400 mt-1">{errors.senderPhone}</p>}
              </div>
            </div>

            {/* Receiver Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-orange-400">معلومات المستلم</h4>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">اسم المستلم *</label>
                <input
                  type="text"
                  value={form.receiverName}
                  onChange={e => handleChange('receiverName', e.target.value)}
                  className={`w-full bg-slate-900 border ${errors.receiverName ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                />
                {errors.receiverName && <p className="text-xs text-red-400 mt-1">{errors.receiverName}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">هاتف المستلم *</label>
                <input
                  type="tel"
                  value={form.receiverPhone}
                  onChange={e => handleChange('receiverPhone', e.target.value)}
                  className={`w-full bg-slate-900 border ${errors.receiverPhone ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                />
                {errors.receiverPhone && <p className="text-xs text-red-400 mt-1">{errors.receiverPhone}</p>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">عنوان المستلم *</label>
            <input
              type="text"
              value={form.receiverAddress}
              onChange={e => handleChange('receiverAddress', e.target.value)}
              className={`w-full bg-slate-900 border ${errors.receiverAddress ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
            />
            {errors.receiverAddress && <p className="text-xs text-red-400 mt-1">{errors.receiverAddress}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">المحافظة *</label>
              <select
                value={form.governorate}
                onChange={e => handleChange('governorate', e.target.value)}
                className={`w-full bg-slate-900 border ${errors.governorate ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
              >
                {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">الوزن (كجم) *</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={form.weight}
                onChange={e => handleChange('weight', parseFloat(e.target.value) || 0)}
                className={`w-full bg-slate-900 border ${errors.weight ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
              />
              {errors.weight && <p className="text-xs text-red-400 mt-1">{errors.weight}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">نوع الخدمة</label>
              <select
                value={form.serviceType}
                onChange={e => handleChange('serviceType', e.target.value as ServiceType)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="normal">عادي</option>
                <option value="express">سريع (+50%)</option>
                <option value="cold">مُبرَّد (+100%)</option>
              </select>
            </div>
          </div>

          {/* Driver */}
          {currentUser?.role === 'admin' && (
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">المندوب</label>
              <select
                value={form.driverId}
                onChange={e => handleChange('driverId', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">-- اختر مندوب --</option>
                {activeDrivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">ملاحظات</label>
            <textarea
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              حفظ الشحنة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
