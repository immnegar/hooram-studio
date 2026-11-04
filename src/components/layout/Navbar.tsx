import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, ArrowUpLeft, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { InstagramIcon, LinkedinIcon, TelegramIcon } from '../ui/SocialIcons';
import { api } from '../../services/api';
import { StudioSettings } from '../../types';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { title: 'صفحه اصلی', path: '/' },
    { title: 'خدمات ما', path: '/services' },
    { title: 'نمونه‌کارها', path: '/portfolio' },
    { title: 'فرآیند همکاری', path: '/process' },
    { title: 'درباره استودیو', path: '/about' },
    { title: 'تماس و ثبت پروژه', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-studio-950/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-2xl'
          : 'bg-studio-950/40 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <div className="w-full h-full bg-studio-950 rounded-[11px] flex items-center justify-center">
                <Film className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-vazir">
                استودیو تبلیغاتی هورام
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono font-medium">
                CREATIVE ADVERTISING STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-studio-900/70 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/admin"
              title="ورود به پنل مدیریت استودیو"
              className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700/60"
            >
              <Shield className="w-4 h-4" />
            </Link>

            <Button
              to="/contact"
              variant="primary"
              size="sm"
              icon={<ArrowUpLeft className="w-4 h-4" />}
              iconPosition="end"
            >
              ثبت درخواست همکاری
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/admin"
              className="p-2 text-slate-400 hover:text-white"
              title="پنل مدیریت"
            >
              <Shield className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="تغییر وضعیت منو"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-studio-900/98 border-b border-slate-800 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 mt-3 shadow-2xl animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.title}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <Button
              to="/contact"
              variant="primary"
              size="md"
              className="w-full justify-center"
              icon={<ArrowUpLeft className="w-4 h-4" />}
              iconPosition="end"
            >
              ثبت درخواست همکاری
            </Button>

            {/* Mobile Social Links */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {settings?.instagram ? (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-studio-950 border border-slate-800 text-pink-400 flex items-center justify-center"
                  aria-label="اینستاگرام"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              ) : null}

              {settings?.linkedin ? (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-studio-950 border border-slate-800 text-blue-400 flex items-center justify-center"
                  aria-label="لینکدین"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              ) : null}

              {settings?.telegram ? (
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-studio-950 border border-slate-800 text-cyan-400 flex items-center justify-center"
                  aria-label="تلگرام"
                >
                  <TelegramIcon className="w-4 h-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
