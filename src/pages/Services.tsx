import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  ArrowUpLeft, 
  HelpCircle, 
  Film, 
  Layers, 
  Layout, 
  PenTool 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SEO } from '../components/common/SEO';

export const Services: React.FC = () => {
  const faqs = [
    {
      q: 'آیا ویدیوها و تیزرهای تبلیغاتی دارای حق استفاده تجاری انحصاری برای برند ما هستند؟',
      a: 'بله کاملاً. کلیه فایل‌های نهایی، راش‌ها، تیزرها و طراحی‌ها پس از تسویه نهایی دارای حق استفاده تجاری ۱۰۰٪ انحصاری برای کارفرما بوده و متعلق به برند شماست.'
    },
    {
      q: 'زمان تحویل معمول یک فیلم یا تیزر تبلیغاتی چقدر است؟',
      a: 'بسته به پیچیدگی سناریو و نوع پروژه (فیلمبرداری، رندرهای سه‌بعدی، جلوه‌های بصری)، پروژه‌ها معمولاً بین ۷ تا ۲۰ روز کاری پس از تأیید سناریو و استوری‌بورد تحویل نهایی می‌شوند.'
    },
    {
      q: 'آیا وب‌سایت‌های طراحی‌شده توسط استودیو هورام روی سرورهای داخلی و اینترنت ملی پایدار هستند؟',
      a: 'دقیقاً. تمامی وب‌سایت‌ها با مدرن‌ترین فناوری‌ها (React, TypeScript, Next.js) بدون اتکا به سرویس‌های تحریم‌شده یا فیلترپذیر پیاده‌سازی شده و بالاترین سرعت لود و دسترسی پایدار را برای کاربران داخل ایران و بین‌الملل دارند.'
    },
    {
      q: 'فرآیند ثبت سفارش و شروع همکاری چگونه انجام می‌شود؟',
      a: 'کافی است فرم استعلام آنلاین را تکمیل فرمایید. ظرف حداکثر ۲۴ ساعت کاری جلسه مشاوره و بریفینگ تلفنی یا حضوری هماهنگ شده و پروپوزال شفاف مالی و زمان‌بندی ارائه خواهد شد.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      <SEO
        title="خدمات تخصصی استودیو تبلیغاتی هورام | تولید تیزر ویدیویی، طراحی وب‌سایت و کمپین"
        description="ارائه تخصصی خدمات تولید فیلم و تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه پلتفرم و سایت‌های شرکتی، و اجرای کمپین‌های تبلیغاتی ۳۶۰ درجه در استودیو هورام."
        keywords={[
          'خدمات تبلیغاتی',
          'ساخت تیزر تبلیغاتی',
          'طراحی وب سایت اختصاصی',
          'فیلم تبلیغاتی تجاری',
          'کمپین ۳۶۰ درجه',
          'هزینه ساخت تیزر تبلیغاتی'
        ]}
        schema={faqSchema}
      />
      {/* Header */}
      <div id="services-header" className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="accent">ارائه خدمات استودیویی</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
          خدمات تخصصی استودیو تبلیغاتی هورام
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          دو دپارتمان تخصصی در خدمت ساخت تجربه بصری ماندگار و رشد پایدار برند شما در بازار ایران.
        </p>
      </div>

      {/* Main Divisions */}
      <div className="space-y-16">
        {/* Service 1: Video Production */}
        <div
          id="service-video"
          className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-indigo-400 block tracking-wider">
                    DIVISION A | ADVERTISING VIDEO PRODUCTION
                  </span>
                  <span className="text-xs text-slate-400">دپارتمان تولید تصویر و ویدیو</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                تولید فیلم و ویدئوی تبلیغاتی
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                ما با بهره‌گیری از کارگردانی خلاق، استوری‌بورد دقیق، جلوه‌های بصری پیشرفته و تدوین ریتمیک، فیلم‌ها و تیزرهایی خلق می‌کنیم که پیام برند شما را با حداکثر جذابیت به مخاطب منتقل می‌کنند.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-400" />
                  زیرمجموعه خدمات ویدیویی:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'تیزرهای تبلیغاتی تجاری (Commercial Videos)',
                    'فیلم‌های معرفی محصول (Product Commercials)',
                    'ویدئوهای برندینگ سازمانی (Brand Films)',
                    'تبلیغات سینمایی و تلویزیونی (Cinematic Commercials)',
                    'محتوای تبلیغاتی سوشال مدیا (Social Ads & Reels)',
                    'استوری‌تلینگ و روایت‌های برندی (Creative Storytelling)',
                    'انیمیشن‌های سه‌بعدی و جلوه‌های ویژه رایانه‌ای (VFX)'
                  ].map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-start gap-2 p-3 rounded-xl bg-studio-900/60 border border-slate-800/80 text-xs text-slate-200"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 lg:border-r lg:border-slate-800 lg:pr-8">
              <div className="p-6 rounded-2xl bg-studio-900/70 border border-slate-800/90 space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  استاندارد تحویل ویدیو
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">• کیفیت خروجی مستر 4K UHD</li>
                  <li className="flex items-center gap-2">• اصلاح رنگ سینمایی در DaVinci Resolve</li>
                  <li className="flex items-center gap-2">• صداگذاری فراگیر و نریشن با گویندگان برجسته</li>
                  <li className="flex items-center gap-2">• نسخه‌های بهینه‌شده عمودی (۹:۱۶) و افقی (۱۶:۹)</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-studio-900 border border-indigo-500/20 space-y-4 text-center">
                <span className="text-xs text-slate-300 block">
                  نیازمند ساخت تیزر تبلیغاتی برای محصول خود هستید؟
                </span>
                <Button
                  to="/contact?service=تولید ویدئوی تبلیغاتی"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  icon={<ArrowUpLeft className="w-4 h-4" />}
                  iconPosition="end"
                >
                  ثبت استعلام فیلم تبلیغاتی
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Service 2: Website Design & Development */}
        <div
          id="service-web"
          className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 block tracking-wider">
                    DIVISION B | WEBSITE DESIGN & DEVELOPMENT
                  </span>
                  <span className="text-xs text-slate-400">دپارتمان وب و محصول دیجیتال</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                طراحی و توسعه وب‌سایت‌های حرفه‌ای
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                وب‌سایت شما ویترین رسمی و قلب تپنده حضور دیجیتال برندتان است. ما با رویکرد طراحی اختصاصی در فیگما و کدنویسی پیشرفته، وب‌سایت‌هایی سریع، امن و با نرخ تبدیل استثنایی خلق می‌کنیم.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layout className="w-4 h-4 text-cyan-400" />
                  زیرمجموعه خدمات وب:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'طراحی سایت‌های شرکتی و سازمانی (Corporate Websites)',
                    'طراحی فروشگاه‌های آنلاین مدرن (E-commerce Platforms)',
                    'لندینگ‌پیج‌های پرسرعت برای کمپین‌های تبلیغاتی (Landing Pages)',
                    'طراحی اختصاصی رابط و تجربه کاربری (Bespoke UI/UX Design)',
                    'توسعه وب‌اپلیکیشن‌های سفارشی تجاری (Custom Business Apps)',
                    'سایت‌های معرفی محصول و خدمت (Product Showcase Websites)'
                  ].map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-start gap-2 p-3 rounded-xl bg-studio-900/60 border border-slate-800/80 text-xs text-slate-200"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 lg:border-r lg:border-slate-800 lg:pr-8">
              <div className="p-6 rounded-2xl bg-studio-900/70 border border-slate-800/90 space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  استاندارد مهندسی وب هورام
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">• طراحی ۱۰۰٪ اختصاصی بدون قالب آماده</li>
                  <li className="flex items-center gap-2">• رعایت دقیق استانداردهای سئو تکنیکال (Technical SEO)</li>
                  <li className="flex items-center gap-2">• سرعت بارگذاری زیر ۱.۵ ثانیه و بهینه‌سازی کامل موبایل</li>
                  <li className="flex items-center gap-2">• اتصال به درگاه‌های پرداخت بانکی و پنل مدیریت اختصاصی</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-studio-900 border border-cyan-500/20 space-y-4 text-center">
                <span className="text-xs text-slate-300 block">
                  نیازمند بازطراحی یا ساخت وب‌سایت برند خود هستید؟
                </span>
                <Button
                  to="/contact?service=طراحی و توسعه وب‌سایت"
                  variant="secondary"
                  size="md"
                  className="w-full justify-center"
                  icon={<ArrowUpLeft className="w-4 h-4" />}
                  iconPosition="end"
                >
                  استعلام هزینه طراحی وب‌سایت
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Complementary Service: Creative Campaigns & Concepts */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 bg-studio-900/40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="text-xs font-mono text-amber-400 block font-bold">
                COMPLEMENTARY SERVICE | کمپین‌های خلاقانه و سناریو
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                ایده‌پردازی کمپین، سناریونویسی و استوری‌بورد
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                پیش از ورود به مرحله تصویربرداری یا کدنویسی، هسته پیام تبلیغاتی برند شما با خلاقیت اتاق فکر هورام فرموله می‌شود. نگارش فیلم‌نامه‌های اثرگذار، طراحی استوری‌بوردهای فریم‌به‌فریم و کی‌ویژوال‌های بیلبورد و سوشال مدیا.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <Button to="/contact?service=کمپین‌های خلاقانه و سناریو" variant="outline" size="md">
                مشاوره ایده و کمپین
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <section id="services-faq" className="pt-8 border-t border-slate-800/80 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="primary">پاسخ به ابهامات</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            پرسش‌های متداول کارفرمایان
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-studio-900/50 border border-slate-800/80 space-y-3"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <h4 className="text-sm font-bold text-white leading-relaxed">
                  {faq.q}
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pr-8 font-light">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center py-10 bg-studio-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          نیاز به پکیج ۳۶۰ درجه (فیلم تبلیغاتی + وب‌سایت) دارید؟
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          برای راه‌اندازی برند جدید یا ری‌برندینگ، امکان ادغام خدمات در یک قرارداد یکپارچه با هماهنگی کامل هویت بصری وجود دارد.
        </p>
        <Button to="/contact?service=پکیج جامع ۳۶۰ درجه (ویدیو + وب‌سایت)" variant="primary" size="md">
          درخواست جلسه مشاوره اختصاصی
        </Button>
      </div>
    </div>
  );
};
