import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Film, 
  HelpCircle, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { InstagramIcon, LinkedinIcon, TelegramIcon } from '../components/ui/SocialIcons';
import { SEO } from '../components/common/SEO';
import { api } from '../services/api';
import { StudioSettings } from '../types';

export const Contact: React.FC = () => {
  const location = useLocation();
  const [settings, setSettings] = useState<StudioSettings | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    brandName: '',
    phoneNumber: '',
    email: '',
    service: 'تولید فیلم و ویدئوی تبلیغاتی',
    description: '',
    budget: '۵۰ تا ۱۰۰ میلیون تومان',
    referenceLink: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ message: string; inquiryId?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load studio settings:', err);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [location.search]);

  const serviceOptions = [
    'تولید فیلم و ویدئوی تبلیغاتی',
    'طراحی و توسعه وب‌سایت',
    'پکیج جامع ۳۶۰ درجه (ویدیو + وب‌سایت)',
    'کمپین‌های خلاقانه و سناریو',
    'سایر خدمات / مشاوره اختصاصی',
  ];

  const budgetOptions = [
    '۲۰ تا ۵۰ میلیون تومان',
    '۵۰ تا ۱۰۰ میلیون تومان',
    '۱۰۰ تا ۲۰۰ میلیون تومان',
    'بالای ۲۰۰ میلیون تومان',
    'توافقی / نیاز به برآورد استودیو',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessResponse(null);

    // Client-side quick validation
    if (!formData.fullName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }

    const cleanPhone = formData.phoneNumber.replace(/\s+/g, '');
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMessage('لطفاً شماره موبایل معتبر ۱۱ رقمی (مثال: 09121234567) وارد نمایید.');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setErrorMessage('لطفاً توضیحات مختصری درباره پروژه (حداقل ۱۰ کاراکتر) ارائه فرمایید.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.submitInquiry(formData);
      setSuccessResponse(response);
      setFormData({
        fullName: '',
        brandName: '',
        phoneNumber: '',
        email: '',
        service: 'تولید فیلم و ویدئوی تبلیغاتی',
        description: '',
        budget: '۵۰ تا ۱۰۰ میلیون تومان',
        referenceLink: '',
      });
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'خطایی در ارسال فرم رخ داد. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <SEO
        title="ثبت استعلام آنلاین پروژه و مشاوره | استودیو تبلیغاتی هورام"
        description="فرم آنلاین ثبت استعلام تولید فیلم و تیزر تبلیغاتی، استعلام هزینه ساخت ویدیوهای هوش مصنوعی و طراحی وب‌سایت. پاسخگویی و مشاوره تخصصی ظرف ۲۴ ساعت کاری."
        keywords={[
          'استعلام هزینه تیزر تبلیغاتی',
          'قیمت ساخت تیزر',
          'تماس با استودیو تبلیغاتی',
          'سفارش ساخت تیزر',
          'مشاوره تبلیغات هوش مصنوعی'
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'تماس و استعلام آنلاین پروژه در استودیو تبلیغاتی هورام',
          description: 'فرم ثبت استعلام و سفارش تیزرهای تبلیغاتی و طراحی وب‌سایت.'
        }}
      />
      {/* Header */}
      <div id="contact-header" className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="accent">استعلام و درخواست همکاری</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
          شروع خلق پروژه‌ای ماندگار
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          برای سفارش تولید فیلم تبلیغاتی، ساخت تیزر محصول یا طراحی وب‌سایت، اطلاعات اولیه را وارد فرمایید؛ کارشناسان ارشد استودیو ظرف ۲۴ ساعت کاری با شما تماس خواهند گرفت.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form Column (7 Cols) */}
        <div id="contact-form" className="lg:col-span-7">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-800 relative">
            {successResponse ? (
              <div className="text-center py-12 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">درخواست شما با موفقیت ثبت شد!</h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  {successResponse.message}
                </p>
                {successResponse.inquiryId && (
                  <div className="inline-block px-4 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-indigo-400 font-mono">
                    کد پیگیری استعلام: {successResponse.inquiryId}
                  </div>
                )}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSuccessResponse(null)}
                  >
                    ثبت یک درخواست دیگر
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-slate-800/80 pb-4">
                  <h3 className="text-lg font-bold text-white">فرم استعلام آنلاین پروژه</h3>
                  <p className="text-xs text-slate-400 mt-1">فیلدهای دارای ستاره الزامی هستند.</p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="مثال: آرش رحیمی"
                      className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      نام برند یا شرکت
                    </label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      placeholder="مثال: هلدینگ پارس صنعت"
                      className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      شماره تماس (موبایل) *
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="09121234567"
                      className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      آدرس ایمیل (اختیاری)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                    />
                  </div>
                </div>

                {/* Required Service */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    خدمت مورد نظر *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {serviceOptions.map((opt, i) => (
                      <option key={i} value={opt} className="bg-studio-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    حدود بودجه مدنظر برای پروژه (اختیاری)
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {budgetOptions.map((opt, i) => (
                      <option key={i} value={opt} className="bg-studio-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    شرح پروژه و نیازمندی‌ها *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="لطفاً در چند جمله درباره محصول، هدف از ساخت فیلم تبلیغاتی یا ویژگی‌های وب‌سایت مدنظرتان توضیح دهید..."
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
                  ></textarea>
                </div>

                {/* Reference Link */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    لینک نمونه یا رفرنس مشابه (اختیاری)
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    value={formData.referenceLink}
                    onChange={(e) => setFormData({ ...formData, referenceLink: e.target.value })}
                    placeholder="https://... لینک ویدیو یا وب‌سایت رفرنس"
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full justify-center shadow-lg shadow-indigo-600/30"
                    icon={<Send className="w-4 h-4 ml-1" />}
                    iconPosition="start"
                  >
                    {isSubmitting ? 'در حال ارسال و ثبت اطلاعات...' : 'ارسال درخواست همکاری و استعلام'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Studio Info Column (5 Cols) */}
        <div id="contact-info" className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-400" />
                {settings?.studioName || 'استودیو تبلیغاتی هورام'}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                همراه اختصاصی برندها در تولید تیزرها و فیلم‌های تبلیغاتی سینمایی و طراحی وب‌سایت‌های مدرن شرکتی و سازمانی.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              {/* Mobile Phone */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-studio-900/60 border border-slate-800 hover:border-cyan-500/30 transition-colors">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">شماره همراه و ارتباط مستقیم:</span>
                  <a href="tel:09128548623" dir="ltr" className="font-vazir hover:text-cyan-400 transition-colors text-white font-bold text-sm tracking-wider">
                    ۰۹۱۲۸۵۴۸۶۲۳
                  </a>
                </div>
              </div>

              {/* Email */}
              {settings?.email ? (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-studio-900/60 border border-slate-800">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">پست الکترونیک رسمی:</span>
                    <a href={`mailto:${settings.email}`} dir="ltr" className="font-mono hover:text-amber-400 transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Working Hours */}
              {settings?.workingHours ? (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-studio-900/60 border border-slate-800">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">ساعات کاری استودیو:</span>
                    <span>{settings.workingHours}</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-semibold text-white block">شبکه‌های اجتماعی رسمی استودیو:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Instagram */}
                {settings?.instagram ? (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-studio-900 hover:bg-pink-950/40 text-pink-400 border border-slate-800 hover:border-pink-500/40 transition-all text-xs font-medium group"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span>اینستاگرام</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-studio-950 text-slate-600 border border-slate-800/60 text-xs cursor-not-allowed">
                    <InstagramIcon className="w-4 h-4 opacity-40" />
                    <span>اینستاگرام (به‌زودی)</span>
                  </div>
                )}

                {/* LinkedIn */}
                {settings?.linkedin ? (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-studio-900 hover:bg-blue-950/40 text-blue-400 border border-slate-800 hover:border-blue-500/40 transition-all text-xs font-medium group"
                  >
                    <LinkedinIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>لینکدین</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-studio-950 text-slate-600 border border-slate-800/60 text-xs cursor-not-allowed">
                    <LinkedinIcon className="w-4 h-4 opacity-40" />
                    <span>لینکدین (به‌زودی)</span>
                  </div>
                )}

                {/* Telegram */}
                {settings?.telegram ? (
                  <a
                    href={settings.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-studio-900 hover:bg-cyan-950/40 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs font-medium group"
                  >
                    <TelegramIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>تلگرام</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-studio-950 text-slate-600 border border-slate-800/60 text-xs cursor-not-allowed">
                    <TelegramIcon className="w-4 h-4 opacity-40" />
                    <span>تلگرام (به‌زودی)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick FAQ / Note */}
          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              پس از ارسال استعلام چه خواهد شد؟
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              کارشناس هماهنگی پروژه‌های استودیو هورام اطلاعات شما را به کارگردان و مدیر فنی مربوطه ارجاع می‌دهد و حداکثر ظرف ۲۴ ساعت کاری جهت تعیین زمان جلسه آنلاین یا بررسی جزئیات بریف با شما تماس خواهد گرفت.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
