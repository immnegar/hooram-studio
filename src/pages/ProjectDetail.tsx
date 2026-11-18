import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  ArrowUpLeft, 
  Play, 
  Calendar, 
  Clock, 
  User, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { PortfolioItem } from '../types';
import { SEO } from '../components/common/SEO';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [allProjects, setAllProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState<string>('');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    async function loadProject() {
      if (!slug) return;
      setLoading(true);
      try {
        const [item, list] = await Promise.all([
          api.getPortfolioBySlug(slug),
          api.getPortfolio()
        ]);
        setProject(item);
        setAllProjects(list);
        setActiveMedia(item.coverImage);
        setIsPlayingVideo(false);
      } catch (err) {
        console.error('Project not found', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-20 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        در حال بارگذاری مشخصات پروژه...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-36 pb-20 text-center max-w-md mx-auto px-4 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">پروژه مورد نظر یافت نشد</h2>
        <p className="text-xs text-slate-400">ممکن است این پروژه حذف یا آدرس آن تغییر کرده باشد.</p>
        <Button to="/portfolio" variant="secondary" size="sm">
          بازگشت به آرشیو پروژه‌ها
        </Button>
      </div>
    );
  }

  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const projectSchema = project.videoPreviewUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: project.title,
        description: project.summary,
        thumbnailUrl: [project.coverImage],
        uploadDate: project.createdAt || new Date().toISOString(),
        contentUrl: project.videoPreviewUrl,
        embedUrl: project.videoPreviewUrl,
        publisher: {
          '@type': 'Organization',
          name: 'استودیو تبلیغاتی هورام'
        }
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary,
        image: project.coverImage,
        creator: {
          '@type': 'Organization',
          name: 'استودیو تبلیغاتی هورام'
        }
      };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      <SEO
        title={project.title}
        description={project.summary}
        ogImage={project.coverImage}
        ogType={project.videoPreviewUrl ? 'video.other' : 'article'}
        keywords={[
          project.title,
          project.category,
          project.client,
          'استودیو تبلیغاتی هورام',
          'نمونه کار تیزر ویدیویی'
        ]}
        schema={projectSchema}
      />
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به همه نمونه‌کارها
        </Link>

        <div className="flex items-center gap-2">
          {project.isConcept && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              کانسپت استودیو هورام
            </span>
          )}
          <Badge variant="primary">{project.categoryFa}</Badge>
        </div>
      </div>

      {/* Main Title & Metadata */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          {project.title}
        </h1>
        {project.englishTitle && (
          <p className="text-sm font-mono text-slate-400">{project.englishTitle}</p>
        )}
        <p className="text-base sm:text-lg text-slate-300 font-light max-w-3xl leading-relaxed">
          {project.summary}
        </p>

        {/* Project Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-studio-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              سفارش‌دهنده
            </span>
            <span className="text-xs font-semibold text-slate-200">{project.client}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-studio-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              سال تولید
            </span>
            <span className="text-xs font-semibold text-slate-200">{project.year}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-studio-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              فرمت / زمان
            </span>
            <span className="text-xs font-semibold text-slate-200">{project.duration || 'اختصاصی'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-studio-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              دسته‌بندی
            </span>
            <span className="text-xs font-semibold text-slate-200">{project.categoryFa}</span>
          </div>
        </div>
      </div>

      {/* Main Visual Player / Stage */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 relative bg-studio-950">
        {project.videoPreviewUrl && isPlayingVideo ? (
          <div className="relative aspect-video w-full bg-black">
            <video
              src={project.videoPreviewUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden group">
            <img
              src={activeMedia}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {project.videoPreviewUrl && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 hover:scale-105 transition-all group-hover:bg-indigo-500"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Gallery Thumbnails */}
        {project.gallery && project.gallery.length > 1 && (
          <div className="p-4 bg-studio-900/70 border-t border-slate-800 flex items-center gap-3 overflow-x-auto">
            {project.videoPreviewUrl && (
              <button
                onClick={() => setIsPlayingVideo(true)}
                className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all flex flex-col items-center justify-center bg-indigo-950/60 text-indigo-300 gap-1 ${
                  isPlayingVideo
                    ? 'border-indigo-500 scale-105 bg-indigo-900/80 text-white'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
                title="پخش ویدیو"
              >
                <Play className="w-4 h-4 fill-current" />
                <span className="text-[9px] font-bold">ویدیو</span>
              </button>
            )}
            {project.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveMedia(img);
                  setIsPlayingVideo(false);
                }}
                className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activeMedia === img && !isPlayingVideo
                    ? 'border-indigo-500 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`نمای ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {project.challenge && (
            <div className="p-8 rounded-2xl bg-studio-900/40 border border-slate-800 space-y-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                چالش و صورت مسئله کارفرما
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {project.challenge}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="p-8 rounded-2xl bg-studio-900/40 border border-slate-800 space-y-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                راهکار و کارگردانی هنری استودیو
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {project.solution}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Inquiry Widget */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-studio-900 to-studio-900 border border-indigo-500/30 space-y-4 text-center">
            <h4 className="text-base font-bold text-white">
              علاقه‌مند به اجرای پروژه‌ای مشابه هستید؟
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              تیم ما آماده است با دریافت بریف اولیه، استوری‌بورد و پروپوزال متناسب با اهداف برند شما را تدوین کند.
            </p>
            <Button
              to={`/contact?service=${encodeURIComponent(project.categoryFa)}`}
              variant="primary"
              size="md"
              className="w-full justify-center"
              icon={<ArrowUpLeft className="w-4 h-4" />}
              iconPosition="end"
            >
              استعلام هزینه این سبک پروژه
            </Button>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
        {prevProject ? (
          <Link
            to={`/portfolio/${prevProject.slug}`}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>پروژه قبلی: {prevProject.title}</span>
          </Link>
        ) : (
          <div></div>
        )}

        {nextProject && (
          <Link
            to={`/portfolio/${nextProject.slug}`}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>پروژه بعدی: {nextProject.title}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
