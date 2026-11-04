import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Image as ImageIcon,
  TrendingUp,
  CheckCircle2,
  Clock,
  MessageSquare,
  ArrowUpLeft,
  Sparkles,
  Settings,
  Phone,
  BarChart3,
  PieChart,
  Video,
  Globe,
  Layers,
  Award,
  Calendar,
  ShieldAlert,
  KeyRound,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { DashboardStats, StudioSettings, ProjectInquiry } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('hooram_dismiss_default_pwd_reminder') === 'true';
  });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState<'7days' | '14days'>('7days');

  useEffect(() => {
    async function loadStats() {
      try {
        const [statsData, settingsData, inquiriesData] = await Promise.all([
          api.getDashboardStats(),
          api.getSettings().catch(() => null),
          api.getAdminInquiries().catch(() => [])
        ]);
        setStats(statsData);
        setSettings(settingsData);
        setInquiries(inquiriesData);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">در حال دریافت آمار و تحلیل داده‌ها...</div>;
  }

  const statusColors: Record<string, string> = {
    'New': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    'Under Review': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Contacted': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'Negotiation': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'Converted to Project': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Archived': 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const statusLabels: Record<string, string> = {
    'New': 'جدید',
    'Under Review': 'در حال بررسی',
    'Contacted': 'تماس گرفته شد',
    'Negotiation': 'مذاکره و پیش‌پروپوزال',
    'Converted to Project': 'تبدیل‌شده به قرارداد',
    'Archived': 'آرشیو شده',
  };

  // 1. Calculate Daily Trend Data for Chart
  const daysCount = chartRange === '7days' ? 7 : 14;
  const chartDays: { label: string; count: number; dateStr: string }[] = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const faLabel = d.toLocaleDateString('fa-IR', { weekday: 'short', month: 'numeric', day: 'numeric' });

    const matchingCount = inquiries.filter(inq => {
      if (!inq.createdAt) return false;
      return inq.createdAt.startsWith(dateKey);
    }).length;

    chartDays.push({
      label: faLabel,
      count: matchingCount,
      dateStr: dateKey
    });
  }

  const maxDailyCount = Math.max(...chartDays.map(d => d.count), 4);

  // 2. Calculate Services Distribution
  const serviceCounts: Record<string, number> = {};
  inquiries.forEach(inq => {
    const s = inq.service || 'سایر';
    serviceCounts[s] = (serviceCounts[s] || 0) + 1;
  });

  const totalInqCount = inquiries.length || 1;
  const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);

  // 3. Conversion Rate KPI
  const converted = (stats?.statusCounts['Converted to Project'] || 0);
  const inNegotiation = (stats?.statusCounts['Negotiation'] || 0);
  const conversionRate = totalInqCount > 0 ? Math.round(((converted + inNegotiation) / totalInqCount) * 100) : 0;

  const handleDismissReminder = () => {
    setIsDismissed(true);
    sessionStorage.setItem('hooram_dismiss_default_pwd_reminder', 'true');
  };

  return (
    <div className="space-y-8">
      {/* Default Password Reminder Banner */}
      {user?.isDefaultPassword && !isDismissed && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5 animate-in fade-in duration-300">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                هشدار امنیتی: استفاده از رمز عبور پیش‌فرض سامانه
              </h4>
              <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">
                شما با رمز عبور اولیه (<span className="font-mono text-amber-200 dir-ltr inline-block">changeme123</span>) وارد سیستم شده‌اید. جهت صیانت از اطلاعات استودیو و داده‌های مشتریان، توصیه می‌شود یک رمز عبور اختصاصی تعیین کنید.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <Link
              to="/admin/settings"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              تغییر رمز عبور
            </Link>
            <button
              onClick={handleDismissReminder}
              title="بعداً یادآوری کن"
              className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>بعداً</span>
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">کل استعلام‌های ثبت‌شده</span>
            <span className="text-3xl font-black text-white font-mono">
              {stats?.totalInquiries || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* New Leads */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">لیدهای جدید (پاسخ‌داده‌نشده)</span>
            <span className="text-3xl font-black text-cyan-400 font-mono">
              {stats?.statusCounts['New'] || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* In Negotiation & Conversion */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">نرخ مذاکره و تبدیل</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400 font-mono">
                {conversionRate}٪
              </span>
              <span className="text-[11px] text-slate-500">
                ({converted + inNegotiation} مورد)
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Portfolio Count */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">پروژه‌های پورتفولیو</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {stats?.totalPortfolio || 0}
              </span>
              <span className="text-[11px] text-emerald-500 font-medium">
                ({stats?.featuredPortfolio || 0} برگزیده)
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts Section: Trends & Service Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Daily Inquiries Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">روند زمانی ثبت استعلام‌ها (ورود لیدها)</h3>
            </div>

            <div className="flex items-center gap-1 bg-studio-900 border border-slate-800 rounded-lg p-1 text-[11px]">
              <button
                onClick={() => setChartRange('7days')}
                className={`px-2.5 py-1 rounded-md transition-colors ${chartRange === '7days' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                ۷ روز گذشته
              </button>
              <button
                onClick={() => setChartRange('14days')}
                className={`px-2.5 py-1 rounded-md transition-colors ${chartRange === '14days' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                ۱۴ روز گذشته
              </button>
            </div>
          </div>

          {/* Interactive CSS / SVG Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-2 border-b border-slate-800/80 px-2">
              {chartDays.map((item, idx) => {
                const heightPercent = Math.max((item.count / maxDailyCount) * 100, item.count > 0 ? 15 : 4);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-studio-900 border border-slate-700 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                      {item.count} استعلام در {item.label}
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${item.count > 0
                          ? 'bg-gradient-to-t from-indigo-600 to-cyan-400 group-hover:brightness-125 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800/40 group-hover:bg-slate-800'
                        }`}
                    ></div>

                    {/* Label */}
                    <span className="text-[10px] text-slate-500 mt-2 truncate max-w-[40px] text-center">
                      {item.label.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-indigo-600 to-cyan-400 inline-block"></span>
              تعداد استعلام‌های ورودی هر روز
            </span>
            <span className="font-mono text-slate-500 text-[11px]">
              مجموع دوره: {chartDays.reduce((acc, c) => acc + c.count, 0)} لید
            </span>
          </div>
        </div>

        {/* Chart 2: Services Demand Distribution */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">تفکیک تقاضای خدمات استودیو</h3>
          </div>

          <div className="space-y-3.5 pt-2">
            {sortedServices.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">استعلامی جهت تحلیل وجود ندارد.</div>
            ) : (
              sortedServices.slice(0, 5).map(([svcName, count], idx) => {
                const pct = Math.round((count / totalInqCount) * 100);
                const colors = [
                  'from-indigo-500 to-indigo-400',
                  'from-cyan-500 to-cyan-400',
                  'from-purple-500 to-purple-400',
                  'from-amber-500 to-amber-400',
                  'from-emerald-500 to-emerald-400'
                ];
                const color = colors[idx % colors.length];

                return (
                  <div key={svcName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[170px]" title={svcName}>
                        {svcName}
                      </span>
                      <span className="font-mono text-slate-400 font-bold">
                        {count} <span className="text-[10px] text-slate-500 font-normal">({pct}٪)</span>
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-studio-900 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Status Breakdown */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          وضعیت فرآیند تبدیل لیدها در پایپ‌لاین
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {Object.entries(stats?.statusCounts || {}).map(([key, count]) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-studio-900 border border-slate-800 text-center space-y-1"
            >
              <span className="text-[11px] text-slate-400 block">{statusLabels[key] || key}</span>
              <span className="text-xl font-bold text-white font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">آخرین استعلام‌های دریافتی</h3>
          <Link
            to="/admin/inquiries"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            مشاهده و مدیریت همه لیدها
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 pb-2">
                <th className="py-3 px-2">نام متقاضی</th>
                <th className="py-3 px-2">برند / شرکت</th>
                <th className="py-3 px-2">شماره تماس</th>
                <th className="py-3 px-2">خدمت درخواستی</th>
                <th className="py-3 px-2">وضعیت</th>
                <th className="py-3 px-2">تاریخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats?.recentInquiries?.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-white">{inq.fullName}</td>
                  <td className="py-3 px-2 text-slate-300">{inq.brandName || '-'}</td>
                  <td className="py-3 px-2 font-mono text-slate-400" dir="ltr">{inq.phoneNumber}</td>
                  <td className="py-3 px-2 text-slate-300 max-w-xs truncate">{inq.service}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${statusColors[inq.status] || 'bg-slate-800 text-slate-300'}`}>
                      {statusLabels[inq.status] || inq.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-500 font-mono text-[10px]">
                    {new Date(inq.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Settings Overview Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">راه‌های ارتباطی و شبکه‌های اجتماعی استودیو</h3>
          </div>
          <Link
            to="/admin/settings"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            ویرایش و مدیریت تنظیمات
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-studio-900/80 border border-slate-800/80">
            <span className="text-[11px] text-slate-500 block mb-1">شماره همراه استودیو:</span>
            <span className="font-vazir text-slate-200" dir="ltr">۰۹۱۲۸۵۴۸۶۲۳</span>
          </div>

          <div className="p-3 rounded-xl bg-studio-900/80 border border-slate-800/80">
            <span className="text-[11px] text-slate-500 block mb-1">پست الکترونیک:</span>
            <span className="font-mono text-slate-200" dir="ltr">{settings?.email || 'تنظیم نشده'}</span>
          </div>

          <div className="p-3 rounded-xl bg-studio-900/80 border border-slate-800/80">
            <span className="text-[11px] text-slate-500 block mb-1">اینستاگرام:</span>
            <span className="text-slate-200">{settings?.instagram ? 'متصل' : 'غیرفعال (به‌زودی)'}</span>
          </div>

          <div className="p-3 rounded-xl bg-studio-900/80 border border-slate-800/80">
            <span className="text-[11px] text-slate-500 block mb-1">سیستم اعلانات (SMS/تلگرام):</span>
            <span className="text-slate-200">
              {settings?.notifications?.smsEnabled || settings?.notifications?.telegramEnabled
                ? 'فعال 🟢'
                : 'آماده پیکربندی'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
