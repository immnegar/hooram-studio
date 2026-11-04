import { PortfolioItem, ProjectInquiry, ServiceItem, StudioSettings, DashboardStats, AdminUser } from '../types';

const BASE_URL = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('hooram_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public
  async getSettings(): Promise<StudioSettings> {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error('خطا در دریافت اطلاعات استودیو');
    return res.json();
  },

  async updateSettings(data: Partial<StudioSettings>): Promise<{ message: string; settings: StudioSettings }> {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('خطا در به‌روزرسانی تنظیمات استودیو');
    return res.json();
  },

  async getServices(): Promise<ServiceItem[]> {
    const res = await fetch(`${BASE_URL}/services`);
    if (!res.ok) throw new Error('خطا در دریافت فهرست خدمات');
    return res.json();
  },

  async getPortfolio(): Promise<PortfolioItem[]> {
    const res = await fetch(`${BASE_URL}/portfolio`);
    if (!res.ok) throw new Error('خطا در دریافت نمونه‌کارها');
    return res.json();
  },

  async getPortfolioBySlug(slug: string): Promise<PortfolioItem> {
    const res = await fetch(`${BASE_URL}/portfolio/${slug}`);
    if (!res.ok) throw new Error('پروژه مورد نظر یافت نشد.');
    return res.json();
  },

  async submitInquiry(data: Partial<ProjectInquiry>): Promise<{ success: boolean; message: string; inquiryId?: string }> {
    const res = await fetch(`${BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'خطا در ثبت درخواست');
    }
    return json;
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'خطا در ورود به پنل');
    }
    return json;
  },

  async checkAuth(): Promise<AdminUser> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('توکن نامعتبر است');
    return res.json();
  },

  // Admin Inquiries
  async getAdminInquiries(status?: string): Promise<ProjectInquiry[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${BASE_URL}/inquiries${query}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('خطا در دریافت درخواست‌های ثبت شده');
    return res.json();
  },

  async updateInquiry(id: string, updates: { status?: string; notes?: string }): Promise<ProjectInquiry> {
    const res = await fetch(`${BASE_URL}/inquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('خطا در به‌روزرسانی درخواست');
    return res.json();
  },

  async deleteInquiry(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/inquiries/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('خطا در حذف درخواست');
  },

  // Admin Portfolio
  async createPortfolioItem(data: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const res = await fetch(`${BASE_URL}/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('خطا در ثبت نمونه‌کار جدید');
    return res.json();
  },

  async updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const res = await fetch(`${BASE_URL}/portfolio/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('خطا در به‌روزرسانی پروژه');
    return res.json();
  },

  async deletePortfolioItem(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/portfolio/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('خطا در حذف پروژه');
  },

  // Admin Services
  async updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('خطا در ویرایش خدمت');
    return res.json();
  },

  // Admin Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${BASE_URL}/stats`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('خطا در دریافت آمار پنل مدیریت');
    return res.json();
  },

  // Media Upload
  async uploadMedia(file: File): Promise<{ url: string; filename: string; originalName: string; size: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('hooram_admin_token');
    const res = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'خطا در بارگذاری فایل');
    }
    return json;
  },

  // Admin Profile & Security
  async updateAdminProfile(data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }): Promise<{ message: string; user: AdminUser }> {
    const res = await fetch(`${BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'خطا در به‌روزرسانی اطلاعات حساب');
    }
    return json;
  },

  // Notification Test
  async testNotification(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/admin/test-notification`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'خطا در ارسال تست اعلان');
    }
    return json;
  },
};

