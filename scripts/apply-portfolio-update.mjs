import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '..', 'server', 'data', 'db.json');

if (!fs.existsSync(dbPath)) {
  console.error('db.json not found at:', dbPath);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
if (!Array.isArray(db.portfolio)) {
  db.portfolio = [];
}

// 1. Update / Enrich Glow Beauty Website Portfolio item (port_1795298229144)
let pSite = db.portfolio.find(p => p.id === 'port_1795298229144');
if (!pSite) {
  pSite = { id: 'port_1795298229144' };
  db.portfolio.unshift(pSite);
}
pSite.slug = 'glow-beauty-skincare-ecommerce';
pSite.title = 'فروشگاه آنلاین تخصصی مراقبت پوست «گلو بیوتی»';
pSite.englishTitle = 'Glow Beauty — Luxury Skincare & Cosmetics E-commerce Platform';
pSite.category = 'طراحی وب‌سایت';
pSite.categoryFa = 'طراحی و توسعه وب‌سایت';
pSite.coverImage = pSite.coverImage || '/uploads/frame_cover_1795298145898_1795298147413-45652.jpg';
pSite.gallery = [
  pSite.coverImage,
  '/uploads/glow_beauty_gallery_1.jpg',
  '/uploads/glow_beauty_gallery_2.jpg'
];
pSite.videoPreviewUrl = pSite.videoPreviewUrl || '/uploads/Screen_Recording_2026-11-22_01_1795298123438-418396.mp4';
pSite.client = 'برند مراقبت پوست و زیبایی گلو بیوتی (Glow Beauty)';
pSite.year = '۱۴۰۳';
pSite.duration = 'طراحی UI/UX و پیاده‌سازی کامل فرانت‌اند';
pSite.isConcept = true;
pSite.featured = true;
pSite.summary = 'طراحی و توسعه یک پلتفرم تجارت الکترونیک لوکس، مدرن و فوق‌سریع برای فروشگاه تخصصی محصولات درمانی و مراقبت از پوست «گلو بیوتی»؛ همراه با انیمیشن‌های نرم، ناوبری شناور موبایلی و رابط کاربری اختصاصی برای تجربه خرید بدون دغدغه.';
pSite.challenge = 'بازارهای آنلاین آرایشی معمولاً شلوغ، پیچیده و خسته‌کننده‌اند. چالش اصلی، خلق فضایی مینیمال با پالت لوکس مشکی و طلایی، دسته‌بندی شفاف محصولات پوستی، فیلترهای پیشرفته و بهینه‌سازی نرخ تبدیل (CRO) روی گوشی‌های موبایل بود.';
pSite.solution = 'طراحی تجربه کاربری در فیگما با رویکرد Mobile-First، پیاده‌سازی فرانت‌اند با React 18، تایپ‌اسکریپت و Tailwind CSS، افزودن سبد خرید روان (Flyout Cart)، ناوبری شناور پایین صفحه (Mobile Bottom Nav) و اجرای کامل استاندارد رندرینگ ۶۰ فریم در ثانیه.';
pSite.deliverables = [
  'طراحی جامع UI/UX در فیگما (موبایل و دسکتاپ)',
  'کدنویسی فرانت‌اند مدرن با React 18 و Tailwind CSS',
  'طراحی کامپوننت‌های سبد خرید، فیلترها و ویترین محصولات',
  'نسخه آماده استقرار (Production Build) فوق‌سبک و بهینه'
];
pSite.toolsUsed = ['Figma', 'React', 'TypeScript', 'Tailwind CSS', 'Vite'];
pSite.updatedAt = new Date().toISOString();

// 2. Add / Update Medical Surgical Commercial (InShot Video)
let pMed = db.portfolio.find(p => p.id === 'port_medical_clinic');
if (!pMed) {
  pMed = { id: 'port_medical_clinic' };
  db.portfolio.unshift(pMed);
}
pMed.slug = 'advanced-surgical-center-commercial';
pMed.title = 'تیزر تبلیغاتی مرکز جراحی و کلینیک فوق‌تخصصی';
pMed.englishTitle = 'Advanced Surgical Center & Specialist Medical Clinic Commercial';
pMed.category = 'فیلم‌های تبلیغاتی';
pMed.categoryFa = 'فیلم‌های تبلیغاتی';
pMed.coverImage = '/uploads/medical_clinic_cover.jpg';
pMed.gallery = [
  '/uploads/medical_clinic_cover.jpg',
  '/uploads/medical_clinic_gallery_1.jpg',
  '/uploads/medical_clinic_gallery_2.jpg',
  '/uploads/medical_clinic_gallery_3.jpg',
  '/uploads/medical_clinic_gallery_4.jpg'
];
pMed.videoPreviewUrl = '/videos/portfolio/medical-clinic-commercial.mp4';
pMed.client = 'مرکز جراحی و کلینیک فوق‌تخصصی (کانسپت استودیو)';
pMed.year = '۱۴۰۳';
pMed.duration = '۴۵ ثانیه (ریلز عمودی)';
pMed.isConcept = true;
pMed.featured = true;
pMed.summary = 'روایتی سینمایی و عمیقاً انسانی از اتاق عمل یک مرکز جراحی فوق‌تخصصی؛ از آمادگی تیم جراحی و آرامش قبل از عمل تا بازیابی سلامتی، لبخند رضایت بیمار و نگاهی سرشار از امید به آینده.';
pMed.challenge = 'ایجاد اعتماد، حس آرامش و امنیت روانی برای بیمارانی که با استرس و نگرانی مواجه هستند؛ بازآفرینی فضای واقعی و استریل اتاق عمل با تجهیزات مدرن پزشکی و نورپردازی حرفه‌ای سینمایی بدون نیاز به هماهنگی‌های پیچیده و پرهزینه فیلمبرداری در محیط‌های بیمارستانی فعال.';
pMed.solution = 'کارگردانی هنری واقع‌گرایانه با پالت رنگی آبی کبالت و سبز استریل، فوکوس ماکرو و احساسی بر قرنیه و نگاه بیمار، و بازسازی دقیق تیم جراحی و تجهیزات پایش علائم حیاتی. تمام پلان‌ها با جدیدترین ابزارهای هوش مصنوعی و بهینه‌سازی رنگ و صدا در استودیو هورام تولید شده‌اند تا استانداردهای جهانی ویدیوهای پزشکی و کلینیکی را به نمایش بگذارند.';
pMed.deliverables = [
  'تیزر سینمایی با کیفیت 4K برای کمپین‌های دیجیتال',
  'نسخه ریلز و استوری عمودی (۹:۱۶) متناسب با اینستاگرام',
  'کاور و فریم‌های منتخب با وضوح بالا برای وب‌سایت و بنر'
];
pMed.toolsUsed = ['Midjourney v6', 'Runway Gen-3', 'Adobe Premiere & After Effects', 'Sound Design Suite'];
pMed.updatedAt = new Date().toISOString();

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Portfolio successfully updated in db.json!');
console.log('- Glow Beauty website updated:', pSite.title);
console.log('- Medical clinic commercial added:', pMed.title);
