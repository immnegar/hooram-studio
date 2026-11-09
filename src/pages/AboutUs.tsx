import React from 'react';
import { 
  Film, 
  Lightbulb, 
  Target, 
  ShieldCheck, 
  Users, 
  ArrowUpLeft, 
  Award, 
  HeartHandshake 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

export const AboutUs: React.FC = () => {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-24">
      <SEO
        title="درباره استودیو تبلیغاتی هورام | فلسفه، مانیفست و هویت برند"
        description="آشنایی با فلسفه، مانیفست و ارزش‌های استودیو تبلیغاتی هورام؛ نگاه استراتژیک ما به تولید تیزر، طراحی وب‌سایت و خلق روایت‌های خلاق برای برندهای پیشرو."
        keywords={[
          'درباره استودیو هورام',
          'آژانس تبلیغاتی تهران',
          'استودیو خلاقیت',
          'مانیفست تبلیغاتی',
          'تیم تبلیغاتی هورام'
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'درباره استودیو تبلیغاتی هورام',
          description: 'فلسفه نام‌گذاری، مانیفست و تعهدات استودیو هورام به خلق ارزش تجاری و هنری.'
        }}
      />
      {/* Hero / Intro */}
      <div id="about-hero" className="text-center max-w-3xl mx-auto space-y-6">
        <Badge variant="accent">درباره استودیو تبلیغاتی هورام</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
          خلق آثاری که در ذهن مخاطب <span className="gradient-accent-text">ماندگار می‌شوند</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          «هورام» در ریشه اصیل زبان فارسی نماد آزادگی اندیشه، روشنایی و خرمی است. ما این نام را برگزیدیم تا رویکرد خلاقانه، پویا و شورانگیز خود را در عرصه تبلیغات، تولید فیلم‌های تجاری و توسعه وب‌سایت‌های سازمانی بازتاب دهیم.
        </p>
      </div>

      {/* Manifesto Box */}
      <div id="about-manifesto" className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-14 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-center sm:text-right">
          <span className="text-xs font-mono text-cyan-400 block tracking-widest text-center">
            OUR MANIFESTO | مانیفست استودیو
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
            تعهد هورام به اصالت، خلاقیت و نتایج ملموس تجاری
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            در دنیای پرهیاهوی امروز که مخاطبان روزانه با هزاران پیام تبلیغاتی بمباران می‌شوند، ساخت یک محتوای معمولی دیگر دیده نمی‌شود. برندها نیازمند تمایز بنیادین هستند؛ تمایزی که از داستان‌سرایی اصیل، تصویربرداری استاندارد و خلق تجربه‌های آنلاین بی‌نقص سرچشمه می‌گیرد.
          </p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            در استودیو تبلیغاتی هورام، ما فراتر از یک مجری سفارش عمل می‌کنیم؛ ما شریک استراتژیک برند شما در طراحی پیام، ساخت هویت بصری، کارگردانی فیلم‌های تبلیغاتی و کدنویسی وب‌سایت‌های مدرن هستیم. هر پروژه برای ما فرصتی برای خلق یک اثر هنری ماندگار و ایجاد یک جهش تجاری واقعی برای کارفرماست.
          </p>
        </div>
      </div>

      {/* 4 Pillars */}
      <div id="about-pillars" className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="primary">اصول بنیادین هورام</Badge>
          <h2 className="text-3xl font-bold text-white">
            چهار ستون ارزش‌آفرینی ما
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-studio-900/50 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">۱. استاندارد سینمایی و زیبایی‌شناسی دقیق</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              کیفیت بصری سازش‌ناپذیر است. تمامی ویدیوها با وسواس کارگردانی هنری، نورپردازی تخصصی، طراحی حرکت و اصلاح رنگ حرفه‌ای در سطح استانداردهای تراز اول دنیا ارائه می‌شوند.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-studio-900/50 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">۲. بومی‌سازی هوشمندانه برای ذائقه ایرانی</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              ما فرهنگ، روانشناسی مصرف و الگوهای رفتاری مخاطب ایرانی را عمیقاً می‌شناسیم و پیام برند شما را به زبانی ترجمه می‌کنیم که در احساسات و تصمیم‌گیری مشتریان نفوذ کند.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-studio-900/50 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">۳. یکپارچگی ویدیو و زیرساخت وب</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              پیوند میان تبلیغات ویدیویی جذاب و لندینگ‌پیج‌های سریع و پربازده باعث می‌شود سرمایه‌گذاری تبلیغاتی شما بیشترین نرخ تبدیل مشتری و وفاداری را رقم بزند.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-studio-900/50 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">۴. شفافیت و تعهد به بازگشت سرمایه (ROI)</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              ما برنامه‌ریزی مالی و زمان‌بندی دقیق را پیش‌شرط هر همکاری می‌دانیم و موفقیت واقعی پروژه را در میزان رشد فروش و محبوبیت برند کارفرما می‌سنجیم.
            </p>
          </div>
        </div>
      </div>

      {/* Team Disciplines */}
      <div className="p-8 sm:p-12 rounded-3xl bg-studio-900/30 border border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <Badge variant="secondary">ساختار تیمی هورام</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">متخصصان گرد‌هم‌آمده در هورام</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-studio-950 border border-slate-800/80 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center text-sm font-bold">
              ۰۱
            </div>
            <h4 className="text-sm font-bold text-white">کارگردانان هنری و سینما</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              نظارت بر ترکیب‌بندی، زیبایی‌شناسی بصری، زاویه‌های دوربین و هدایت صحنه.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-studio-950 border border-slate-800/80 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center text-sm font-bold">
              ۰۲
            </div>
            <h4 className="text-sm font-bold text-white">توسعه‌دهندگان ارشد وب</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              متخصصان پیاده‌سازی سریع‌ترین وب‌سایت‌های مدرن، معماری فرانت‌اند و امنیت سرور.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-studio-950 border border-slate-800/80 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center text-sm font-bold">
              ۰۳
            </div>
            <h4 className="text-sm font-bold text-white">طراحان رابط کاربری (UI/UX)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              خلق هویت‌های تعاملی منحصربه‌فرد در فیگما با تمرکز بر سهولت استفاده مخاطب.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-studio-950 border border-slate-800/80 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center text-sm font-bold">
              ۰۴
            </div>
            <h4 className="text-sm font-bold text-white">فیلم‌نامه‌نویسان و استراتژیست‌ها</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              نگارش سناریوهای اقناعی و تدوین طرح کمپین با انطباق بر نیاز بازار کسب‌وکار.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div id="about-cta" className="text-center space-y-6 pt-6">
        <h3 className="text-2xl font-bold text-white">مشتاق همکاری با برند شما هستیم</h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          برای گفت‌وگو پیرامون ساخت فیلم تبلیغاتی بعدی یا طراحی وب‌سایت برندتان، با ما در تماس باشید.
        </p>
        <Button to="/contact" variant="primary" size="lg">
          درخواست جلسه مشاوره و استعلام پروژه
        </Button>
      </div>
    </div>
  );
};
