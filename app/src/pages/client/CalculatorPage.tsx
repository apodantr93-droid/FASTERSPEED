import { useState, useMemo } from 'react';
import { allGovernorates } from '@/data/pricing';
import { calculateShippingPrice } from '@/data/pricing';
import type { ServiceType } from '@/types';
import { Calculator, MapPin, Weight, Zap, Snowflake, Clock } from 'lucide-react';

export default function ClientCalculatorPage() {
  const [fromGov, setFromGov] = useState('القاهرة');
  const [toGov, setToGov] = useState('الإسكندرية');
  const [weight, setWeight] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('normal');

  const price = useMemo(() => calculateShippingPrice(fromGov, toGov, weight, serviceType), [fromGov, toGov, weight, serviceType]);

  const serviceIcons = {
    normal: <Clock className="w-5 h-5" />,
    express: <Zap className="w-5 h-5 text-orange-400" />,
    cold: <Snowflake className="w-5 h-5 text-cyan-400" />,
  };

  const serviceLabels = {
    normal: 'شحن عادي',
    express: 'شحن سريع',
    cold: 'شحن مُبرّد',
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/20">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">حاسبة الشحن</h2>
        <p className="text-slate-400 text-sm mt-1">احسب سعر شحنتك التقريبي</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
              <MapPin className="w-4 h-4 text-blue-400" /> من
            </label>
            <select value={fromGov} onChange={e => setFromGov(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-3 text-sm text-white focus:border-blue-500 outline-none">
              {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
              <MapPin className="w-4 h-4 text-orange-400" /> إلى
            </label>
            <select value={toGov} onChange={e => setToGov(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-3 text-sm text-white focus:border-orange-500 outline-none">
              {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Weight className="w-4 h-4 text-slate-400" /> الوزن (كجم)
          </label>
          <div className="flex items-center gap-3">
            <input type="range" min="0.5" max="50" step="0.5" value={weight} onChange={e => setWeight(parseFloat(e.target.value))} className="flex-1 accent-blue-500" />
            <input type="number" min="0.5" step="0.5" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0.5)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white text-center focus:border-blue-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">نوع الخدمة</label>
          <div className="grid grid-cols-3 gap-3">
            {(['normal', 'express', 'cold'] as ServiceType[]).map(type => (
              <button key={type} onClick={() => setServiceType(type)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${serviceType === type ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500'}`}>
                {serviceIcons[type]}
                <span className="text-xs font-medium">{serviceLabels[type]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 text-center">
        <p className="text-sm text-slate-300 mb-2">السعر التقريبي</p>
        <p className="text-4xl font-bold text-orange-400">{price.total} <span className="text-base text-slate-400">ج.م</span></p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <span className="text-slate-400">أساسي: <span className="text-white">{price.basePrice}</span></span>
          <span className="text-slate-400">وزن: <span className="text-white">{price.weightPrice}</span></span>
          <span className="text-slate-400">خدمة: <span className="text-white">{price.serviceFee}</span></span>
        </div>
      </div>
    </div>
  );
}
