import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function DriverNotifications() {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead } = useData();

  const myNotifications = notifications.filter(n => {
    if (n.userId && n.userId !== currentUser?.id) return false;
    if (n.role && n.role !== 'driver' && n.role !== currentUser?.role) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">الإشعارات</h2>
          <p className="text-sm text-slate-400 mt-1">{unreadCount > 0 ? `${unreadCount} إشعارات غير مقروءة` : 'جميع الإشعارات مقروءة'}</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => myNotifications.filter(n => !n.isRead).forEach(n => markNotificationRead(n.id))}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="space-y-3">
        {myNotifications.map(n => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
              n.isRead ? 'bg-slate-800/50 border-slate-700/30' : `${getBgColor(n.type)}`
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
              {getIcon(n.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-semibold ${n.isRead ? 'text-slate-300' : 'text-white'}`}>{n.title}</h3>
                {!n.isRead && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />}
              </div>
              <p className={`text-sm mt-0.5 ${n.isRead ? 'text-slate-500' : 'text-slate-300'}`}>{n.message}</p>
              <p className="text-xs text-slate-500 mt-1.5">
                {new Date(n.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {myNotifications.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد إشعارات</p>
          </div>
        )}
      </div>
    </div>
  );
}
