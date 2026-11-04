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
      <section id="hero" className="relative w-full pt-24 sm:pt-28 pb-4 bg-studio-950">
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
            <div className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-studio-950/85 border border-slate-700/80 backdrop-blur-md text-[11px] sm:text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="font-mono text-rose-400 font-bold">REC ● 1080P 30FPS</span>
                <span className="text-slate-500 hidden sm:inline">|</span>
                <span className="text-slate-300 font-mono hidden sm:inline">HOORAM SHOWREEL</span>
              </div>

              {/* Scene Navigation Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => seekChapter(ch.time, idx)}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium transition-all backdrop-blur-md ${
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
            <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between pointer-events-auto">
              {/* Video Playback Controls */}
              <div className="flex items-center gap-2">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all shadow-lg hover:scale-105 text-xs ${
                  isMusicPlaying
                    ? 'bg-indigo-600/90 hover:bg-indigo-500 text-white border-indigo-400/50 shadow-indigo-500/20'
                    : 'bg-studio-950/80 hover:bg-studio-800 text-slate-300 hover:text-white border-slate-700/80'
                }`}
              >
                {isMusicPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                    <span className="text-[11px] font-medium hidden xs:inline text-cyan-200">موسیقی استودیو (در حال پخش)</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-medium hidden xs:inline text-slate-400">موسیقی استودیو</span>
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
      <section id="about-intro" className="relative w-full py-12 sm:py-16 lg:py-20 bg-studio-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          {/* Secondary Studio Tagline */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-studio-900/85 border border-amber-500/30 text-xs text-amber-300 backdrop-blur-md shadow-md">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="font-semibold tracking-wider">از تصور تا تأثیرگذاری</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">استودیو تبلیغاتی هورام</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.3] sm:leading-[1.2]">
            ایده‌های بزرگ،{' '}
            <span className="gradient-accent-text block sm:inline mt-1 sm:mt-0">
              تبلیغات ماندگار
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-light">
            استراتژی، خلاقیت و تولید محتوای تبلیغاتی برای برندهایی که می‌خواهند متفاوت دیده شوند.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-2xl shadow-indigo-600/40 text-base"
              icon={<ArrowUpLeft className="w-5 h-5" />}
              iconPosition="end"
            >
              ثبت درخواست همکاری
            </Button>
            <Button
              to="/portfolio"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto backdrop-blur-md bg-studio-900/90 hover:bg-studio-800 text-base border-slate-700 text-slate-200"
              icon={<Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />}
              iconPosition="start"
            >
              مشاهده پروژه‌ها
            </Button>
          </div>

          {/* Value Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-slate-800/80 max-w-3xl mx-auto mt-6">
            <div className="p-4 rounded-2xl bg-studio-950/70 border border-slate-800/90 backdrop-blur-md text-center">
              <span className="block text-2xl sm:text-3xl font-bold text-white mb-1 font-mono">سینمایی</span>
              <span className="text-xs text-slate-400">کارگردانی و تدوین با استاندارد 4K</span>
            </div>
            <div className="p-4 rounded-2xl bg-studio-950/70 border border-slate-800/90 backdrop-blur-md text-center">
              <span className="block text-2xl sm:text-3xl font-bold text-cyan-400 mb-1 font-mono">سفارشی</span>
              <span className="text-xs text-slate-400">طراحی وب بدون قالب‌های تکراری</span>
            </div>
            <div className="p-4 rounded-2xl bg-studio-950/70 border border-slate-800/90 backdrop-blur-md text-center">
              <span className="block text-2xl sm:text-3xl font-bold text-emerald-400 mb-1 font-mono">۱۰۰٪</span>
              <span className="text-xs text-slate-400">تمرکز بر رشد و فروش برند</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. TWO MAIN SERVICE DIVISIONS ---------------- */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary">دو بازوی اصلی استودیو</Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            خدمات تخصصی استودیو تبلیغاتی هورام
          </h2>
          <p className="text-base text-slate-300 font-light leading-relaxed">
            ما با تمرکز بر دو حوزه حیاتی کسب‌وکارها، تجربه بصری و دیجیتال برند شما را به سطحی بالاتر ارتقا می‌دهیم.
          </p>
        </div>

        {/* 2 Main Divisions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Service 1: Advertising Video Production */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800/90 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/15 transition-all"></div>
            
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Video className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  DIVISION A
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  تولید فیلم و ویدئوی تبلیغاتی
                </h3>
                <span className="text-xs font-mono text-slate-400 block mt-1">
                  Advertising Video Production
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-light">
                خلق فیلم‌های تبلیغاتی متمایز و تیزرهای سینمایی برای معرفی محصول، تثبیت جایگاه برند و جلب اعتماد مخاطبان با بالاترین استانداردهای بصری و روایت‌گری اثربخش.
              </p>

              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">شامل خدمات:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>تیزرهای تبلیغاتی تجاری</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>فیلم‌های معرفی محصول</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>ویدئوهای برندینگ سازمانی</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>تبلیغات سینمایی و تلویزیونی</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>محتوای تبلیغاتی سوشال مدیا</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>استوری‌تلینگ و روایت‌های برند</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/services#service-video"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                مشاهده جزئیات و تعرفه‌ها
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </Link>
              <Button to="/contact?service=تولید ویدئوی تبلیغاتی" variant="primary" size="sm">
                سفارش تیزر تبلیغاتی
              </Button>
            </div>
          </div>

          {/* Main Service 2: Website Design & Development */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800/90 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-600/15 transition-all"></div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Globe className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  DIVISION B
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  طراحی و توسعه وب‌سایت
                </h3>
                <span className="text-xs font-mono text-slate-400 block mt-1">
                  Website Design & Development
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-light">
                طراحی و اجرای پلتفرم‌های دیجیتال و وب‌سایت‌های سفارشی با طراحی اختصاصی رابط کاربری (UI/UX)، سرعت بارگذاری خیره‌کننده و تمرکز دقیق بر تبدیل بازدیدکننده به مشتری.
              </p>

              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">شامل خدمات:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>طراحی سایت شرکتی و سازمانی</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>طراحی فروشگاه اینترنتی مدرن</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>طراحی لندینگ‌پیج‌های با نرخ تبدیل بالا</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>طراحی اختصاصی UI/UX در فیگما</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>توسعه وب‌سایت‌های سفارشی تجاری</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-studio-900/60 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>سایت‌های معرفی محصول و خدمت</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/services#service-web"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
              >
                مشاهده ویژگی‌ها و پلتفرم‌ها
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </Link>
              <Button to="/contact?service=طراحی و توسعه وب‌سایت" variant="secondary" size="sm">
                سفارش طراحی وب‌سایت
              </Button>
            </div>
          </div>
        </div>

        {/* Complementary Services Banner (Creative Campaign Concepts) */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-studio-900/60 to-studio-950">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">خدمت مکمل: ایده‌پردازی کمپین و استراتژی تبلیغات</h4>
              <p className="text-xs text-slate-400 mt-1">
                تدوین پیام کلیدی، نگارش سناریوهای خلاقانه، استوری‌بورد و تولید دارایی‌های بصری یکپارچه برای رسانه‌های دیجیتال و محیطی.
              </p>
            </div>
          </div>
          <Button to="/contact?service=کمپین‌های خلاقانه و سناریو" variant="outline" size="sm" className="whitespace-nowrap shrink-0">
            درخواست مشاوره کمپین
          </Button>
        </div>
      </section>

      {/* ---------------- 3. SELECTED PORTFOLIO ---------------- */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <Badge variant="accent">آرشیو پروژه‌ها</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              روایت پروژه‌های برگزیده استودیو هورام
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              کیس‌استادی‌های منتخب در حوزه فیلم‌های تبلیغاتی، تیزرهای تجاری محصول و پلتفرم‌های مدرن وب.
            </p>
          </div>
          <Button
            to="/portfolio"
            variant="outline"
            size="md"
            icon={<ArrowUpLeft className="w-4 h-4" />}
            iconPosition="end"
          >
            مشاهده آرشیو کامل پروژه‌ها
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredWorks.map((project) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.slug}`}
              className="group glass-card rounded-2xl overflow-hidden glass-card-hover border border-slate-800 flex flex-col"
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
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-studio-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                      کانسپت استودیو
                    </span>
                  </div>
                )}

                {project.videoPreviewUrl && (
                  <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-indigo-600/90 text-white flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/40">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                )}

                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-700/60 backdrop-blur-md">
                    {project.categoryFa}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{project.client}</span>
                    <span>سال {project.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    {project.duration || 'پروژه اختصاصی'}
                  </span>
                  <span className="text-xs text-indigo-400 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1 font-medium">
                    مشاهده کیس‌استادی
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- 4. WHY CHOOSE HOORAM ---------------- */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="primary">تمایز استودیو هورام</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            چرا برندهای پیشرو هورام را برمی‌گزینند؟
          </h2>
          <p className="text-sm text-slate-400">
            تعهد به زیبایی‌شناسی بالا، کارگردانی دقیق و خلق نتایج تجاری سنجش‌پذیر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-studio-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">کارگردانی هنری سینمایی</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              هر فریم از تبلیغات با وسواس کارگردانی، نورپردازی تخصصی، تدوین ریتمیک و اصلاح رنگ استانداردهای سینمایی طراحی می‌شود.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-studio-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">سرعت و دقت در اجرا</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              با استفاده از پایپ‌لاین تولید چابک، پروژه‌های ویدیویی و طراحی وب‌سایت در زمان‌بندی شفاف و سریع تحویل داده می‌شوند.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-studio-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">شناخت عمیق بازار ایران</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تمامی سناریوها، پیام‌های تبلیغاتی و تجربیات کاربری وب‌سایت متناسب با روانشناسی مخاطب و رفتارهای مصرف‌کننده داخلی تنظیم می‌گردد.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-studio-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">تمرکز بر بازگشت سرمایه</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تبلیغات و وب‌سایت‌های ما ابزار تزئینی نیستند؛ هدف اصلی ما جذب مشتریان بیشتر، ساخت اعتبار و افزایش مستقیم فروش برند شماست.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 5. PROCESS PREVIEW ---------------- */}
      <section id="process" ref={processRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 transition-all duration-1000 ease-out ${
          processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="space-y-3">
            <Badge variant="neutral">فرآیند همکاری</Badge>
            <h2 className="text-3xl font-bold text-white">
              مسیر خلق تبلیغات ماندگار در ۵ گام
            </h2>
          </div>
          <Button to="/process" variant="secondary" size="sm">
            مشاهده نقشه راه کامل فرآیند
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '۰۱', title: 'کشف و دریافت بریف', desc: 'شناخت دقیق ابعاد بیزنس، مزیت‌های رقابتی و تحلیل مخاطبان هدف برند شما.' },
            { step: '۰۲', title: 'ایده‌پردازی و سناریو', desc: 'نگارش سناریوهای خلاقانه و استوری‌بورد تصویری برای اعتبارسنجی اولیه.' },
            { step: '۰۳', title: 'تولید و تصویربرداری', desc: 'اجرای حرفه‌ای صحنه‌ها، انیمیشن‌های سه‌بعدی و نماهای تبلیغاتی با بالاترین کیفیت.' },
            { step: '۰۴', title: 'تدوین و صداگذاری', desc: 'اصلاح رنگ سینمایی، مهندسی صدای فراگیر و بازبینی سخت‌گیرانه کارگردان هنری.' },
            { step: '۰۵', title: 'تحویل و اکران کمپین', desc: 'ارائه بسته‌های خروجی با ابعاد متناسب پلتفرم‌های دیجیتال و نظارت بر اثرگذاری.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-studio-900/40 border border-slate-800/80 relative flex flex-col justify-between hover:border-indigo-500/50 hover:bg-studio-900/70 transition-all duration-1000 ease-out transform ${
                processVisible
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-12 scale-95'
              }`}
              style={{
                transitionDelay: `${processVisible ? idx * 220 + 150 : 0}ms`,
              }}
            >
              <span className="text-2xl font-black font-mono text-indigo-500/40 mb-3 group-hover:text-indigo-400 transition-colors">{item.step}</span>
              <div>
                <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 6. INQUIRY CTA BANNER ---------------- */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-indigo-900/40 via-studio-900 to-studio-950 border border-indigo-500/30 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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
                variant="primary"
                size="lg"
                icon={<ArrowUpLeft className="w-5 h-5" />}
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
