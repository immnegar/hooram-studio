import React, { useState, useEffect } from 'react';
import { 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Globe, 
  Sparkles,
  ExternalLink,
  Bell,
  Lock,
  Send,
  ShieldCheck,
  Smartphone,
  MessageSquare,
  KeyRound,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { InstagramIcon, LinkedinIcon, TelegramIcon } from '../../components/ui/SocialIcons';
import { api } from '../../services/api';
import { StudioSettings, StudioNotifications } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AdminSettings: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security'>('general');

  // General settings state
  const [settings, setSettings] = useState<StudioSettings>({
    studioName: '',
    tagline: '',
    phone: '',
    mobile: '',
    email: '',
    address: '',
    instagram: '',
    telegram: '',
    linkedin: '',
    workingHours: '',
    notifications: {
      smsEnabled: false,
      smsProvider: 'kavenegar',
      smsApiKey: '',
      adminPhone: '',
      telegramEnabled: false,
      telegramBotToken: '',
      telegramChatId: '',
      webhookEnabled: false,
      webhookUrl: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Security & Password state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'مدیر استودیو هورام',
    email: user?.email || 'admin@hooram.studio',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Notification testing state
  const [testingNotification, setTestingNotification] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getSettings();
        if (data) {
          setSettings({
            studioName: data.studioName || '',
            tagline: data.tagline || '',
            phone: data.phone || '',
            mobile: data.mobile || '',
            email: data.email || '',
            address: data.address || '',
            instagram: data.instagram || '',
            telegram: data.telegram || '',
            linkedin: data.linkedin || '',
            workingHours: data.workingHours || '',
            notifications: data.notifications || {
              smsEnabled: false,
              smsProvider: 'kavenegar',
              smsApiKey: '',
              adminPhone: data.mobile || '',
              telegramEnabled: false,
              telegramBotToken: '',
              telegramChatId: '',
              webhookEnabled: false,
              webhookUrl: ''
            }
          });
        }
      } catch (err: any) {
        console.error('Failed to load settings', err);
        setErrorMessage('خطا در دریافت تنظیمات استودیو');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleGeneralChange = (field: keyof StudioSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof StudioNotifications, value: any) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...(prev.notifications || {
          smsEnabled: false,
          adminPhone: '',
          telegramEnabled: false,
          webhookEnabled: false
        }),
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await api.updateSettings(settings);
      setSuccessMessage('تنظیمات با موفقیت ذخیره شد.');
      if (res.settings) {
        setSettings(res.settings);
      }
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ذخیره‌سازی اطلاعات');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    if (profileData.newPassword) {
      if (profileData.newPassword.length < 6) {
        setProfileError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
        setSavingProfile(false);
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        setProfileError('رمز عبور جدید با تکرار آن یکسان نیست.');
        setSavingProfile(false);
        return;
      }
      if (!profileData.currentPassword) {
        setProfileError('لطفاً جهت تغییر رمز عبور، رمز عبور فعلی را وارد نمایید.');
        setSavingProfile(false);
        return;
      }
    }

    try {
      const res = await api.updateAdminProfile({
        name: profileData.name,
        email: profileData.email,
        currentPassword: profileData.currentPassword || undefined,
        newPassword: profileData.newPassword || undefined
      });
      if (res.user) {
        updateUser(res.user);
      }
      setProfileSuccess(res.message || 'اطلاعات با موفقیت به‌روزرسانی شد.');
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: any) {
      setProfileError(err.message || 'خطا در به‌روزرسانی اطلاعات حساب');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleTestNotification = async () => {
    setTestingNotification(true);
    setTestSuccess(null);
    try {
      const res = await api.testNotification();
      setTestSuccess(res.message || 'سیگنال تست اعلان با موفقیت ارسال شد.');
      setTimeout(() => setTestSuccess(null), 5000);
    } catch (err: any) {
      alert(err.message || 'خطا در ارسال تست اعلان');
    } finally {
      setTestingNotification(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">در حال بارگذاری تنظیمات استودیو...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Badge variant="accent">مرکز کنترل و تنظیمات</Badge>
          <h1 className="text-2xl font-black text-white mt-1 font-vazir">تنظیمات استودیو، اعلانات و امنیت</h1>
          <p className="text-xs text-slate-400 mt-1">
            پیکربندی اطلاعات عمومی، هشدارهای لحظه‌ای پیامک/تلگرام و امنیت حساب مدیریت هورام
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          to="/contact"
          target="_blank"
          icon={<ExternalLink className="w-3.5 h-3.5 text-cyan-400" />}
          iconPosition="start"
        >
          مشاهده صفحه تماس سایت
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'general'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Phone className="w-4 h-4" />
          اطلاعات تماس و برندینگ
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Bell className="w-4 h-4" />
          اعلانات فوری لیدها (SMS / تلگرام)
          {settings.notifications?.smsEnabled || settings.notifications?.telegramEnabled ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          ) : null}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          امنیت و رمز عبور مدیر
        </button>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: GENERAL CONTACT & BRAND */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Card 1: Official Contact Details */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400" />
              اطلاعات تماس رسمی و کاری
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  شماره تلفن ثابت دفتر
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.phone}
                  onChange={(e) => handleGeneralChange('phone', e.target.value)}
                  placeholder="مثال: ۰۲۱-۸۸۲۲۳۳۴۴"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  شماره موبایل هماهنگی و پشتیبانی
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.mobile}
                  onChange={(e) => handleGeneralChange('mobile', e.target.value)}
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  پست الکترونیک رسمی (Email)
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={settings.email}
                  onChange={(e) => handleGeneralChange('email', e.target.value)}
                  placeholder="hello@hooram.studio"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  ساعت پاسخگویی و پذیرش کاری
                </label>
                <input
                  type="text"
                  value={settings.workingHours}
                  onChange={(e) => handleGeneralChange('workingHours', e.target.value)}
                  placeholder="شنبه تا چهارشنبه، ۹:۰۰ الی ۱۸:۰۰"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                نشانی فیزیکی دفتر استودیو
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleGeneralChange('address', e.target.value)}
                placeholder="تهران، خیابان ولیعصر، تقاطع فاطمی، پلاک..."
                className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Card 2: Social Media */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              شبکه‌های اجتماعی و پیام‌رسان‌ها
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  اینستاگرام (Instagram URL)
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={settings.instagram}
                  onChange={(e) => handleGeneralChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/hooram.studio"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <TelegramIcon className="w-3.5 h-3.5 text-cyan-400" />
                  تلگرام (Telegram URL)
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={settings.telegram}
                  onChange={(e) => handleGeneralChange('telegram', e.target.value)}
                  placeholder="https://t.me/hooram_studio"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                  لینکدین (LinkedIn URL)
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={settings.linkedin}
                  onChange={(e) => handleGeneralChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/hooram-studio"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Brand Metadata */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              نام برند و شعار استودیو
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  نام رسمی برند
                </label>
                <input
                  type="text"
                  value={settings.studioName}
                  onChange={(e) => handleGeneralChange('studioName', e.target.value)}
                  placeholder="استودیو تبلیغاتی هورام"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  شعار / زیرعنوان کوتاه استودیو
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleGeneralChange('tagline', e.target.value)}
                  placeholder="از تصور تا تأثیرگذاری | استودیو تبلیغاتی هورام"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={savingSettings}
              icon={<Save className="w-4 h-4 ml-1" />}
              iconPosition="start"
            >
              {savingSettings ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات عمومی'}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: INSTANT NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Notification status banner */}
          <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 bg-indigo-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                سیستم اعلان آنی استعلام‌های جدید (Lead Alerts)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                به محض اینکه مشتری فرم ثبت سفارش را در وب‌سایت پر کند، بلافاصله از طریق پیامک یا پیام‌رسان باخبر شوید.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTestNotification}
              disabled={testingNotification}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shrink-0 shadow-md shadow-indigo-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              {testingNotification ? 'در حال ارسال تست...' : 'ارسال اعلان آزمایشی'}
            </button>
          </div>

          {testSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{testSuccess}</span>
            </div>
          )}

          {/* Section A: SMS Notification */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">اعلان پیامکی برای مدیر (SMS Alert)</h3>
                  <p className="text-[11px] text-slate-400">ارسال پیامک آنی با مشخصات کارفرما و شماره تماس</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications?.smsEnabled || false}
                  onChange={(e) => handleNotificationChange('smsEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  شماره موبایل دریافت‌کننده پیامک
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.notifications?.adminPhone || ''}
                  onChange={(e) => handleNotificationChange('adminPhone', e.target.value)}
                  placeholder="09123456789"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  کلید API سامانه پیامک (کاوه نگار / فراز اس‌ام‌اس)
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={settings.notifications?.smsApiKey || ''}
                  onChange={(e) => handleNotificationChange('smsApiKey', e.target.value)}
                  placeholder="API Key یا توکن اعتبارسنجی..."
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-right"
                />
              </div>
            </div>
          </div>

          {/* Section B: Telegram Bot Notification */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">ربات تلگرام استودیو (Telegram Notification)</h3>
                  <p className="text-[11px] text-slate-400">ارسال مشخصات کامل استعلام در گروه یا چت خصوصی مدیریت</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications?.telegramEnabled || false}
                  onChange={(e) => handleNotificationChange('telegramEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  توکن ربات تلگرام (Bot Token)
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={settings.notifications?.telegramBotToken || ''}
                  onChange={(e) => handleNotificationChange('telegramBotToken', e.target.value)}
                  placeholder="123456789:ABCdefGhIJKlmNoPQRstu..."
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  شناسه کاربری یا گروه (Chat ID)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.notifications?.telegramChatId || ''}
                  onChange={(e) => handleNotificationChange('telegramChatId', e.target.value)}
                  placeholder="مثال: 987654321 یا -100..."
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-left"
                />
              </div>
            </div>
          </div>

          {/* Section C: Webhook Integration */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">وب‌هوک اتصال به CRM یا پیام‌رسان‌های ایرانی (Bale / Eitaa / CRM)</h3>
                  <p className="text-[11px] text-slate-400">ارسال خودکار JSON بریف به وب‌هوک نرم‌افزار مدیریت مشتریان شما</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications?.webhookEnabled || false}
                  onChange={(e) => handleNotificationChange('webhookEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                آدرس وب‌هوک (Endpoint URL)
              </label>
              <input
                type="url"
                dir="ltr"
                value={settings.notifications?.webhookUrl || ''}
                onChange={(e) => handleNotificationChange('webhookUrl', e.target.value)}
                placeholder="https://your-crm.com/api/webhooks/hooram-lead"
                className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-left"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={savingSettings}
              icon={<Save className="w-4 h-4 ml-1" />}
              iconPosition="start"
            >
              {savingSettings ? 'در حال ذخیره‌سازی...' : 'ذخیره تنظیمات اعلانات'}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: ADMIN SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {profileSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{profileError}</span>
            </div>
          )}

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              مشخصات حساب کاربری مدیر
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  نام کامل مدیر
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="مدیر استودیو هورام"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  ایمیل ورود به پنل (Username)
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="admin@hooram.studio"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-right"
                />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              تغییر رمز عبور ورود
            </h2>
            <p className="text-[11px] text-slate-400">
              اگر نمی‌خواهید رمز عبور را تغییر دهید، فیلدهای زیر را خالی بگذارید.
            </p>

            {user?.isDefaultPassword && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed font-light">
                  <span className="font-bold text-amber-300">رمز عبور فعلی شما پیش‌فرض است: </span>
                  جهت ایمن‌سازی پنل مدیریت، لطفاً رمز عبور فعلی (<code className="font-mono text-amber-100 bg-amber-500/20 px-1.5 py-0.5 rounded dir-ltr inline-block">changeme123</code>) را در کادر زیر وارد کرده و یک رمز عبور قوی جدید ثبت کنید.
                </div>
              </div>
            )}

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  رمز عبور فعلی *
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  placeholder="رمز عبور فعلی"
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  رمز عبور جدید (حداقل ۶ کاراکتر)
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  placeholder="رمز عبور قوی جدید..."
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  تکرار رمز عبور جدید
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  placeholder="تکرار رمز عبور جدید..."
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-left"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={savingProfile}
              icon={<ShieldCheck className="w-4 h-4 ml-1" />}
              iconPosition="start"
            >
              {savingProfile ? 'در حال ثبت تغییرات امنیتی...' : 'به‌روزرسانی مشخصات و رمز عبور'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
