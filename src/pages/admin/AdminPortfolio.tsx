import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  ExternalLink, 
  X,
  Camera,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Check,
  Loader2,
  Film,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { api } from '../../services/api';
import { PortfolioItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';

export const AdminPortfolio: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);

  // Video Frame Extraction state
  const videoExtractRef = useRef<HTMLVideoElement>(null);
  const [extractingFrame, setExtractingFrame] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [extractSuccessMsg, setExtractSuccessMsg] = useState<string | null>(null);

  // Gallery manual URL input state
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [uploadingGalleryImg, setUploadingGalleryImg] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    englishTitle: '',
    category: 'فیلم‌های تبلیغاتی',
    coverImage: '',
    gallery: [] as string[],
    videoPreviewUrl: '',
    client: '',
    year: '۱۴۰۳',
    duration: '',
    summary: '',
    challenge: '',
    solution: '',
    featured: false,
  });

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleTimeUpdate = () => {
    if (videoExtractRef.current) {
      setCurrentTime(videoExtractRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoExtractRef.current) {
      setVideoDuration(videoExtractRef.current.duration || 0);
      setCurrentTime(videoExtractRef.current.currentTime || 0);
    }
  };

  const handleScrub = (time: number) => {
    if (videoExtractRef.current) {
      videoExtractRef.current.currentTime = time;
      setCurrentTime(time);
      if (isPlayingPreview) {
        videoExtractRef.current.pause();
        setIsPlayingPreview(false);
      }
    }
  };

  const stepSeek = (delta: number) => {
    if (videoExtractRef.current) {
      const newTime = Math.max(0, Math.min(videoDuration || 100, videoExtractRef.current.currentTime + delta));
      videoExtractRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      if (isPlayingPreview) {
        videoExtractRef.current.pause();
        setIsPlayingPreview(false);
      }
    }
  };

  const togglePlay = () => {
    if (videoExtractRef.current) {
      if (isPlayingPreview) {
        videoExtractRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        videoExtractRef.current.play().catch(() => {});
        setIsPlayingPreview(true);
      }
    }
  };

  const handleCaptureFrame = async (target: 'cover' | 'gallery' = 'cover') => {
    const video = videoExtractRef.current;
    if (!video) return;

    if (video.readyState < 2) {
      alert('ویدیو هنوز بارگذاری نشده است. لطفاً چند لحظه تأمل فرمایید.');
      return;
    }

    setExtractingFrame(true);
    setExtractSuccessMsg(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('امکان ایجاد محیط پردازش تصویر فراهم نشد.');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setExtractingFrame(false);
          alert('خطا در استخراج تصویر از فریم ویدیو.');
          return;
        }

        const file = new File([blob], `frame_${target}_${Date.now()}.jpg`, { type: 'image/jpeg' });
        try {
          const res = await api.uploadMedia(file);
          if (target === 'cover') {
            setFormData(prev => ({
              ...prev,
              coverImage: res.url,
              gallery: prev.gallery.includes(res.url) ? prev.gallery : [res.url, ...prev.gallery]
            }));
            setExtractSuccessMsg(`فریم در ثانیه ${video.currentTime.toFixed(1)} به عنوان کاور اصلی تنظیم شد.`);
          } else {
            setFormData(prev => ({
              ...prev,
              gallery: [...prev.gallery, res.url]
            }));
            setExtractSuccessMsg(`فریم در ثانیه ${video.currentTime.toFixed(1)} به گالری تصاویر اضافه شد.`);
          }
          setTimeout(() => setExtractSuccessMsg(null), 4000);
        } catch (uploadErr) {
          // Fallback to dataUrl
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          if (target === 'cover') {
            setFormData(prev => ({
              ...prev,
              coverImage: dataUrl,
              gallery: prev.gallery.includes(dataUrl) ? prev.gallery : [dataUrl, ...prev.gallery]
            }));
            setExtractSuccessMsg(`فریم استخراج شد و جایگزین کاور گردید.`);
          } else {
            setFormData(prev => ({
              ...prev,
              gallery: [...prev.gallery, dataUrl]
            }));
            setExtractSuccessMsg(`فریم به گالری تصاویر پروژه افزوده شد.`);
          }
          setTimeout(() => setExtractSuccessMsg(null), 4000);
        } finally {
          setExtractingFrame(false);
        }
      }, 'image/jpeg', 0.95);
    } catch (err: any) {
      console.error('Frame capture failed:', err);
      alert(err.message || 'خطا در استخراج فریم از ویدیو.');
      setExtractingFrame(false);
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSetAsCover = (url: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: url
    }));
  };

  const handleUploadGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGalleryImg(true);
    try {
      const res = await api.uploadMedia(file);
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, res.url]
      }));
    } catch (err: any) {
      alert('خطا در بارگذاری تصویر به گالری: ' + (err.message || err));
    } finally {
      setUploadingGalleryImg(false);
      e.target.value = '';
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  async function loadPortfolio() {
    setLoading(true);
    try {
      const data = await api.getPortfolio();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load portfolio', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      englishTitle: '',
      category: 'فیلم‌های تبلیغاتی',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      videoPreviewUrl: '/videos/hero-showreel.mp4',
      client: 'کانسپت استودیو',
      year: '۱۴۰۳',
      duration: '۴۵ ثانیه',
      summary: '',
      challenge: '',
      solution: '',
      featured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: PortfolioItem) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      englishTitle: p.englishTitle || '',
      category: p.category,
      coverImage: p.coverImage,
      gallery: Array.isArray(p.gallery) ? p.gallery : (p.coverImage ? [p.coverImage] : []),
      videoPreviewUrl: p.videoPreviewUrl || '',
      client: p.client,
      year: p.year || '۱۴۰۳',
      duration: p.duration || '',
      summary: p.summary,
      challenge: p.challenge || '',
      solution: p.solution || '',
      featured: p.featured,
    });
    setModalOpen(true);
  };

  const handleToggleFeatured = async (p: PortfolioItem) => {
    try {
      const updated = await api.updatePortfolioItem(p.id, { featured: !p.featured });
      setProjects(prev => prev.map(item => item.id === p.id ? updated : item));
    } catch (err) {
      alert('خطا در تغییر وضعیت شاخص');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این نمونه‌کار اطمینان دارید؟')) return;
    try {
      await api.deletePortfolioItem(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('خطا در حذف پروژه');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<PortfolioItem> = {
      title: formData.title,
      englishTitle: formData.englishTitle,
      category: formData.category,
      categoryFa: formData.category,
      coverImage: formData.coverImage,
      gallery: formData.gallery,
      videoPreviewUrl: formData.videoPreviewUrl,
      client: formData.client,
      year: formData.year,
      duration: formData.duration,
      summary: formData.summary,
      challenge: formData.challenge,
      solution: formData.solution,
      featured: formData.featured,
    };

    try {
      if (editingProject) {
        const updated = await api.updatePortfolioItem(editingProject.id, payload);
        setProjects(prev => prev.map(p => p.id === editingProject.id ? updated : p));
      } else {
        const created = await api.createPortfolioItem(payload);
        setProjects(prev => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت نمونه‌کار');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">مدیریت نمونه‌کارها و کیس‌استادی‌ها</h2>
          <p className="text-xs text-slate-400 mt-0.5">افزودن، ویرایش و مدیریت آثار به نمایش درآمده در وب‌سایت استودیو</p>
        </div>

        <Button
          onClick={openAddModal}
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4 ml-1" />}
          iconPosition="start"
        >
          افزودن پروژه جدید
        </Button>
      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">در حال دریافت پروژه‌ها...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-studio-950/80 text-white backdrop-blur-md">
                      {project.categoryFa}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleFeatured(project)}
                    title={project.featured ? 'حذف از بخش برگزیده' : 'افزودن به بخش برگزیده'}
                    className={`absolute top-2 left-2 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                      project.featured
                        ? 'bg-amber-500 text-studio-950'
                        : 'bg-studio-950/70 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{project.client}</span>
                    <div className="flex items-center gap-2">
                      {project.duration && (
                        <span className="text-cyan-400 font-mono text-[10px] bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                          {project.duration}
                        </span>
                      )}
                      <span>سال {project.year}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{project.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-studio-900/60 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`/portfolio/${project.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  پیش‌نمایش
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title="ویرایش پروژه"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="حذف پروژه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-700 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'ویرایش پروژه در پورتفولیو' : 'افزودن پروژه جدید به استودیو'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">عنوان پروژه (فارسی) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="تیزر سینمایی عطر نیش..."
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">عنوان انگلیسی (اختیاری)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={formData.englishTitle}
                    onChange={(e) => setFormData({ ...formData, englishTitle: e.target.value })}
                    placeholder="Rojan Perfume Commercial"
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">دسته‌بندی اصلی *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="فیلم‌های تبلیغاتی">فیلم‌های تبلیغاتی (Advertising Films)</option>
                    <option value="تیزرهای محصول">تیزرهای محصول (Product Commercials)</option>
                    <option value="کمپین‌های خلاقانه">کمپین‌های خلاقانه (Creative Campaigns)</option>
                    <option value="طراحی وب‌سایت">طراحی وب‌سایت (Website Design)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">نام سفارش‌دهنده / کارفرما</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="برند یا کانسپت استودیو"
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">سال تولید / ساخت</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="۱۴۰۳ یا ۲۰۲۶"
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">مدت زمان تیزر / پروژه</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="۱۹ ثانیه (ریلز عمودی) یا سفارشی"
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUpload
                  label="تصویر کاور پروژه *"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  acceptType="image"
                  helperText="فرمت‌های مجاز: JPG, PNG, WebP (یا استخراج خودکار از ویدیوی روبرو)"
                />

                <FileUpload
                  label="ویدیو یا تیزر پیش‌نمایش (جهت استخراج کاور یا پخش در پروژه)"
                  value={formData.videoPreviewUrl}
                  onChange={(url) => setFormData({ ...formData, videoPreviewUrl: url })}
                  acceptType="video"
                  helperText="فرمت‌های ویدیویی: MP4, WebM (حداکثر ۱۰۰ مگابایت)"
                />
              </div>

              {/* Video Frame Extractor for Cover Image */}
              {formData.videoPreviewUrl ? (
                <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-studio-950/80 to-studio-950 border border-indigo-500/30 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2.5">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      <span>استخراج هوشمند فریم از ویدیوی پروژه به عنوان کاور</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                      {formatSeconds(currentTime)} / {formatSeconds(videoDuration)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Video Player Preview */}
                    <div className="md:col-span-2 relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-md group">
                      <video
                        ref={videoExtractRef}
                        src={formData.videoPreviewUrl}
                        crossOrigin="anonymous"
                        preload="metadata"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlayingPreview(false)}
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-studio-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-xl"
                        title={isPlayingPreview ? 'توقف' : 'پخش'}
                      >
                        {isPlayingPreview ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5 fill-current" />}
                      </button>
                    </div>

                    {/* Controls & Extract Action */}
                    <div className="space-y-3 flex flex-col justify-center">
                      <div className="space-y-1.5">
                        <div className="text-[11px] text-slate-300 font-medium flex justify-between">
                          <span>انتخاب دقیق فریم (اسکرابر):</span>
                          <span className="text-cyan-400 font-mono font-bold" dir="ltr">{currentTime.toFixed(2)}s</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={videoDuration || 1}
                          step={0.05}
                          value={currentTime}
                          onChange={(e) => handleScrub(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>

                      {/* Frame Stepping Buttons */}
                      <div className="flex items-center justify-between gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => stepSeek(-1)}
                          className="px-2 py-1 rounded-lg bg-studio-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                          title="یک ثانیه عقب"
                        >
                          -۱s
                        </button>
                        <button
                          type="button"
                          onClick={() => stepSeek(-0.1)}
                          className="px-2 py-1 rounded-lg bg-studio-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                          title="فریم قبلی"
                        >
                          -۰.۱s
                        </button>
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="p-1.5 rounded-lg bg-studio-900 border border-slate-800 text-slate-200 hover:text-white transition-colors"
                          title={isPlayingPreview ? 'مکث' : 'پخش'}
                        >
                          {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => stepSeek(0.1)}
                          className="px-2 py-1 rounded-lg bg-studio-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                          title="فریم بعدی"
                        >
                          +۰.۱s
                        </button>
                        <button
                          type="button"
                          onClick={() => stepSeek(1)}
                          className="px-2 py-1 rounded-lg bg-studio-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                          title="یک ثانیه جلو"
                        >
                          +۱s
                        </button>
                      </div>

                      {/* Capture Frame Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          disabled={extractingFrame}
                          onClick={() => handleCaptureFrame('cover')}
                          className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
                        >
                          {extractingFrame ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Camera className="w-3.5 h-3.5" />
                          )}
                          <span>تنظیم به عنوان کاور</span>
                        </button>

                        <button
                          type="button"
                          disabled={extractingFrame}
                          onClick={() => handleCaptureFrame('gallery')}
                          className="py-2 px-2.5 rounded-xl bg-studio-900 hover:bg-studio-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          {extractingFrame ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                          <span>افزودن به گالری</span>
                        </button>
                      </div>

                      {extractSuccessMsg && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 animate-fadeIn">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>{extractSuccessMsg}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-studio-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>
                    💡 <strong className="text-slate-300">قابلیت استخراج فریم:</strong> با بارگذاری یا وارد کردن لینک ویدیوی تیزر پروژه، پنل پخش‌کننده و اسکرابر فعال می‌شود و می‌توانید هر ثانیه یا فریم دلخواه را با یک کلیک به عنوان تصویر کاور اصلی یا گالری استخراج نمایید.
                  </span>
                </div>
              )}

              {/* Gallery Images Management Section */}
              <div className="p-4 rounded-2xl bg-studio-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>گالری فریم‌ها و تصاویر پروژه</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-mono">
                      {formData.gallery.length} تصویر
                    </span>
                  </div>
                  {formData.gallery.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gallery: [] }))}
                      className="text-[10px] text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      پاکسازی کل گالری
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  تصاویر این بخش به عنوان فریم‌های نمونه کار در پایین پلیر ویدیو در صفحه پروژه نمایش داده می‌شوند. در صورتی که این بخش خالی باشد یا فقط ۱ عکس داشته باشد، نوار تصاویر اضافی در سایت نمایش داده نمی‌شود.
                </p>

                {/* Thumbnails grid */}
                {formData.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {formData.gallery.map((imgUrl, idx) => {
                      const isCover = formData.coverImage === imgUrl;
                      return (
                        <div
                          key={idx}
                          className={`relative group rounded-xl overflow-hidden border-2 aspect-video bg-black/60 transition-all ${
                            isCover ? 'border-cyan-500 shadow-md shadow-cyan-500/20' : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`گالری ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isCover && (
                            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-cyan-500 text-studio-950 font-bold text-[9px] shadow">
                              کاور اصلی
                            </span>
                          )}

                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetAsCover(imgUrl)}
                                className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-medium"
                                title="انتخاب به عنوان کاور"
                              >
                                کاور
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="p-1 rounded bg-rose-600 hover:bg-rose-500 text-white"
                              title="حذف از گالری"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-studio-900/40 border border-dashed border-slate-800 text-center text-slate-500 text-[11px]">
                    هیچ تصویری در گالری ثبت نشده است. می‌توانید از بخش استخراج فریم ویدیو در بالا یا دکمه‌های زیر فریم اضافه نمایید.
                  </div>
                )}

                {/* Add to Gallery Inputs */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800/60">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      dir="ltr"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGalleryUrl();
                        }
                      }}
                      placeholder="لینک مستقیم تصویر (https://... یا /uploads/...)"
                      className="w-full bg-studio-950 border border-slate-800 rounded-xl py-1.5 px-3 text-[11px] text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    disabled={!newGalleryUrl.trim()}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 text-[11px] font-medium disabled:opacity-40 transition-colors shrink-0 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن لینک</span>
                  </button>

                  <label className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1.5">
                    {uploadingGalleryImg ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>آپلود فایل جدید</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingGalleryImg}
                      onChange={handleUploadGalleryImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">خلاصه داستان / معرفی کوتاه *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="خلق فضاسازی برای معرفی محصول با نورپردازی داینامیک..."
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">چالش کارفرما</label>
                  <textarea
                    rows={2}
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    placeholder="توضیح موانع و بریف اولیه..."
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">راهکار و کارگردانی استودیو</label>
                  <textarea
                    rows={2}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="رویکرد هنری و فنی استودیو..."
                    className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-studio-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featuredToggle" className="text-slate-300 font-medium cursor-pointer">
                  نمایش در بخش آثار برگزیده صفحه اصلی وب‌سایت
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  انصراف
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingProject ? 'ذخیره تغییرات پروژه' : 'انتشار پروژه در وب‌سایت'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
