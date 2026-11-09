import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowUpLeft, Search, Filter, Film, Layers } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { PortfolioItem } from '../types';
import { SEO } from '../components/common/SEO';

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await api.getPortfolio();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load portfolio', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  const categories = [
    { id: 'all', titleFa: 'همه پروژه‌ها' },
    { id: 'فیلم‌های تبلیغاتی', titleFa: 'فیلم‌های تبلیغاتی' },
    { id: 'تیزرهای محصول', titleFa: 'تیزرهای محصول' },
    { id: 'کمپین‌های خلاقانه', titleFa: 'کمپین‌های خلاقانه' },
    { id: 'طراحی وب‌سایت', titleFa: 'طراحی وب‌سایت' },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeCategory === 'all' ||
      project.category === activeCategory ||
      project.categoryFa === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <SEO
        title="گالری پروژه‌ها و نمونه‌کارهای تبلیغاتی | استودیو هورام"
        description="مشاهده نمونه‌کارهای فیلم‌های تبلیغاتی تجاری، تیزرهای محصول با هوش مصنوعی، طراحی وب‌سایت‌های مدرن و کمپین‌های خلاقانه استودیو تبلیغاتی هورام."
        keywords={[
          'نمونه کار تیزر تبلیغاتی',
          'پورتفولیو تبلیغاتی',
          'فیلم تبلیغاتی ایرانی',
          'نمونه تیزر هوش مصنوعی',
          'طراحی وب سایت نمونه کار'
        ]}
      />
      {/* Header */}
      <div id="portfolio-header" className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="accent">آرشیو آثار و پروژه‌ها</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          ویترین پروژه‌های استودیو تبلیغاتی هورام
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          مروری بر فیلم‌های تبلیغاتی، تیزرهای معرفی محصول، هویت‌های کمپین و وب‌سایت‌های سفارشی طراحی شده توسط تیم هورام.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-studio-900/40 p-3 rounded-2xl border border-slate-800 backdrop-blur-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.titleFa}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو در عنوان یا برند..."
            className="w-full bg-studio-950 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          در حال بارگذاری نمونه‌کارها...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-studio-900/30 rounded-2xl border border-slate-800 p-8 space-y-3">
          <p className="text-slate-300">هیچ پروژه‌ای مطابق فیلترهای انتخابی یافت نشد.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveCategory('all');
              setSearchTerm('');
            }}
          >
            پاک کردن فیلترها
          </Button>
        </div>
      ) : (
        <div id="portfolio-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.slug}`}
              className="group glass-card rounded-2xl overflow-hidden glass-card-hover border border-slate-800 flex flex-col"
            >
              {/* Cover Container */}
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-studio-950/20 to-transparent"></div>

                {project.isConcept && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-studio-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                      کانسپت استودیو
                    </span>
                  </div>
                )}

                {project.videoPreviewUrl && (
                  <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-indigo-600/90 text-white flex items-center justify-center backdrop-blur-md shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                )}

                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/90 text-slate-200 border border-slate-700/60 backdrop-blur-md">
                    {project.categoryFa}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>{project.client}</span>
                    <span>سال {project.year}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {project.duration || 'پروژه اختصاصی'}
                  </span>
                  <span className="text-[11px] text-indigo-400 group-hover:translate-x-[-3px] transition-transform flex items-center gap-1 font-medium">
                    بررسی جزئیات
                    <ArrowUpLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA Box */}
      <div id="portfolio-cta" className="text-center pt-8">
        <div className="glass-card rounded-2xl p-8 border border-slate-800 max-w-2xl mx-auto space-y-4">
          <h3 className="text-lg font-bold text-white">
            پروژه‌ای برای برند یا محصول خود در نظر دارید؟
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            می‌توانید کانسپت و سبک بصری متناسب با ماهیت برند خود را در جلسه مشاوره اولیه با تیم کارگردانی ما بررسی فرمایید.
          </p>
          <Button to="/contact" variant="primary" size="md">
            درخواست مشاوره و استعلام هزینه
          </Button>
        </div>
      </div>
    </div>
  );
};
