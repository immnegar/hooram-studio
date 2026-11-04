import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Search, 
  Eye, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar, 
  ExternalLink, 
  Check, 
  X, 
  AlertCircle,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../../services/api';
import { ProjectInquiry, InquiryStatus } from '../../types';
import { Button } from '../../components/ui/Button';

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<ProjectInquiry | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, [activeFilter]);

  async function loadInquiries() {
    setLoading(true);
    try {
      const data = await api.getAdminInquiries(activeFilter === 'all' ? undefined : activeFilter);
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setLoading(false);
    }
  }

  const statusOptions: { value: InquiryStatus; labelFa: string; color: string }[] = [
    { value: 'New', labelFa: 'جدید', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    { value: 'Under Review', labelFa: 'در حال بررسی', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { value: 'Contacted', labelFa: 'تماس اولیه گرفته شد', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { value: 'Negotiation', labelFa: 'مذاکره و پیش‌پروپوزال', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { value: 'Converted to Project', labelFa: 'تبدیل‌شده به قرارداد', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { value: 'Archived', labelFa: 'آرشیو شده', color: 'bg-slate-800 text-slate-400 border-slate-700' },
  ];

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const updated = await api.updateInquiry(id, { status: newStatus });
      setInquiries(prev => prev.map(inq => inq.id === id ? updated : inq));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(updated);
      }
    } catch (err) {
      alert('خطا در به‌روزرسانی وضعیت');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setIsUpdating(true);
    try {
      const updated = await api.updateInquiry(selectedInquiry.id, { notes: noteText });
      setInquiries(prev => prev.map(inq => inq.id === selectedInquiry.id ? updated : inq));
      setSelectedInquiry(updated);
      alert('یادداشت داخلی با موفقیت ذخیره شد.');
    } catch (err) {
      alert('خطا در ذخیره یادداشت');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این درخواست اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) return;
    try {
      await api.deleteInquiry(id);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      alert('خطا در حذف درخواست');
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    return (
      inq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.brandName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phoneNumber.includes(searchTerm) ||
      inq.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportToCSV = () => {
    if (inquiries.length === 0) {
      alert('هیچ استعلامی برای خروجی وجود ندارد.');
      return;
    }

    const headers = [
      'کد رهگیری',
      'نام و نام خانوادگی',
      'نام برند/شرکت',
      'شماره تماس',
      'ایمیل',
      'خدمت انتخابی',
      'بودجه تخمینی',
      'وضعیت',
      'تاریخ ثبت',
      'شرح پروژه',
      'لینک رفرنس',
      'یادداشت‌های داخلی'
    ];

    const statusMap: Record<string, string> = {
      'New': 'جدید',
      'Under Review': 'در حال بررسی',
      'Contacted': 'تماس اولیه گرفته شد',
      'Negotiation': 'مذاکره و پیش‌پروپوزال',
      'Converted to Project': 'تبدیل‌شده به قرارداد',
      'Archived': 'آرشیو شده'
    };

    const rows = filteredInquiries.map(inq => [
      `"${inq.id || ''}"`,
      `"${(inq.fullName || '').replace(/"/g, '""')}"`,
      `"${(inq.brandName || '').replace(/"/g, '""')}"`,
      `"${(inq.phoneNumber || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.service || '').replace(/"/g, '""')}"`,
      `"${(inq.budget || '').replace(/"/g, '""')}"`,
      `"${statusMap[inq.status] || inq.status}"`,
      `"${new Date(inq.createdAt).toLocaleString('fa-IR')}"`,
      `"${(inq.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(inq.referenceLink || '').replace(/"/g, '""')}"`,
      `"${(inq.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    // UTF-8 BOM \uFEFF ensures Persian characters open properly in Microsoft Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Hooram-Studio-Leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">مدیریت لیدها و درخواست‌های پروژه‌ها</h2>
          <p className="text-xs text-slate-400 mt-0.5">ثبت‌شده توسط بازدیدکنندگان وب‌سایت استودیو</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
            title="دانلود خروجی اکسل از لیست استعلام‌ها"
          >
            <FileSpreadsheet className="w-4 h-4" />
            خروجی اکسل (CSV)
          </button>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در نام، برند یا تلفن..."
              className="w-full bg-studio-900 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          همه استعلام‌ها ({inquiries.length})
        </button>
        {statusOptions.map((st) => (
          <button
            key={st.value}
            onClick={() => setActiveFilter(st.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === st.value ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {st.labelFa}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">در حال بارگذاری اطلاعات لیدها...</div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-studio-900/30 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400">هیچ درخواستی در این دسته‌بندی یافت نشد.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-studio-900/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-4">متقاضی / برند</th>
                  <th className="py-3 px-4">شماره تماس</th>
                  <th className="py-3 px-4">خدمت انتخابی</th>
                  <th className="py-3 px-4">بودجه تقریبی</th>
                  <th className="py-3 px-4">وضعیت لید</th>
                  <th className="py-3 px-4">تاریخ ثبت</th>
                  <th className="py-3 px-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInquiries.map((inq) => {
                  const currentStatus = statusOptions.find(s => s.value === inq.status) || statusOptions[0];
                  return (
                    <tr key={inq.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{inq.fullName}</div>
                        <div className="text-[11px] text-slate-400">{inq.brandName || '-'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono" dir="ltr">
                        {inq.phoneNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {inq.service}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {inq.budget || 'توافقی'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={inq.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`text-[11px] rounded-lg px-2.5 py-1 border bg-studio-950 focus:outline-none cursor-pointer ${currentStatus.color}`}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-studio-900 text-white">
                              {opt.labelFa}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">
                        {new Date(inq.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setNoteText(inq.notes || '');
                            }}
                            title="مشاهده جزئیات کامل و بریف"
                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id)}
                            title="حذف استعلام"
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-700 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">جزئیات کامل استعلام پروژه</h3>
                <span className="text-[11px] font-mono text-indigo-400">کد: {selectedInquiry.id}</span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-studio-900 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">نام متقاضی:</span>
                <span className="font-semibold text-white">{selectedInquiry.fullName}</span>
              </div>

              <div className="p-3 rounded-xl bg-studio-900 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">نام برند یا شرکت:</span>
                <span className="font-semibold text-white">{selectedInquiry.brandName || '-'}</span>
              </div>

              <div className="p-3 rounded-xl bg-studio-900 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">شماره تماس همراه:</span>
                <a href={`tel:${selectedInquiry.phoneNumber}`} dir="ltr" className="font-mono text-cyan-400 hover:underline">
                  {selectedInquiry.phoneNumber}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-studio-900 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">پست الکترونیک:</span>
                <span dir="ltr" className="text-slate-300 font-mono">{selectedInquiry.email || 'ثبت نشده'}</span>
              </div>

              <div className="p-3 rounded-xl bg-studio-900 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">خدمت درخواستی:</span>
                <span className="font-semibold text-indigo-400">{selectedInquiry.service}</span>
              </div>

              <div className="p-3 rounded-xl bg-studio-900 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">حدود بودجه مدنظر:</span>
                <span className="font-semibold text-amber-400">{selectedInquiry.budget || 'توافقی'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-xl bg-studio-900 border border-slate-800 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 block">شرح نیازمندی کارفرما:</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light whitespace-pre-wrap">
                {selectedInquiry.description}
              </p>
            </div>

            {/* Reference link */}
            {selectedInquiry.referenceLink && (
              <div className="p-3 rounded-xl bg-studio-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">لینک رفرنس یا نمونه معرفی‌شده:</span>
                <a
                  href={selectedInquiry.referenceLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  مشاهده لینک نمونه
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Internal studio notes */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                یادداشت‌های داخلی استودیو (پیشرفت مذاکره / قیمت توافق‌شده):
              </label>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="یادداشت‌های جلسه، بازخورد کارفرما یا تصمیمات تیم را اینجا یادداشت کنید..."
                className="w-full bg-studio-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              ></textarea>
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                >
                  ذخیره یادداشت داخلی
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

