import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  Image as ImageIcon, 
  Layers, 
  Settings,
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LogoSymbol } from '../../components/common/LogoSymbol';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Guard
  if (!isLoading && !isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-studio-950 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      </div>
    );
  }

  const menuItems = [
    { title: 'پیشخوان و آمار', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { title: 'درخواست‌ها و لیدها', path: '/admin/inquiries', icon: <Inbox className="w-4 h-4" /> },
    { title: 'مدیریت نمونه‌کارها', path: '/admin/portfolio', icon: <ImageIcon className="w-4 h-4" /> },
    { title: 'خدمات استودیو', path: '/admin/services', icon: <Layers className="w-4 h-4" /> },
    { title: 'تنظیمات و راه‌های ارتباطی', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-studio-950 flex flex-col md:flex-row text-slate-200">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-studio-900 border-l border-slate-800 shrink-0 min-h-screen">
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <LogoSymbol className="w-8 h-8 rounded-lg shadow-sm" />
          <div>
            <h2 className="text-sm font-bold text-white font-vazir">استودیو تبلیغاتی هورام</h2>
            <span className="text-[10px] text-slate-400 font-mono">HOORAM ADMIN STUDIO</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              مشاهده وب‌سایت
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-studio-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <LogoSymbol className="w-6 h-6" />
          <span className="text-sm font-bold text-white">پنل مدیریت هورام</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-studio-900 border-b border-slate-800 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                isActive(item.path) ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between">
            <Link to="/" className="text-xs text-cyan-400">مشاهده سایت</Link>
            <button onClick={handleLogout} className="text-xs text-rose-400">خروج</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              مدیریت و مانیتورینگ استودیو هورام
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              خوش آمدید، {user?.name || 'مدیر ارشد'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-studio-900 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              سیستم آنلاین
            </span>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

