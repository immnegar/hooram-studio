export type PortfolioCategory =
  | 'فیلم‌های تبلیغاتی'
  | 'تیزرهای محصول'
  | 'کمپین‌های خلاقانه'
  | 'طراحی وب‌سایت'
  | 'AI Advertising Videos'
  | 'Product Commercials'
  | 'Creative Campaigns'
  | 'Website Design';

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  englishTitle?: string;
  category: string;
  categoryFa: string;
  coverImage: string;
  gallery: string[];
  videoPreviewUrl?: string;
  client: string;
  year: string;
  duration?: string;
  isConcept: boolean;
  featured: boolean;
  summary: string;
  challenge?: string;
  solution?: string;
  deliverables?: string[];
  toolsUsed?: string[];
  createdAt?: string;
}

export type InquiryStatus =
  | 'New'
  | 'Under Review'
  | 'Contacted'
  | 'Negotiation'
  | 'Converted to Project'
  | 'Archived';

export interface ProjectInquiry {
  id: string;
  fullName: string;
  brandName?: string;
  phoneNumber: string;
  email?: string;
  service: string;
  description: string;
  budget?: string;
  referenceLink?: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  category: 'A' | 'B' | 'C';
  title: string;
  englishTitle: string;
  shortDescription: string;
  icon: string;
  color: string;
  badge: string;
  subServices: string[];
  benefits: string[];
  technologies: string[];
}

export interface StudioNotifications {
  smsEnabled: boolean;
  smsProvider?: string;
  smsApiKey?: string;
  adminPhone: string;
  telegramEnabled: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  webhookEnabled: boolean;
  webhookUrl?: string;
}

export interface StudioSettings {
  studioName: string;
  tagline: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  instagram: string;
  telegram: string;
  linkedin: string;
  workingHours: string;
  notifications?: StudioNotifications;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
  isDefaultPassword?: boolean;
}

export interface DashboardStats {
  totalInquiries: number;
  statusCounts: Record<InquiryStatus, number>;
  totalPortfolio: number;
  featuredPortfolio: number;
  recentInquiries: ProjectInquiry[];
}
