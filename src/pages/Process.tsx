import React from 'react';
import { 
  FileText, 
  Palette, 
  Clapperboard, 
  Sliders, 
  Rocket, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ArrowUpLeft 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

export const Process: React.FC = () => {
  const steps = [
    {
      number: '۰۱',
      title: 'کشف، دریافت بریف و تحلیل استراتژیک',
      englishTitle: 'Discovery & Strategic Briefing',
      icon: <FileText className="w-6 h-6 text-indigo-400" />,
      timeframe: '۱ تا ۲ روز کاری',
      description: 'در نخستین گام، پرسشنامه‌ای استاندارد در اختیار شما قرار می‌گیرد و طی یک جلسه استراتژیک، هویت برند، مزیت‌های رقابتی محصول، پرسونای مخاطب هدف در بازار ایران و بودجه مدنظر مشخص می‌شود.',
      deliverables: [
        'سند مکتوب اهداف و استراتژی پروژه (Creative Brief)',
        'تحلیل رقبای داخلی و استانداردهای بصری مارکت',
        'تعیین شاخص‌های کلیدی موفقیت (KPI) پروژه'
      ],
      clientRole: 'تکمیل بریف و انتقال خط قرمزها و ویژگی‌های کلیدی محصول یا خدمت.'
    },
    {
      number: '۰۲',
      title: 'ایده‌پردازی، سناریو و استوری‌بورد فریم‌به‌فریم',
      englishTitle: 'Concept, Scriptwriting & Storyboarding',
      icon: <Palette className="w-6 h-6 text-cyan-400" />,
      timeframe: '۲ تا ۳ روز کاری',
      description: 'اتاق فکر استودیو هورام سناریوهای خلاقانه را تدوین می‌کند. سپس استوری‌بورد تصویری فریم‌به‌فریم آماده می‌شود تا شما قبل از هرگونه ساخت نهایی، دقیقاً چیدمان صحنه‌ها و ریتم روایی اثر را مشاهده و تأیید فرمایید.',
      deliverables: [
        'سناریوهای متمایز با زوایای روایی تأثیرگذار',
        'استوری‌بورد مصور فریم‌به‌فریم نماهای کلیدی',
        'متن نریشن، لحن گویندگی و مشخصات موسیقی متن'
      ],
      clientRole: 'انتخاب کانسپت نهایی و ارائه بازخورد روی استوری‌بورد.'
    },
    {
      number: '۰۳',
      title: 'تولید، تصویربرداری یا کدنویسی فنی',
      englishTitle: 'Production, Cinematography & Web Engineering',
      icon: <Clapperboard className="w-6 h-6 text-purple-400" />,
      timeframe: '۳ تا ۷ روز کاری',
      description: 'با تأیید سناریو، فرآیند تصویربرداری، رندرهای سه‌بعدی و موشن‌گرافیک برای تیزرها، یا طراحی رابط کاربری در فیگما و کدنویسی فرانت‌اند برای وب‌سایت‌ها آغاز می‌شود.',
      deliverables: [
        'تصویربرداری و رندر نماهای با کیفیت سینمایی 4K',
        'طراحی پروتوتایپ تعاملی وب‌سایت در فیگما',
        'کدنویسی سریع و بدون باگ فرانت‌اند با استانداردهای نوین'
      ],
      clientRole: 'بازبینی راف‌کات اولیه ویدیو یا پیش‌نمایش طرح وب‌سایت.'
    },
    {
      number: '۰۴',
      title: 'تدوین سینمایی، اصلاح رنگ و مهندسی صدا',
      englishTitle: 'Cinema Mastering, Color Grading & Sound FX',
      icon: <Sliders className="w-6 h-6 text-amber-400" />,
      timeframe: '۲ تا ۳ روز کاری',
      description: 'ویدیوها وارد اتاق تدوین حرفه‌ای می‌شوند؛ اصلاح رنگ سینمایی در DaVinci Resolve، میکس و مسترینگ صدا، ضبط نریشن استودیویی و موشن‌گرافیک‌های فارسی افزوده می‌گردد.',
      deliverables: [
        'اصلاح رنگ حرفه‌ای متناسب با پالت رنگی برند',
        'طراحی باند صوتی اختصاصی و افکت‌های محیطی فراگیر',
        'تست عملکردی و امنیت کامل صفحات وب‌سایت'
      ],
      clientRole: 'مشاهده نسخه ماقبل نهایی و اعلام اصلاحات جزئی احتمالی.'
    },
    {
      number: '۰۵',
      title: 'تحویل مستر چندرسانه‌ای و لانچ پروژه',
      englishTitle: 'Final Multi-Format Delivery & Launch',
      icon: <Rocket className="w-6 h-6 text-emerald-400" />,
      timeframe: '۱ روز کاری',
      description: 'پروژه در بالاترین رزولوشن ممکن (4K Master) با نسخه‌های بهینه‌شده برای تلویزیون، وب‌سایت، اینستاگرام و یوتیوب تحویل داده شده و وب‌سایت روی دامنه و هاست اصلی کارفرما مستقر می‌شود.',
      deliverables: [
        'فایل‌های اصلی با کیفیت مستر بدون افت کیفیت',
        'بسته‌های بهینه‌شده عمودی (۹:۱۶)، افقی (۱۶:۹) و مربعی',
        'انتقال کامل حق بهره‌برداری تجاری بدون انقضا'
      ],
      clientRole: 'دریافت مستر نهایی و آغاز اکران سراسری کمپین.'
    }
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
      <SEO
        title="فرآیند ۵ مرحله‌ای تولید اثر و طراحی | استودیو تبلیغاتی هورام"
        description="نقشه راه و مراحل گام به گام همکاری با استودیو هورام؛ از بریفینگ استراتژیک و سناریونویسی تا پیش‌تولید، تولید ژنراتیو، تدوین سینمایی و تحویل نهایی."
        keywords={[
          'مراحل ساخت تیزر تبلیغاتی',
          'فرآیند تولید ویدیو تجاری',
          'سناریونویسی تبلیغاتی',
          'استوری بورد',
          'نحوه سفارش تیزر'
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'فرآیند ۵ مرحله‌ای تولید اثر و تیزر در استودیو هورام',
          step: steps.map(s => ({
            '@type': 'HowToStep',
            name: s.title,
            text: s.description
          }))
        }}
      />
      {/* Intro */}
      <div id="process-header" className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="accent">متدولوژی اجرایی هورام</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
          فرآیند شفاف و مهندسی‌شده همکاری
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          ما فرآیند تولید فیلم‌های تبلیغاتی و طراحی وب‌سایت را به یک مسیر ۵ مرحله‌ای مشخص، سریع و بدون غافلگیری تبدیل کرده‌ایم.
        </p>
      </div>

      {/* Steps List */}
      <div id="process-steps" className="space-y-10 relative">
        <div className="hidden lg:block absolute right-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-indigo-500 via-cyan-500 to-emerald-500 opacity-20 pointer-events-none"></div>

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 relative overflow-hidden space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-studio-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">گام {step.number}</span>
                    <span className="text-xs font-mono text-slate-500">|</span>
                    <span className="text-xs font-mono text-slate-400">{step.englishTitle}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {step.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-studio-900/80 border border-slate-800 text-xs text-slate-300 w-fit">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>زمان معمول: {step.timeframe}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              {step.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  خروجی‌های تحویلی این مرحله:
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {step.deliverables.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-studio-900/60 border border-slate-800/80 space-y-1.5">
                <h5 className="text-xs font-bold text-slate-300">نقش کارفرما در این مرحله:</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{step.clientRole}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assurance Box */}
      <div id="process-cta" className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 text-center max-w-3xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">تضمین کیفیت و پشتیبانی مستمر</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          ما در تمام مراحل تا حصول رضایت کامل کارفرما بر اساس شاخص‌های توافق‌شده متعهد هستیم و پس از تحویل نهایی نیز در کنار برند شما باقی می‌مانیم.
        </p>
        <div className="pt-2">
          <Button to="/contact" variant="primary" size="md">
            شروع پروژه با ثبت درخواست اولیه
          </Button>
        </div>
      </div>
    </div>
  );
};
