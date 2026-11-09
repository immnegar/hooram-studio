import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  ArrowUpLeft, 
  Play, 
  Pause,
  Video, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Award,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { PortfolioItem, ServiceItem } from '../types';
import { SEO } from '../components/common/SEO';

export const Home: React.FC = () => {
  const [featuredWorks, setFeaturedWorks] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const processRef = useRef<HTMLElement>(null);

  const chapters = [
    { title: 'فیلم‌های تبلیغاتی', time: 0 },
    { title: 'تیزرهای محصول', time: 4.0 },
    { title: 'طراحی پلتفرم وب', time: 8.0 },
  ];

  // Guarantee autoplay across all desktop and mobile browsers
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, []);

  // Track video progress and chapter updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const cur = video.currentTime;
      if (cur < 4.0) setActiveChapter(0);
      else if (cur < 8.0) setActiveChapter(1);
      else setActiveChapter(2);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Minimal scroll entrance animation for 5-step process section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProcessVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (processRef.current) {
      observer.observe(processRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [portfolioData, servicesData] = await Promise.all([
          api.getPortfolio(),
          api.getServices()
        ]);
        setFeaturedWorks(portfolioData.filter(item => item.featured).slice(0, 4));
        setServices(servicesData);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsMusicPlaying(true))
          .catch((err) => {
            console.warn('Audio playback could not be started:', err);
            setIsMusicPlaying(false);
          });
      }
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const seekChapter = (time: number, index?: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (index !== undefined) {
      setActiveChapter(index);
    }

    try {
      video.currentTime = time;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback after seek interrupted or prohibited:', err);
          });
      }
    } catch (e) {
      console.warn('Seek error:', e);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <SEO
        title="استودیو تبلیغاتی هورام | تولید فیلم‌های تبلیغاتی هوش مصنوعی و طراحی وب‌سایت"
        description="استودیو خلاق هورام؛ خلق تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه وب‌سایت‌های مدرن و کمپین‌های ۳۶۰ درجه برای برندهای پیشرو در ایران."
        keywords={[
          'استودیو تبلیغاتی هورام',
          'تیزر تبلیغاتی هوش مصنوعی',
          'تبلیغات سینمایی ایران',
          'طراحی وب سایت شرکتی',
          'تولید فیلم تبلیغاتی',
          'آژانس خلاقیت هوش مصنوعی'
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'استودیو تبلیغاتی هورام',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://hooram.studio',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${typeof window !== 'undefined' ? window.location.origin : 'https://hooram.studio'}/portfolio?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }}
      />
      {/* ---------------- SECTION A: FULL-WIDTH CINEMATIC SHOWREEL ---------------- */}
      <section id="hero" className="relative w-full pt-20 sm:pt-28 pb-4 bg-studio-950">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-indigo-950/40 border border-slate-800/80 bg-studio-950 group">
            {/* Cinematic Video Player */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/images/hero-poster.jpg"
              className="w-full h-full object-cover filter brightness-95 contrast-105"
            >
              <source src="/videos/hero-showreel.mp4?v=20261103_jewelry" type="video/mp4" />
              <img
                src="/images/hero-poster.jpg"
                alt="شو‌ریل استودیو تبلیغاتی هورام"
                className="w-full h-full object-cover"
              />
            </video>

            {/* Subtle Gradient Overlays for Control Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-studio-950/80 via-transparent to-studio-950/50 pointer-events-none"></div>

            {/* Top Bar: Recording Status & Chapter Navigation */}
            <div className="absolute top-2.5 sm:top-5 left-2.5 sm:left-6 right-2.5 sm:right-6 flex items-center justify-between pointer-events-auto gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-studio-950/85 border border-slate-700/80 backdrop-blur-md text-[10px] sm:text-xs shrink-0">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="font-mono text-rose-400 font-bold">REC</span>
                <span className="text-slate-500 hidden xs:inline">|</span>
                <span className="text-slate-300 font-mono hidden xs:inline">SHOWREEL</span>
              </div>

              {/* Scene Navigation Pills */}
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
                {chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => seekChapter(ch.time, idx)}
                    className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium transition-all backdrop-blur-md whitespace-nowrap ${
                      activeChapter === idx
                        ? 'bg-amber-500 text-studio-950 font-bold shadow-lg shadow-amber-500/20'
                        : 'bg-studio-950/75 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {ch.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Bar: Player Controls & Ambient Music Toggle */}
            <div className="absolute bottom-2.5 sm:bottom-5 left-2.5 sm:left-6 right-2.5 sm:right-6 flex items-center justify-between pointer-events-auto">
              {/* Video Playback Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'توقف پخش ویدیو' : 'ادامه پخش ویدیو'}
                  className="p-2 sm:p-2.5 rounded-full bg-studio-950/80 hover:bg-studio-800 text-white border border-slate-700/80 backdrop-blur-md transition-all shadow-lg hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                </button>

                <button
                  onClick={restartVideo}
                  aria-label="پخش مجدد ویدیو از ابتدا"
                  className="p-2 sm:p-2.5 rounded-full bg-studio-950/80 hover:bg-studio-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all shadow-lg hover:scale-105"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Discreet Speaker / Music Button */}
              <button
                onClick={toggleMusic}
                aria-label={isMusicPlaying ? 'قطع موسیقی استودیو' : 'پخش موسیقی استودیو'}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md border transition-all shadow-lg hover:scale-105 text-xs ${
                  isMusicPlaying
                    ? 'bg-indigo-600/90 hover:bg-indigo-500 text-white border-indigo-400/50 shadow-indigo-500/20'
                    : 'bg-studio-950/80 hover:bg-studio-800 text-slate-300 hover:text-white border-slate-700/80'
                }`}
              >
                {isMusicPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-medium hidden xs:inline text-cyan-200">موسیقی (در حال پخش)</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] sm:text-[11px] font-medium hidden xs:inline text-slate-400">موسیقی استودیو</span>
                  </>
                )}
              </button>
            </div>

            {/* Independent Ambient Background Audio */}
            <audio
              ref={audioRef}
              src="/audio/ambient-music.mp3"
              loop
              preload="auto"
            />
          </div>
        </div>
      </section>

      {/* ---------------- SECTION B: TEXT & CTA CONTENT SECTION ---------------- */}
      <section id="about-intro" className="relative w-full py-10 sm:py-16 lg:py-20 bg-studio-950 overflow-hidden">
        {/* Ambient Glows (High-Contrast Lighting on Mobile, Refined on Desktop) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/20 rounded-full blur-[70px] pointer-events-none -z-10"></div>
        <div className="absolute -top-10 left-1/4 w-44 h-44 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none -z-10 md:hidden"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-8 relative z-10">
          {/* Secondary Studio Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 rounded-full bg-studio-950/80 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] text-[11px] sm:text-xs text-neutral-200 backdrop-blur-md">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold tracking-wider text-white">از تصور تا تأثیرگذاری</span>
            <span className="text-white/20">|</span>
            <span className="text-neutral-400">استودیو تبلیغاتی هورام</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.35] sm:leading-[1.2] drop-shadow-[0_4px_24px_rgba(99,102,241,0.22)]">
            ایده‌های بزرگ، تبلیغات ماندگار
          </h1>

          {/* Supporting Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-neutral-300 leading-relaxed font-light">
            استراتژی، خلاقیت و تولید محتوای تبلیغاتی برای برندهایی که می‌خواهند متفاوت دیده شوند.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Button
              to="/contact"
              size="lg"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xl shadow-indigo-600/35 hover:shadow-indigo-500/50 hover:scale-[1.02] text-sm sm:text-base border-0 transition-all duration-200 py-3 sm:py-3.5"
              icon={<ArrowUpLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              iconPosition="end"
            >
              شروع همکاری
            </Button>
            <Button
              to="/portfolio"
              size="lg"
              className="w-full sm:w-auto backdrop-blur-md bg-white/[0.04] hover:bg-white/[0.08] text-sm sm:text-base border border-white/15 hover:border-white/30 text-white py-3 sm:py-3.5"
              icon={<Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 fill-cyan-400" />}
              iconPosition="start"
            >
              مشاهده پروژه‌ها
            </Button>
          </div>

          {/* Value Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-8 sm:pt-10 border-t border-white/10 max-w-3xl mx-auto mt-6">
            <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md text-center hover:border-white/20 transition-all">
              <span className="block text-lg sm:text-3xl font-bold text-white mb-1 font-mono">سینمایی</span>
              <span className="text-[10px] sm:text-xs text-neutral-300 font-light leading-tight block">استاندارد 4K</span>
            </div>
            <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md text-center hover:border-white/20 transition-all">
              <span className="block text-lg sm:text-3xl font-bold text-white mb-1 font-mono">سفارشی</span>
              <span className="text-[10px] sm:text-xs text-neutral-300 font-light leading-tight block">طراحی وب اختصاصی</span>
            </div>
            <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md text-center hover:border-white/20 transition-all">
              <span className="block text-lg sm:text-3xl font-bold text-white mb-1 font-mono">۱۰۰٪</span>
              <span className="text-[10px] sm:text-xs text-neutral-300 font-light leading-tight block">تمرکز بر رشد برند</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. TWO MAIN SERVICE DIVISIONS ---------------- */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="neutral" className="bg-white/[0.04] text-white/80 border-white/10">دو بازوی اصلی استودیو</Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            خدمات تخصصی استودیو تبلیغاتی هورام
          </h2>
          <p className="text-base text-neutral-300 font-light leading-relaxed">
            ما با تمرکز بر دو حوزه حیاتی کسب‌وکارها، تجربه بصری و دیجیتال برند شما را به سطحی بالاتر ارتقا می‌دهیم.
          </p>
        </div>

        {/* 2 Main Divisions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Service 1: Advertising Video Production */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group bg-white/[0.02]">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white">
                  <Video className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/[0.04] text-white/80 border border-white/10">
                  DIVISION A
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-neutral-200 transition-colors">
                  تولید فیلم و ویدئوی تبلیغاتی
                </h3>
                <span className="text-xs font-mono text-neutral-400 block mt-1">
                  Advertising Video Production
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                خلق فیلم‌های تبلیغاتی متمایز و تیزرهای سینمایی برای معرفی محصول، تثبیت جایگاه برند و جلب اعتماد مخاطبان با بالاترین استانداردهای بصری و روایت‌گری اثربخش.
              </p>

              {/* Lower Section 1: Minimalist Service List */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">شامل خدمات:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>تیزرهای تبلیغاتی تجاری</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>فیلم‌های معرفی محصول</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>ویدئوهای برندینگ سازمانی</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>تبلیغات سینمایی و تلویزیونی</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>محتوای تبلیغاتی سوشال مدیا</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>استوری‌تلینگ و روایت‌های برند</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Section 2: Action Row with Site Brand Blue Button */}
            <div className="relative z-10 pt-5 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/services#service-video"
                className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                مشاهده جزئیات و تعرفه‌ها
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </Link>
              <Button
                to="/contact?service=تولید ویدئوی تبلیغاتی"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 border-0"
              >
                سفارش تیزر تبلیغاتی
              </Button>
            </div>
          </div>

          {/* Main Service 2: Website Design & Development */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group bg-white/[0.02]">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white">
                  <Globe className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/[0.04] text-white/80 border border-white/10">
                  DIVISION B
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-neutral-200 transition-colors">
                  طراحی و توسعه وب‌سایت
                </h3>
                <span className="text-xs font-mono text-neutral-400 block mt-1">
                  Website Design & Development
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                طراحی و اجرای پلتفرم‌های دیجیتال و وب‌سایت‌های سفارشی با طراحی اختصاصی رابط کاربری (UI/UX)، سرعت بارگذاری خیره‌کننده و تمرکز دقیق بر تبدیل بازدیدکننده به مشتری.
              </p>

              {/* Lower Section 1: Minimalist Service List */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">شامل خدمات:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>طراحی سایت شرکتی و سازمانی</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>طراحی فروشگاه اینترنتی مدرن</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>طراحی لندینگ‌پیج‌های با نرخ تبدیل بالا</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>طراحی اختصاصی UI/UX در فیگما</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>توسعه وب‌سایت‌های سفارشی تجاری</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>سایت‌های معرفی محصول و خدمت</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Section 2: Action Row with Site Brand Cyan/Blue Button */}
            <div className="relative z-10 pt-5 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/services#service-web"
                className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                مشاهده ویژگی‌ها و پلتفرم‌ها
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </Link>
              <Button
                to="/contact?service=طراحی و توسعه وب‌سایت"
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-600/30 hover:shadow-cyan-600/50 border-0"
              >
                سفارش طراحی وب‌سایت
              </Button>
            </div>
          </div>
        </div>

        {/* Complementary Services Banner (with site's blue accents) */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-indigo-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-950/30 via-studio-900 to-studio-950">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/25">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">خدمت مکمل: ایده‌پردازی کمپین و استراتژی تبلیغات</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                تدوین پیام کلیدی، نگارش سناریوهای خلاقانه، استوری‌بورد و تولید دارایی‌های بصری یکپارچه برای رسانه‌های دیجیتال و محیطی.
              </p>
            </div>
          </div>
          <Button
            to="/contact?service=کمپین‌های خلاقانه و سناریو"
            size="sm"
            className="whitespace-nowrap shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/25 border-0"
          >
            درخواست مشاوره کمپین
          </Button>
        </div>
      </section>

      {/* ---------------- 3. SELECTED PORTFOLIO ---------------- */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <Badge variant="neutral" className="bg-white/[0.04] text-white/80 border-white/10">آرشیو پروژه‌ها</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              روایت پروژه‌های برگزیده استودیو هورام
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl font-light">
              کیس‌استادی‌های منتخب در حوزه فیلم‌های تبلیغاتی، تیزرهای تجاری محصول و پلتفرم‌های مدرن وب.
            </p>
          </div>
          <Button
            to="/portfolio"
            size="md"
            className="border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs px-4 py-2.5 rounded-xl transition-all"
            icon={<ArrowUpLeft className="w-4 h-4 text-white" />}
            iconPosition="end"
          >
            مشاهده آرشیو کامل پروژه‌ها
          </Button>
        </div>

        {/* Projects Grid: Swipeable Carousel on Mobile, 2-Col Grid on Desktop */}
        <div className="flex md:grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {featuredWorks.map((project) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.slug}`}
              className="w-[84vw] xs:w-[320px] md:w-auto shrink-0 md:shrink snap-center group glass-card rounded-2xl overflow-hidden glass-card-hover border border-white/10 flex flex-col bg-white/[0.02]"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-studio-950/20 to-transparent"></div>

                {project.isConcept && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-medium bg-studio-950/85 text-white/90 border border-white/15 backdrop-blur-md">
                      کانسپت استودیو
                    </span>
                  </div>
                )}

                {project.videoPreviewUrl && (
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-studio-950 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-studio-950 ml-0.5" />
                  </div>
                )}

                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-studio-950/90 text-neutral-300 border border-white/10 backdrop-blur-md">
                    {project.categoryFa}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 mb-2 font-light">
                    <span>{project.client}</span>
                    <span>سال {project.year}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-neutral-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 mt-2 leading-relaxed font-light">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">
                    {project.duration || 'پروژه اختصاصی'}
                  </span>
                  <span className="text-xs text-white/80 group-hover:text-white group-hover:translate-x-[-4px] transition-all flex items-center gap-1 font-medium">
                    مشاهده کیس‌استادی
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex md:hidden items-center justify-between pt-2 px-1 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            برای مشاهده سایر پروژه‌ها ورق بزنید
          </span>
          <Link to="/portfolio" className="text-[11px] text-indigo-400 flex items-center gap-1 font-medium">
            همه پروژه‌ها
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ---------------- 4. WHY CHOOSE HOORAM ---------------- */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="neutral" className="bg-white/[0.04] text-white/80 border-white/10">تمایز استودیو هورام</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            چرا برندهای پیشرو هورام را برمی‌گزینند؟
          </h2>
          <p className="text-sm text-neutral-400 font-light">
            تعهد به زیبایی‌شناسی بالا، کارگردانی دقیق و خلق نتایج تجاری سنجش‌پذیر.
          </p>
        </div>

        {/* Why-Us Cards: Horizontal Swipeable on Mobile, 4-Col Grid on Desktop */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          <div className="w-[78vw] xs:w-[280px] md:w-auto shrink-0 md:shrink snap-center p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-white flex items-center justify-center border border-white/10">
              <Film className="w-5 h-5 text-white/90" />
            </div>
            <h4 className="text-base font-bold text-white">کارگردانی هنری سینمایی</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              هر فریم از تبلیغات با وسواس کارگردانی، نورپردازی تخصصی، تدوین ریتمیک و اصلاح رنگ استانداردهای سینمایی طراحی می‌شود.
            </p>
          </div>

          <div className="w-[78vw] xs:w-[280px] md:w-auto shrink-0 md:shrink snap-center p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-white flex items-center justify-center border border-white/10">
              <Clock className="w-5 h-5 text-white/90" />
            </div>
            <h4 className="text-base font-bold text-white">سرعت و دقت در اجرا</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              با استفاده از پایپ‌لاین تولید چابک، پروژه‌های ویدیویی و طراحی وب‌سایت در زمان‌بندی شفاف و سریع تحویل داده می‌شوند.
            </p>
          </div>

          <div className="w-[78vw] xs:w-[280px] md:w-auto shrink-0 md:shrink snap-center p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-white flex items-center justify-center border border-white/10">
              <Award className="w-5 h-5 text-white/90" />
            </div>
            <h4 className="text-base font-bold text-white">شناخت عمیق بازار ایران</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              تمامی سناریوها، پیام‌های تبلیغاتی و تجربیات کاربری وب‌سایت متناسب با روانشناسی مخاطب و رفتارهای مصرف‌کننده داخلی تنظیم می‌گردد.
            </p>
          </div>

          <div className="w-[78vw] xs:w-[280px] md:w-auto shrink-0 md:shrink snap-center p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-white flex items-center justify-center border border-white/10">
              <TrendingUp className="w-5 h-5 text-white/90" />
            </div>
            <h4 className="text-base font-bold text-white">تمرکز بر بازگشت سرمایه</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              تبلیغات و وب‌سایت‌های ما ابزار تزئینی نیستند؛ هدف اصلی ما جذب مشتریان بیشتر، ساخت اعتبار و افزایش مستقیم فروش برند شماست.
            </p>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex md:hidden items-center justify-center pt-2 text-[11px] text-slate-400 gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>۴ رکن تمایز و کیفیت استودیو هورام (ورق بزنید)</span>
        </div>
      </section>

      {/* ---------------- 5. PROCESS PREVIEW ---------------- */}
      <section id="process" ref={processRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 transition-all duration-[1200ms] ease-out ${
          processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="space-y-3">
            <Badge variant="neutral" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">فرآیند همکاری</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              مسیر خلق تبلیغات ماندگار در ۵ گام
            </h2>
          </div>
          <Button
            to="/process"
            size="sm"
            className="border border-slate-700/80 bg-studio-900/60 hover:bg-studio-800 text-slate-200 hover:text-white text-xs px-4 py-2 rounded-xl transition-all"
          >
            مشاهده نقشه راه کامل فرآیند
          </Button>
        </div>

        {/* Process Steps: Horizontal Timeline on Mobile, 5-Col Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {[
            { step: '۰۱', title: 'کشف و دریافت بریف', desc: 'شناخت دقیق ابعاد بیزنس، مزیت‌های رقابتی و تحلیل مخاطبان هدف برند شما.' },
            { step: '۰۲', title: 'ایده‌پردازی و سناریو', desc: 'نگارش سناریوهای خلاقانه و استوری‌بورد تصویری برای اعتبارسنجی اولیه.' },
            { step: '۰۳', title: 'تولید و تصویربرداری', desc: 'اجرای حرفه‌ای صحنه‌ها، انیمیشن‌های سه‌بعدی و نماهای تبلیغاتی با بالاترین کیفیت.' },
            { step: '۰۴', title: 'تدوین و صداگذاری', desc: 'اصلاح رنگ سینمایی، مهندسی صدای فراگیر و بازبینی سخت‌گیرانه کارگردان هنری.' },
            { step: '۰۵', title: 'تحویل و اکران کمپین', desc: 'ارائه بسته‌های خروجی با ابعاد متناسب پلتفرم‌های دیجیتال و نظارت بر اثرگذاری.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`w-[74vw] xs:w-[260px] sm:w-auto shrink-0 sm:shrink snap-center group p-6 rounded-2xl bg-studio-900/50 border border-slate-800/80 relative flex flex-col justify-between hover:border-indigo-500/40 hover:bg-studio-900/80 hover:-translate-y-1.5 transition-all duration-[1400ms] shadow-md hover:shadow-xl hover:shadow-indigo-950/40 transform ${
                processVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${processVisible ? idx * 180 + 100 : 0}ms`,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black font-mono text-indigo-400/40 group-hover:text-indigo-400 transition-colors duration-300">
                    {item.step}
                  </span>
                  <div className="w-6 h-0.5 bg-indigo-500/30 group-hover:w-10 group-hover:bg-indigo-400 rounded-full transition-all duration-300" />
                </div>
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors duration-200">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex sm:hidden items-center justify-center pt-2 text-[11px] text-slate-400 gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>مسیر گام‌به‌گام از ایده تا اکران (ورق بزنید)</span>
        </div>
      </section>

      {/* ---------------- 6. INQUIRY CTA BANNER (Rich Brand Blue) ---------------- */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-indigo-950/70 via-studio-900 to-studio-950 border border-indigo-500/30 text-center shadow-2xl shadow-indigo-950/60">
          {/* Ambient Blue & Cyan Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
              مشاوره استراتژیک و برآورد بودجه
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              آماده‌اید حضور تبلیغاتی برند خود را متحول کنید؟
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              فرم استعلام پروژه را تکمیل فرمایید؛ تیم کارگردانی و استراتژی استودیو هورام ظرف ۲۴ ساعت ایده اولیه و پروپوزال متناسب با اهداف شما را آماده خواهد کرد.
            </p>
            <div className="pt-2">
              <Button
                to="/contact"
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base border-0 shadow-xl shadow-indigo-600/40 hover:shadow-indigo-500/60 hover:scale-[1.02] transition-all"
                icon={<ArrowUpLeft className="w-5 h-5 text-white" />}
                iconPosition="end"
              >
                تکمیل فرم درخواست همکاری
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
