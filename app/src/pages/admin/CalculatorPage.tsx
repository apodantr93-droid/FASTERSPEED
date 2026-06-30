import { useState, useMemo } from 'react';
import { allGovernorates } from '@/data/pricing';
import { calculateShippingPrice } from '@/data/pricing';
import type { ServiceType } from '@/types';
import { Calculator, ArrowLeft, Weight, MapPin, Zap, Snowflake } from 'lucide-react';

export default function CalculatorPage() {
  const [fromGov, setFromGov] = useState('القاهرة');
  const [toGov, setToGov] = useState('الإسكندرية');
  const [weight, setWeight] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('normal');

  const price = useMemo(() =>
    calculateShippingPrice(fromGov, toGov, weight, serviceType),
    [fromGov, toGov, weight, serviceType]
  );

  const serviceIcons = {
    normal: <Zap className="w-4 h-4" />,
    express: <Zap className="w-4 h-4 text-orange-400" />,
    cold: <Snowflake className="w-4 h-4 text-cyan-400" />,
  };

  const serviceLabels = {
    normal: 'شحن عادي',
    express: 'شحن سريع (+50%)',
    cold: 'شحن مُبرّد (+100%)',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">حاسبة أسعار الشحن</h2>
        <p className="text-slate-400 text-sm mt-1">احسب سعر الشحن التقريبي بين المحافظات</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50 space-y-5">
        {/* From / To */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
              <MapPin className="w-4 h-4 text-blue-400" /> من محافظة
            </label>
            <select value={fromGov} onChange={e => setFromGov(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 outline-none">
              {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="hidden md:flex items-center justify-center pb-3">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
              <MapPin className="w-4 h-4 text-orange-400" /> إلى محافظة
            </label>
            <select value={toGov} onChange={e => setToGov(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white focus:border-orange-500 outline-none">
              {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Weight className="w-4 h-4 text-slate-400" /> الوزن (كجم)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={weight}
              onChange={e => setWeight(parseFloat(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={weight}
              onChange={e => setWeight(parseFloat(e.target.value) || 0.5)}
              className="w-24 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white text-center focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">نوع الخدمة</label>
          <div className="grid grid-cols-3 gap-3">
            {(['normal', 'express', 'cold'] as ServiceType[]).map(type => (
              <button
                key={type}
                onClick={() => setServiceType(type)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  serviceType === type
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500'
                }`}
              >
                {serviceIcons[type]}
                <span className="text-xs font-medium">{serviceLabels[type]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Result */}
      <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-sm text-slate-300 mb-4">تفاصيل السعر</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">السعر الأساسي</span>
            <span className="text-white">{price.basePrice} ج.م</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">رسوم الوزن الإضافي</span>
            <span className="text-white">{price.weightPrice} ج.م</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">رسوم الخدمة ({serviceLabels[serviceType]})</span>
            <span className="text-white">{price.serviceFee} ج.م</span>
          </div>
          <div className="border-t border-slate-600/50 pt-3 flex items-center justify-between">
            <span className="text-base font-semibold text-white">الإجمالي</span>
            <span className="text-3xl font-bold text-orange-400">{price.total} <span className="text-sm text-slate-400">ج.م</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
