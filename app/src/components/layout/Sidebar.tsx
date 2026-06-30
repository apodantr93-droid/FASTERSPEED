import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import {
  LayoutDashboard, Package, UserCircle, Settings,
  Calculator, FileText, Link2, LogOut, Truck, ChevronRight,
  Menu, X, MessageSquare, PlusCircle, ScanLine, Bell, History, Search
} from 'lucide-react';

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { to: '/admin/shipments', icon: Package, label: 'إدارة الشحنات' },
  { to: '/admin/drivers', icon: Truck, label: 'إدارة المناديب' },
  { to: '/admin/clients', icon: UserCircle, label: 'إدارة العملاء' },
  { to: '/admin/statuses', icon: Settings, label: 'حالات الشحنة' },
  { to: '/admin/calculator', icon: Calculator, label: 'حاسبة الأسعار' },
  { to: '/admin/reports', icon: FileText, label: 'التقارير' },
  { to: '/admin/links', icon: Link2, label: 'الروابط الخارجية' },
];

const driverNavItems = [
  { to: '/driver', icon: LayoutDashboard, label: 'الرئيسية' },
  { to: '/driver/shipments', icon: Package, label: 'شحناتي' },
  { to: '/driver/new', icon: PlusCircle, label: 'شحنة جديدة' },
  { to: '/driver/scan', icon: ScanLine, label: 'مسح QR' },
  { to: '/driver/notifications', icon: Bell, label: 'الإشعارات' },
];

const clientNavItems = [
  { to: '/client', icon: LayoutDashboard, label: 'الرئيسية' },
  { to: '/client/shipments', icon: Package, label: 'شحناتي' },
  { to: '/client/track', icon: Search, label: 'تتبع شحنة' },
  { to: '/client/calculator', icon: Calculator, label: 'حاسبة الأسعار' },
  { to: '/client/history', icon: History, label: 'سجل الشحنات' },
  { to: '/client/new', icon: PlusCircle, label: 'طلب شحنة' },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { links } = useData();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = currentUser?.role || 'admin';
  const navItems = role === 'admin' ? adminNavItems : role === 'driver' ? driverNavItems : clientNavItems;
  const activeLinks = links.filter(l => l.isActive && l.position === 'sidebar');

  const isActiveLink = (to: string) => {
    if (to === '/admin' || to === '/driver' || to === '/client') {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-700">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Truck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-orange-400 leading-tight">Faster Delivery</h1>
          <p className="text-xs text-slate-400">نظام إدارة الشحن</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-slate-700/80 text-white border-r-[3px] border-orange-500'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 mr-auto" />}
            </NavLink>
          );
        })}

        {/* External Links */}
        {activeLinks.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="px-4 mb-2 text-xs text-slate-500 font-medium uppercase">روابط سريعة</p>
            {activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200 text-sm"
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white shadow-lg border border-slate-700"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[260px] bg-slate-800/95 backdrop-blur-sm border-l border-slate-700 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
