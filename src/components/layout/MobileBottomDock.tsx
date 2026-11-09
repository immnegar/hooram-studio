import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Sparkles, ArrowUpLeft } from 'lucide-react';

export const MobileBottomDock: React.FC = () => {
  const location = useLocation();

  // Exclude from admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    {
      title: 'خانه',
      path: '/',
      icon: Home,
    },
    {
      title: 'پروژه‌ها',
      path: '/portfolio',
      icon: Film,
    },
    {
      title: 'خدمات',
      path: '/services',
      icon: Sparkles,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleClick = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="دسترسی سریع موبایل"
      className="md:hidden fixed z-40 left-1/2 -translate-x-1/2 transition-all duration-300"
      style={{
        bottom: 'calc(0.85rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="bg-studio-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.65)] rounded-full px-2 py-1.5 flex items-center gap-1 select-none">
        {/* Navigation Links */}
        {items.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleClick(item.path)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active
                  ? 'bg-white/10 text-white font-bold shadow-inner'
                  : 'text-slate-400 hover:text-white active:bg-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="font-vazir text-[11px]">{item.title}</span>
            </Link>
          );
        })}

        {/* Separator */}
        <div className="w-px h-4 bg-white/10 mx-0.5" />

        {/* Primary Contact Action Pill */}
        <Link
          to="/contact"
          onClick={() => handleClick('/contact')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/35 active:scale-95 transition-all"
        >
          <span className="font-vazir text-[11px]">ثبت سفارش</span>
          <ArrowUpLeft className="w-3.5 h-3.5 text-indigo-200" />
        </Link>
      </div>
    </nav>
  );
};

