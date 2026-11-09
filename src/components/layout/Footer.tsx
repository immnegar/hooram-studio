import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Phone, Mail, Clock, ArrowUpLeft } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, TelegramIcon } from '../ui/SocialIcons';
import { api } from '../../services/api';
import { StudioSettings } from '../../types';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleNav = (targetPath: string, hashId?: string) => {
    if (hashId) {
      if (location.pathname === targetPath) {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      if (location.pathname === targetPath) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-studio-900 border-t border-slate-800/80 pt-16 pb-28 md:pb-14 text-slate-400 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 & 2: Brand Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-studio-950 rounded-[11px] flex items-center justify-center">
                  <Film className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white font-vazir">استودیو تبلیغاتی هورام</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
              استودیو خلاق و تخصصی ساخت تیزرها و فیلم‌های تبلیغاتی سینمایی، طراحی و توسعه وب‌سایت‌های حرفه‌ای سازمانی و اجرای کمپین‌های تأثیرگذار برای برندهای پیشرو ایرانی.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                پذیرش پروژه‌های تبلیغاتی و طراحی وب فصل جاری
              </span>
            </div>

            {/* Official Social Media Links */}
            <div className="pt-2">
              <span className="text-xs text-slate-500 block mb-2 font-medium">شبکه‌های اجتماعی رسمی:</span>
              <div className="flex items-center gap-2">
                {settings?.instagram ? (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="اینستاگرام هورام استودیو"
                    className="w-9 h-9 rounded-xl bg-studio-950 border border-slate-800 hover:border-pink-500/50 hover:bg-pink-950/20 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all shadow-sm group"
                  >
                    <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                ) : (
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="اینستاگرام هورام استودیو"
                    className="w-9 h-9 rounded-xl bg-studio-950 border border-slate-800 hover:border-pink-500/50 hover:bg-pink-950/20 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all shadow-sm group"
                  >
                    <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                )}

                {settings?.linkedin ? (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="صفحه لینکدین هورام استودیو"
                    className="w-9 h-9 rounded-xl bg-studio-950 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-950/20 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all shadow-sm group"
                  >
                    <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                ) : (
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="صفحه لینکدین هورام استودیو"
                    className="w-9 h-9 rounded-xl bg-studio-950 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-950/20 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all shadow-sm group"
                  >
                    <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                )}

                {settings?.telegram ? (
                  <a
                    href={settings.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="کانال تلگرام هورام استودیو"
                    className="w-9 h-9 rounded-xl bg-studio-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all shadow-sm group"
                  >
                    <TelegramIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                ) : (
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="کانال تلگرام هورام استودیو"
                    className="w-9 h-9 rounded-xl bg-studio-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all shadow-sm group"
                  >
                    <TelegramIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 3: Two Main Service Pillars (دو بخش اصلی خدمات) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider">دو بخش اصلی خدمات</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services#service-video"
                  onClick={() => handleNav('/services', 'service-video')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5 text-indigo-500" />
                  تولید فیلم و ویدئوی تبلیغاتی
                </Link>
              </li>
              <li>
                <Link
                  to="/services#service-video"
                  onClick={() => handleNav('/services', 'service-video')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5 text-indigo-500" />
                  فیلم‌های معرفی محصول و تجاری
                </Link>
              </li>
              <li>
                <Link
                  to="/services#service-web"
                  onClick={() => handleNav('/services', 'service-web')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5 text-indigo-500" />
                  طراحی و توسعه وب‌سایت‌های اختصاصی
                </Link>
              </li>
              <li>
                <Link
                  to="/services#service-web"
                  onClick={() => handleNav('/services', 'service-web')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5 text-indigo-500" />
                  طراحی لندینگ‌پیج و فروشگاه آنلاین
                </Link>
              </li>
              <li>
                <Link
                  to="/services#service-concept"
                  onClick={() => handleNav('/services', 'service-concept')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5 text-indigo-500" />
                  ایده‌پردازی کمپین و استوری‌بورد
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links (دسترسی سریع) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/portfolio"
                  onClick={() => handleNav('/portfolio')}
                  className="hover:text-indigo-400 transition-colors block py-1"
                >
                  آرشیو پروژه‌ها و شو‌ریل
                </Link>
              </li>
              <li>
                <Link
                  to="/process"
                  onClick={() => handleNav('/process')}
                  className="hover:text-indigo-400 transition-colors block py-1"
                >
                  فرآیند ۵ مرحله‌ای همکاری
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => handleNav('/about')}
                  className="hover:text-indigo-400 transition-colors block py-1"
                >
                  درباره استودیو تبلیغاتی هورام
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => handleNav('/contact')}
                  className="hover:text-indigo-400 transition-colors block py-1"
                >
                  استعلام آنلاین هزینه و مشاوره
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider">ارتباط با استودیو</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a 
                  href="tel:09128548623" 
                  dir="ltr" 
                  className="font-vazir hover:text-cyan-400 transition-colors text-white font-medium text-sm tracking-wider"
                >
                  ۰۹۱۲۸۵۴۸۶۲۳
                </a>
              </li>

              {settings?.email ? (
                <li className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`mailto:${settings.email}`} dir="ltr" className="hover:text-amber-400 transition-colors">
                    {settings.email}
                  </a>
                </li>
              ) : null}

              {settings?.workingHours ? (
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{settings.workingHours}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} استودیو تبلیغاتی هورام. تمامی حقوق مادی و معنوی محفوظ است.</p>
          <div className="flex items-center gap-6">
            <span>تولید تیزرهای تبلیغاتی سینمایی</span>
            <span className="text-slate-600">|</span>
            <span>طراحی و توسعه وب‌سایت‌های حرفه‌ای</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
