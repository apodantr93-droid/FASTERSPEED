import { useState } from 'react';
import { useData } from '@/context/DataContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Plus, Lock, Edit2, Trash2 } from 'lucide-react';

interface StatusFormData {
  nameAr: string;
  color: string;
  description: string;
}

const colorOptions = [
  '#3B82F6', '#F97316', '#22C55E', '#EF4444', '#EAB308', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6', '#F59E0B',
];

export default function StatusesPage() {
  const { statuses, addStatus, updateStatus, deleteStatus } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<StatusFormData>({ nameAr: '', color: colorOptions[0], description: '' });
  const [errors, setErrors] = useState<Partial<StatusFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<StatusFormData> = {};
    if (!form.nameAr.trim()) newErrors.nameAr = 'اسم الحالة مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const nameEn = form.nameAr.replace(/\s+/g, '_').toLowerCase();

    if (editId) {
      updateStatus(editId, { nameAr: form.nameAr, color: form.color, description: form.description });
    } else {
      addStatus({
        name: nameEn,
        nameAr: form.nameAr,
        color: form.color,
        description: form.description || undefined,
        isDefault: false,
        order: statuses.length + 1,
      });
    }

    setShowForm(false);
    setEditId(null);
    setForm({ nameAr: '', color: colorOptions[0], description: '' });
  };

  const startEdit = (status: typeof statuses[0]) => {
    setForm({ nameAr: status.nameAr, color: status.color, description: status.description || '' });
    setEditId(status.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ nameAr: '', color: colorOptions[0], description: '' });
    setEditId(null);
    setErrors({});
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">إدارة حالات الشحنة</h2>
        <button onClick={resetForm} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> حالة جديدة
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">الحالة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">اللون</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">الوصف</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-300">النوع</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-300">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {statuses.sort((a, b) => a.order - b.order).map(status => (
                <tr key={status.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className="text-sm font-medium text-white">{status.nameAr}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-mono" style={{ backgroundColor: status.color + '20', color: status.color }}>
                      {status.color}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{status.description || '-'}</td>
                  <td className="px-4 py-3">
                    {status.isDefault ? (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-400">
                        <Lock className="w-3 h-3" /> افتراضي
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">مخصص</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => startEdit(status)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!status.isDefault && (
                        <button onClick={() => setDeleteId(status.id)} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-lg font-semibold text-white mb-4">{editId ? 'تعديل حالة' : 'إضافة حالة جديدة'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">اسم الحالة *</label>
                <input type="text" value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })} className={`w-full bg-slate-900 border ${errors.nameAr ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
                {errors.nameAr && <p className="text-xs text-red-400 mt-1">{errors.nameAr}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">اللون</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button key={color} type="button" onClick={() => setForm({ ...form, color })} className={`w-8 h-8 rounded-lg transition-all ${form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">الوصف</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors">{editId ? 'حفظ' : 'إضافة'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="حذف الحالة" message="هل أنت متأكد من حذف هذه الحالة؟" onConfirm={() => { if (deleteId) { deleteStatus(deleteId); setDeleteId(null); } }} onCancel={() => setDeleteId(null)} type="warning" />
    </div>
  );
}
