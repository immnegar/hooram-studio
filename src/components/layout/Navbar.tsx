import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, ArrowUpLeft, Shield, Phone } from 'lucide-react';
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

  // Lock body scroll when full-screen mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Desktop Navigation links (Preserved intact)
  const navLinks = [
    { title: 'صفحه اصلی', path: '/' },
    { title: 'خدمات ما', path: '/services' },
    { title: 'نمونه‌کارها', path: '/portfolio' },
    { title: 'فرآیند همکاری', path: '/process' },
    { title: 'درباره استودیو', path: '/about' },
    { title: 'تماس و ثبت پروژه', path: '/contact' },
  ];

  // Mobile Editorial Navigation (Bespoke Luxury Architecture)
  const mobileEditorialLinks = [
    { num: '01', title: 'خانه', enTitle: 'HOME', path: '/' },
    { num: '02', title: 'نمونه‌کارها', enTitle: 'PORTFOLIO', path: '/portfolio' },
    { num: '03', title: 'خدمات', enTitle: 'SERVICES', path: '/services' },
    { num: '04', title: 'درباره ما', enTitle: 'ABOUT STUDIO', path: '/about' },
    { num: '05', title: 'تماس با ما', enTitle: 'CONTACT US', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-studio-950/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-2xl'
            : 'bg-studio-950/40 backdrop-blur-sm py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <div className="w-full h-full bg-studio-950 rounded-[11px] flex items-center justify-center">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-vazir">
                  استودیو تبلیغاتی هورام
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-mono font-medium">
                  CREATIVE ADVERTISING STUDIO
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (100% Preserved Luxury Pill) */}
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

            {/* Desktop Actions (Preserved) */}
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

            {/* Mobile Header Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/admin"
                className="p-2 rounded-xl text-slate-400 hover:text-white active:bg-slate-800/60"
                title="پنل مدیریت"
                aria-label="پنل مدیریت"
              >
                <Shield className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl text-slate-200 hover:text-white bg-white/5 active:bg-white/10 border border-white/10 focus:outline-none transition-colors"
                aria-label={isOpen ? 'بستن منو' : 'باز کردن منوی ناوبری'}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- BESPOKE LUXURY FULL-SCREEN MOBILE NAVIGATION ---------------- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#07090E] flex flex-col justify-between overflow-y-auto overflow-x-hidden animate-menuFadeIn lg:hidden select-none"
          dir="rtl"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px), 1.25rem)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1.5rem)',
          }}
        >
          {/* Architectural Background Details & Signature Watermark */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Signature Typographic Brand Element */}
            <span
              aria-hidden="true"
              className="absolute -left-12 top-1/2 -translate-y-1/2 font-mono font-black text-[30vw] text-white/[0.025] tracking-tighter uppercase rotate-90 select-none"
            >
              HORAM
            </span>
            {/* Subtle Restrained Ambient Aura */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/[0.04] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/[0.03] rounded-full blur-3xl" />
          </div>

          {/* 1. Header and Brand Signature */}
          <div className="relative z-10 px-6 sm:px-8 pt-1 pb-5 border-b border-white/[0.06] flex items-center justify-between">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-studio-950 rounded-[11px] flex items-center justify-center">
                  <Film className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white font-vazir leading-tight">
                  استودیو تبلیغاتی هورام
                </span>
                <span className="text-[9px] tracking-widest text-slate-400 uppercase font-mono font-medium">
                  CREATIVE ADVERTISING STUDIO
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/10 active:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors focus:outline-none"
              aria-label="بستن منو"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Editorial Navigation Destinations */}
          <div className="relative z-10 px-6 sm:px-8 py-6 my-auto flex flex-col justify-center space-y-1">
            {mobileEditorialLinks.map((item, index) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  style={{ animationDelay: `${index * 45 + 50}ms` }}
                  className={`group relative flex items-center justify-between py-3.5 sm:py-4 px-3 -mx-3 rounded-2xl transition-all duration-200 animate-menuSlideUp ${
                    active
                      ? 'bg-white/[0.04] text-white'
                      : 'text-slate-300 hover:text-white active:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-baseline gap-3 sm:gap-4">
                    <span className="font-mono text-xs text-indigo-400/80 tracking-widest font-semibold">
                      {item.num}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-vazir tracking-tight transition-transform duration-200 group-active:translate-x-1">
                      {item.title}
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-slate-500 uppercase font-medium">
                      {item.enTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {active ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.9)] animate-pulse" />
                    ) : (
                      <ArrowUpLeft className="w-4 h-4 text-slate-600 transition-all duration-200 group-hover:text-slate-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 3. Contact & Collaboration Area */}
          <div
            style={{ animationDelay: '300ms' }}
            className="relative z-10 px-6 sm:px-8 pt-5 border-t border-white/[0.06] space-y-4 animate-menuSlideUp"
          >
            {/* Premium Collaboration CTA */}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full group block p-[1px] rounded-2xl bg-gradient-to-r from-amber-500/40 via-indigo-500/60 to-cyan-500/40 hover:from-amber-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-indigo-950/40"
            >
              <div className="w-full bg-studio-900/95 hover:bg-studio-900 px-5 py-3.5 rounded-[15px] flex items-center justify-between transition-colors">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-white font-vazir">شروع همکاری</span>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400">
                    ثبت رایگان پروژه و مشاوره سینمایی
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:text-white group-hover:bg-indigo-600 transition-all">
                  <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Direct Contact & Social Links Bar */}
            <div className="flex items-center justify-between pt-1">
              <a
                href="tel:09128548623"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-cyan-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono text-slate-200 tracking-wider font-semibold" dir="ltr">
                  ۰۹۱۲۸۵۴۸۶۲۳
                </span>
              </a>

              {/* Minimalist Social Media Icons */}
              <div className="flex items-center gap-2">
                {settings?.instagram ? (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="اینستاگرام هورام استودیو"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-pink-950/30 border border-white/10 hover:border-pink-500/40 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="اینستاگرام هورام استودیو"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-pink-950/30 border border-white/10 hover:border-pink-500/40 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {settings?.linkedin ? (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="لینکدین هورام استودیو"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-blue-950/30 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="لینکدین هورام استودیو"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-blue-950/30 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {settings?.telegram ? (
                  <a
                    href={settings.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="تلگرام هورام استودیو"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-cyan-950/30 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all"
                  >
                    <TelegramIcon className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="تلگرام هورام استودیو"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-cyan-950/30 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all"
                  >
                    <TelegramIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
