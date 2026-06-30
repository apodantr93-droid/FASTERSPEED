import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Bell, User, Check } from 'lucide-react';

export default function Header() {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  const userNotifications = notifications.filter(n => {
    if (n.userId && n.userId !== currentUser?.id) return false;
    if (n.role && n.role !== currentUser?.role) return false;
    return true;
  }).slice(0, 10);

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <header className="h-16 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Page Title - empty on left for balance */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute left-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm">الإشعارات</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-orange-400">{unreadCount} غير مقروء</span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {userNotifications.length === 0 ? (
                    <p className="p-4 text-center text-slate-500 text-sm">لا توجد إشعارات</p>
                  ) : (
                    userNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${!n.isRead ? 'bg-slate-700/20' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-orange-500' : 'bg-slate-600'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{n.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[10px] text-slate-500">
                                {new Date(n.createdAt).toLocaleDateString('ar-EG')}
                              </span>
                              {!n.isRead && (
                                <button
                                  onClick={() => handleMarkRead(n.id)}
                                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  مقروء
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{currentUser?.name || 'المستخدم'}</p>
            <p className="text-xs text-slate-400">
              {currentUser?.role === 'admin' ? 'مدير النظام' : currentUser?.role === 'driver' ? 'مندوب' : 'عميل'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
