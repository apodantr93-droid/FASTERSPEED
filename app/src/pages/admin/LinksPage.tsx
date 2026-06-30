import { useState } from 'react';
import { useData } from '@/context/DataContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Plus, Globe, MessageCircle, ExternalLink, Edit2, Trash2, Check, X } from 'lucide-react';

interface LinkFormData {
  name: string;
  url: string;
  icon: string;
  position: 'sidebar' | 'header' | 'footer';
}

const iconOptions = [
  { value: 'MessageCircle', label: 'واتساب/محادثة', icon: MessageCircle },
  { value: 'Globe', label: 'موقع', icon: Globe },
  { value: 'ExternalLink', label: 'رابط خارجي', icon: ExternalLink },
];

export default function LinksPage() {
  const { links, addLink, updateLink, deleteLink } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<LinkFormData>({ name: '', url: '', icon: 'MessageCircle', position: 'sidebar' });
  const [errors, setErrors] = useState<Partial<LinkFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<LinkFormData> = {};
    if (!form.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!form.url.trim()) newErrors.url = 'الرابط مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editId) {
      updateLink(editId, { name: form.name, url: form.url, icon: form.icon, position: form.position });
    } else {
      addLink({ name: form.name, url: form.url, icon: form.icon, position: form.position, isActive: true });
    }

    setShowForm(false);
    setEditId(null);
    setForm({ name: '', url: '', icon: 'MessageCircle', position: 'sidebar' });
  };

  const startEdit = (link: typeof links[0]) => {
    setForm({ name: link.name, url: link.url, icon: link.icon, position: link.position });
    setEditId(link.id);
    setShowForm(true);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageCircle': return <MessageCircle className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">الروابط الخارجية</h2>
          <p className="text-sm text-slate-400 mt-1">أضف روابط للتواصل مع العملاء والمناديب</p>
        </div>
        <button
          onClick={() => { setEditId(null); setForm({ name: '', url: '', icon: 'MessageCircle', position: 'sidebar' }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" /> رابط جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map(link => (
          <div key={link.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                  {getIcon(link.icon)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{link.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{link.position === 'sidebar' ? 'الشريط الجانبي' : link.position}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(link)} className="w-7 h-7 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteId(link.id)} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 break-all flex items-center gap-1">
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              {link.url}
            </a>

            <button
              onClick={() => updateLink(link.id, { isActive: !link.isActive })}
              className={`w-full mt-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                link.isActive ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {link.isActive ? <><Check className="w-3 h-3" /> نشط</> : <><X className="w-3 h-3" /> معطل</>}
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-lg font-semibold text-white mb-4">{editId ? 'تعديل رابط' : 'إضافة رابط جديد'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">الاسم *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: واتساب" className={`w-full bg-slate-900 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">الرابط *</label>
                <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://" className={`w-full bg-slate-900 border ${errors.url ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none`} />
                {errors.url && <p className="text-xs text-red-400 mt-1">{errors.url}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">الأيقونة</label>
                <div className="grid grid-cols-3 gap-2">
                  {iconOptions.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.value} type="button" onClick={() => setForm({ ...form, icon: opt.value })} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${form.icon === opt.value ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors">{editId ? 'حفظ' : 'إضافة'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="حذف الرابط" message="هل أنت متأكد من حذف هذا الرابط؟" onConfirm={() => { if (deleteId) { deleteLink(deleteId); setDeleteId(null); } }} onCancel={() => setDeleteId(null)} type="warning" />
    </div>
  );
}
