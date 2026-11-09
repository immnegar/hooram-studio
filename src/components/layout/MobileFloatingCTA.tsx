import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpLeft, Sparkles } from 'lucide-react';

export const MobileFloatingCTA: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  // Do not show on contact page or admin routes
  const isExcludedRoute = 
    location.pathname === '/contact' || 
    location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isExcludedRoute) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Hide when scrolled near the footer or contact section at the bottom
      const nearBottom = scrollY + windowHeight >= fullHeight - 340;
      setVisible(!nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExcludedRoute, location.pathname]);

  if (isExcludedRoute) {
    return null;
  }

  return (
    <div
      className={`md:hidden fixed z-40 transition-all duration-300 right-4 ${
        visible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
      style={{
        bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Link
        to="/contact"
        aria-label="شروع همکاری و مشاوره با استودیو هورام"
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-studio-950/90 hover:bg-studio-900 active:scale-95 backdrop-blur-xl border border-indigo-500/35 text-white shadow-2xl shadow-indigo-950/80 transition-all duration-200"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="text-xs font-bold font-vazir text-slate-100 group-hover:text-white tracking-wide">
          شروع همکاری
        </span>
        <ArrowUpLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

