import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Plus, Search, Phone, Mail, CheckCircle, XCircle, Edit2, Trash2, UserPlus } from 'lucide-react';

interface DriverFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export default function DriversPage() {
  const { drivers, addDriver, updateDriver, deleteDriver, addUser } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<DriverFormData>({ name: '', phone: '', email: '', password: '' });
  const [errors, setErrors] = useState<Partial<DriverFormData>>({});

  const filtered = useMemo(() =>
    drivers.filter(d =>
      !search || d.name.includes(search) || d.phone.includes(search) || d.email.includes(search)
    ),
    [drivers, search]
  );

  const activeCount = drivers.filter(d => d.isActive).length;

  const validate = (): boolean => {
    const newErrors: Partial<DriverFormData> = {};
    if (!form.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!form.phone.trim()) newErrors.phone = 'الهاتف مطلوب';
    if (!form.email.trim()) newErrors.email = 'البريد مطلوب';
    if (!editId && !form.password.trim()) newErrors.password = 'كلمة المرور مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editId) {
      updateDriver(editId, {
        name: form.name,
        phone: form.phone,
        email: form.email,
      });
    } else {
      const userId = `u_${Date.now()}`;
      const userData = {
        id: userId,
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'driver' as const,
        phone: form.phone,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addUser(userData as any);
      addDriver({
        userId,
        name: form.name,
        phone: form.phone,
        email: form.email,
        isActive: true,
      });
    }

    setShowForm(false);
    setEditId(null);
    setForm({ name: '', phone: '', email: '', password: '' });
  };

  const startEdit = (driver: typeof drivers[0]) => {
    setForm({ name: driver.name, phone: driver.phone, email: driver.email, password: '' });
    setEditId(driver.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', password: '' });
    setEditId(null);
    setErrors({});
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">إدارة المناديب</h2>
          <p className="text-sm text-slate-400 mt-1">{activeCount} نشط من {drivers.length} مندوب</p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          مندوب جديد
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث باسم المندوب، الهاتف..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(driver => (
          <div key={driver.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${driver.isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                  {driver.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{driver.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {driver.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" /> نشط
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <XCircle className="w-3 h-3" /> معطل
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(driver)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(driver.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                <span>{driver.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/50">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{driver.shipmentsCount}</p>
                <p className="text-xs text-slate-500">الشحنات المسندة</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{driver.completedCount}</p>
                <p className="text-xs text-slate-500">المكتملة</p>
              </div>
            </div>

            <button
              onClick={() => updateDriver(driver.id, { isActive: !driver.isActive })}
              className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                driver.isActive
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
              }`}
            >
              {driver.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا يوجد مناديب</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editId ? 'تعديل مندوب' : 'إضافة مندوب جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">الاسم *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={`w-full bg-slate-900 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">البريد الإلكتروني *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={`w-full bg-slate-900 border ${errors.email ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">الهاتف *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className={`w-full bg-slate-900 border ${errors.phone ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`}
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>
              {!editId && (
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">كلمة المرور *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className={`w-full bg-slate-900 border ${errors.password ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`}
                  />
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                </div>
              )}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors"
                >
                  {editId ? 'حفظ التعديلات' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="حذف المندوب"
        message="هل أنت متأكد من حذف هذا المندوب؟"
        onConfirm={() => { if (deleteId) { deleteDriver(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
        type="danger"
      />
    </div>
  );
}
