import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

interface SectionDef {
  id: string;
  label: string;
}

const PAGE_SECTIONS: Record<string, SectionDef[]> = {
  '/': [
    { id: 'hero', label: 'شروع و شوپیس' },
    { id: 'about-intro', label: 'معرفی استودیو' },
    { id: 'services', label: 'خدمات تخصصی' },
    { id: 'portfolio', label: 'نمونه‌کارها' },
    { id: 'why-us', label: 'مزیت‌های رقابتی' },
    { id: 'process', label: 'فرآیند تولید' },
    { id: 'cta', label: 'مشاوره و سفارش' }
  ],
  '/services': [
    { id: 'services-header', label: 'خدمات هورام' },
    { id: 'service-video', label: 'تیزر تبلیغاتی' },
    { id: 'service-web', label: 'طراحی وب‌سایت' },
    { id: 'services-faq', label: 'پرسش‌های متداول' }
  ],
  '/portfolio': [
    { id: 'portfolio-header', label: 'آرشیو آثار' },
    { id: 'portfolio-grid', label: 'پروژه‌ها' },
    { id: 'portfolio-cta', label: 'سفارش اختصاصی' }
  ],
  '/about': [
    { id: 'about-hero', label: 'درباره هورام' },
    { id: 'about-manifesto', label: 'مانیفست ما' },
    { id: 'about-pillars', label: 'اصول سه‌گانه' },
    { id: 'about-cta', label: 'همکاری و ارتباط' }
  ],
  '/process': [
    { id: 'process-header', label: 'مراحل خلق' },
    { id: 'process-steps', label: 'گام‌های ۴گانه' },
    { id: 'process-cta', label: 'شروع همکاری' }
  ],
  '/contact': [
    { id: 'contact-header', label: 'تماس با استودیو' },
    { id: 'contact-form', label: 'فرم ثبت استعلام' },
    { id: 'contact-info', label: 'راه‌های ارتباطی' }
  ]
};

export const FloatingScrollGuide: React.FC = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [availableSections, setAvailableSections] = useState<SectionDef[]>([]);

  // Update available sections when route changes
  useEffect(() => {
    const rawSections = PAGE_SECTIONS[location.pathname] || [];

    // Allow the DOM to settle before querying section elements
    const checkDomSections = () => {
      const existing = rawSections.filter((s) => document.getElementById(s.id) !== null);
      setAvailableSections(existing);
      if (existing.length > 0) {
        setActiveSection(existing[0].id);
      }
    };

    const timer = setTimeout(checkDomSections, 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Track active section and scroll position
  useEffect(() => {
    if (availableSections.length < 2) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 300);

      // Check if at the bottom of the page (guarantee last section is highlighted)
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= fullHeight - 70) {
        setActiveSection(availableSections[availableSections.length - 1].id);
        return;
      }

      // Check if at the top
      if (scrollY < 80) {
        setActiveSection(availableSections[0].id);
        return;
      }

      // Middle scroll check: which section header is active around top 35% of screen
      const anchorPoint = windowHeight * 0.35;
      let currentId = availableSections[0].id;

      for (const sec of availableSections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= anchorPoint) {
            currentId = sec.id;
          }
        }
      }

      setActiveSection(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [availableSections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Do not render if the page does not have at least 2 distinct sections
  if (availableSections.length < 2) {
    return null;
  }

  return (
    <>
      {/* Desktop & Tablet Floating Scroll Guide (Left-aligned, Glassmorphic) */}
      <aside
        aria-label="راهنمای پیمایش صفحه"
        className="hidden md:flex fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center"
      >
        <div className="bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl py-3 px-2 flex flex-col items-center gap-2.5 transition-all duration-300 hover:border-white/20 select-none">
          {/* Vertical section navigation dots */}
          <nav className="flex flex-col items-center gap-2" role="navigation">
            {availableSections.map((sec) => {
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  title={sec.label}
                  aria-label={sec.label}
                  className="group relative flex items-center justify-center p-1.5 focus:outline-none"
                >
                  {/* Indicator Dot / Pill */}
                  <div
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-2 h-7 bg-gradient-to-b from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
                        : 'w-1.5 h-3 bg-slate-600/70 group-hover:bg-slate-400 group-hover:h-4'
                    }`}
                  />

                  {/* Active Section Label (always visible when active) */}
                  {isActive && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-md pointer-events-none flex items-center gap-1.5 animate-fadeIn">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>{sec.label}</span>
                    </div>
                  )}

                  {/* Inactive Section Label (shown on hover only) */}
                  {!isActive && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      {sec.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Back to top button */}
          <div
            className={`flex flex-col items-center transition-all duration-300 ${
              showBackToTop ? 'opacity-100 max-h-16 pt-1' : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'
            }`}
          >
            <div className="w-4 h-px bg-white/10 mb-2" />
            <button
              onClick={scrollToTop}
              title="بازگشت به ابتدای صفحه"
              aria-label="بازگشت به ابتدای صفحه"
              className="group relative flex items-center justify-center w-7 h-7 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 transition-all duration-300 focus:outline-none"
            >
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                بازگشت به بالا
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Back To Top Button (Minimal & Non-intrusive) */}
      <div
        className={`md:hidden fixed bottom-6 left-5 z-40 transition-all duration-300 ${
          showBackToTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          title="بازگشت به بالای صفحه"
          aria-label="بازگشت به بالای صفحه"
          className="w-11 h-11 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/15 text-cyan-400 shadow-xl shadow-black/50 flex items-center justify-center active:scale-95 transition-all duration-200 hover:border-cyan-500/40"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

