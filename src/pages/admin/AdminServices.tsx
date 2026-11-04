import React, { useState, useEffect } from 'react';
import { Layers, Edit3, Check, X, Sparkles, Video, Globe, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { ServiceItem } from '../../types';
import { Button } from '../../components/ui/Button';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (s: ServiceItem) => {
    setEditingService({ ...s });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSaving(true);
    try {
      const updated = await api.updateService(editingService.id, editingService);
      setServices(prev => prev.map(s => s.id === editingService.id ? updated : s));
      setEditingService(null);
      alert('خدمت با موفقیت به‌روزرسانی شد.');
    } catch (err) {
      alert('خطا در به‌روزرسانی خدمت');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">مدیریت خدمات و محصولات استودیو</h2>
        <p className="text-xs text-slate-400 mt-0.5">ویرایش متن‌ها، خروجی‌ها و مدل‌های تکنولوژی هر دسته خدماتی</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">در حال دریافت فهرست خدمات...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
                    {service.category === 'A' ? <Video className="w-5 h-5" /> :
                     service.category === 'B' ? <Globe className="w-5 h-5" /> :
                     <Sparkles className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-mono text-cyan-400">بخش {service.category}</span>
                </div>

                <h3 className="text-base font-bold text-white">{service.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.shortDescription}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-300 block">زیرمجموعه‌ها ({service.subServices.length}):</span>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    {service.subServices.slice(0, 3).map((sub, idx) => (
                      <li key={idx} className="truncate">• {sub}</li>
                    ))}
                    {service.subServices.length > 3 && (
                      <li className="text-indigo-400">و {service.subServices.length - 3} مورد دیگر...</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-300 block">ابزارها و تکنولوژی‌ها:</span>
                  <div className="flex flex-wrap gap-1">
                    {service.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-950 text-slate-300 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Button
                  onClick={() => handleEdit(service)}
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  icon={<Edit3 className="w-3.5 h-3.5 ml-1" />}
                  iconPosition="start"
                >
                  ویرایش اطلاعات این خدمت
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-700 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                ویرایش خدمت: {editingService.title}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">عنوان فارسی خدمت</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">توضیح کوتاه خدمت</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.shortDescription}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">تکنولوژی‌ها و مدل‌ها (جدا شده با کاما)</label>
                <input
                  type="text"
                  value={editingService.technologies.join(', ')}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingService(null)}
                >
                  انصراف
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                  {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

