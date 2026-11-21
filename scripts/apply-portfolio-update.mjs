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

// 2. Add / Update Viral Coffee Commercial (InShot Video)
let pCoffee = db.portfolio.find(p => p.id === 'port_medical_clinic');
if (!pCoffee) {
  pCoffee = { id: 'port_medical_clinic' };
  db.portfolio.unshift(pCoffee);
}
pCoffee.slug = 'coffee-stronger-than-anesthesia-commercial';
pCoffee.title = 'تیزر تبلیغاتی خلاقانه قهوه؛ قوی‌تر از داروی بیهوشی!';
pCoffee.englishTitle = 'Viral Coffee Commercial — Stronger Than Anesthesia';
pCoffee.category = 'کمپین‌های خلاقانه';
pCoffee.categoryFa = 'کمپین‌های خلاقانه';
pCoffee.coverImage = '/uploads/medical_clinic_cover.jpg';
pCoffee.gallery = [
  '/uploads/medical_clinic_cover.jpg',
  '/uploads/medical_clinic_gallery_1.jpg',
  '/uploads/medical_clinic_gallery_2.jpg',
  '/uploads/medical_clinic_gallery_3.jpg',
  '/uploads/medical_clinic_gallery_4.jpg'
];
pCoffee.videoPreviewUrl = '/videos/portfolio/medical-clinic-commercial.mp4';
pCoffee.client = 'برند قهوه انرژی‌بخش (کمپین اختصاصی هورام)';
pCoffee.year = '۱۴۰۳';
pCoffee.duration = '۴۵ ثانیه (ریلز وایرال)';
pCoffee.isConcept = true;
pCoffee.featured = true;
pCoffee.summary = 'روایتی کمدی، غافلگیرکننده و پرکشش برای نمایش قدرت و کافئین فوق‌العاده قهوه؛ در اتاق عمل، ماسک گاز بیهوشی روی صورت بیمار قرار می‌گیرد اما قهوه‌ای که نوشیده به قدری بیدارکننده و سرحال است که اثر داروی بیهوشی خنثی شده و بیمار با نشاط کامل تیم جراحی را مبهوت می‌سازد!';
pCoffee.challenge = 'عبور از کلیشه‌های فرسوده تبلیغات قهوه (مانند بخار ملایم فنجان یا صبح‌های پاییزی) و خلق یک سناریوی ویروسی و پربازدید در شبکه‌های اجتماعی که بتواند پیام «اوج تمرکز، انرژی و بی‌خوابی خوشایند» را با طنزی ماندگار در ذهن مخاطب ثبت کند.';
pCoffee.solution = 'کارگردانی تضاد موقعیت: قرار دادن فضای فوق‌العاده جدی و استریل اتاق عمل در برابر انرژی مهارنشدنی بیمار. هدایت میمیک چهره، نگاه کاملاً هشیار، لبخند سرحال پس از استنشاق گاز و نگاه شگفت‌زده جراح؛ تمامی این سکانس‌ها با ابزارهای پیشرفته هوش مصنوعی و طراحی صدای پرتعلیق، بدون نیاز به اجاره لوکیشن‌های گران‌قیمت در استودیو هورام خلق شدند.';
pCoffee.deliverables = [
  'تیزر ویدیویی عمودی (۹:۱۶) بهینه‌شده برای اکسپلور و ریلز اینستاگرام',
  'نسخه باکیفیت 4K برای یوتیوب شورتس و تیک‌تاک',
  'پک فریم‌های منتخب و کاور با نرخ کلیک (CTR) بالا'
];
pCoffee.toolsUsed = ['Midjourney v6', 'Runway Gen-3', 'Adobe Premiere & After Effects', 'Sound Design Suite'];
pCoffee.updatedAt = new Date().toISOString();

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Portfolio successfully updated in db.json!');
console.log('- Glow Beauty website updated:', pSite.title);
console.log('- Viral Coffee Commercial updated:', pCoffee.title);
