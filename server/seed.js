import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function generateSeedData() {
  const salt = bcrypt.genSaltSync(10);
  const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || 'changeme123';
  const defaultEmail = process.env.ADMIN_EMAIL || 'admin@hooram.studio';
  const passwordHash = bcrypt.hashSync(defaultPass, salt);

  const initialData = {
    admin: {
      id: 'admin_1',
      name: 'مدیر ارشد استودیو تبلیغاتی هورام',
      email: defaultEmail,
      passwordHash: passwordHash,
      role: 'superadmin',
      isDefaultPassword: true,
      lastLogin: new Date().toISOString()
    },
    services: [
      {
        id: 'srv_1',
        category: 'A',
        title: 'تولید فیلم و ویدئوی تبلیغاتی',
        englishTitle: 'Advertising Video Production',
        shortDescription: 'خلق تیزرهای تجاری و فیلم‌های تبلیغاتی سینمایی با بالاترین استانداردهای بصری و روایت‌گری جذاب برای برندها و محصولات.',
        icon: 'Video',
        color: 'from-purple-500/20 to-indigo-500/10',
        badge: 'دپارتمان تصویر و ویدیو',
        subServices: [
          'تیزرهای تجاری و تبلیغاتی سینمایی (Commercial Videos)',
          'فیلم‌های معرفی محصول با نورپردازی و جلوه‌های بصری پیشرفته',
          'ویدئوهای برندینگ و هویت روایی سازمانی',
          'تبلیغات سینمایی و تلویزیونی با استاندارد 4K',
          'محتوای تبلیغاتی سوشال مدیا (Social Ads & Reels)',
          'انیمیشن‌های سه‌بعدی و جلوه‌های ویژه رایانه‌ای'
        ],
        benefits: [
          'کارگردانی هنری دقیق با نگاه به استانداردهای بین‌المللی',
          'اصلاح رنگ حرفه‌ای در نرم‌افزارهای سینمایی (DaVinci Resolve)',
          'صداگذاری چندبعدی و نریشن با گویندگان شاخص',
          'سرعت تحویل شفاف و نسخه‌های اختصاصی شبکه‌های اجتماعی'
        ],
        technologies: ['Cinema 4D', 'DaVinci Resolve Studio', 'After Effects', 'Red Digital Cinema', 'Blender']
      },
      {
        id: 'srv_2',
        category: 'B',
        title: 'طراحی و توسعه وب‌سایت',
        englishTitle: 'Website Design & Development',
        shortDescription: 'طراحی رابط‌های کاربری چشم‌نواز، بهینه‌سازی دقیق تجربه کاربر (UX) و پیاده‌سازی سریع‌ترین وب‌سایت‌های سازمانی، شرکتی و فروشگاهی.',
        icon: 'Globe',
        color: 'from-cyan-500/20 to-blue-500/10',
        badge: 'دپارتمان وب و محصول دیجیتال',
        subServices: [
          'طراحی سایت‌های شرکتی و سازمانی لوکس (Corporate Websites)',
          'طراحی فروشگاه‌های آنلاین مدرن و با کارایی بالا (E-commerce Platforms)',
          'لندینگ‌پیج‌های با نرخ تبدیل بالا برای کمپین‌ها (Landing Pages)',
          'طراحی اختصاصی رابط کاربری در فیگما (Bespoke UI/UX)',
          'توسعه وب‌اپلیکیشن‌های سفارشی متناسب با نیاز بیزنس'
        ],
        benefits: [
          'طراحی کاملاً سفارشی و اختصاصی متناسب با هویت برند (بدون قالب‌های آماده)',
          'پشتیبانی بی‌نقص از زبان فارسی، تایپوگرافی چشم‌نواز و استاندارد کامل RTL',
          'سرعت بارگذاری فوق‌العاده بالا و سازگاری کامل با سرورهای داخل کشور',
          'بهینه‌سازی سئو تکنیکال برای دیده‌شدن در صدر نتایج گوگل'
        ],
        technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Figma', 'Node.js']
      }
    ],
    portfolio: [
      {
        id: 'port_1',
        slug: 'laneige-sleeping-mask-commercial',
        title: 'تیزر تبلیغاتی ماسک شب «لانیژ»',
        englishTitle: 'Laneige Sleeping Mask Commercial Teaser',
        category: 'فیلم‌های تبلیغاتی',
        categoryFa: 'فیلم‌های تبلیغاتی',
        coverImage: '/uploads/laneige_cover_hero.jpg',
        gallery: [
          '/uploads/laneige_cover_hero.jpg',
          '/uploads/laneige_gallery_1.jpg',
          '/uploads/laneige_gallery_2.jpg',
          '/uploads/laneige_gallery_3.jpg'
        ],
        videoPreviewUrl: '/videos/portfolio/laneige-sleeping-mask.mp4',
        client: 'برند آرایشی و مراقبت پوست لانیژ (کانسپت استودیو)',
        year: '۱۴۰۳',
        duration: '۱۰ ثانیه (سوشال و ریلز)',
        isConcept: true,
        featured: true,
        summary: 'خلق تیزر تجاری چشم‌نواز در بستری از طبیعت ارگانیک و نورپردازی استودیویی برای معرفی ماسک شب آبرسان لانیژ.',
        challenge: 'انتقال بی‌واسطه حس شادابی و طراوت پوست، بافت ابریشمی محصول و خلوص عصاره‌های ارگانیک در قالب یک تیزر عمودی پرکشش برای ریلز شبکه‌های اجتماعی.',
        solution: 'کارگردانی هنری با تم سبز زمردی، همراهی مدل در محیطی سرسبز از خزه و برگ‌های خیس باران، ثبت کلوزآپ‌های شفاف از جذب کرم و فوکوس سینمایی بر قطرات شبنم نشسته روی شیشه محصول.'
      },
      {
        id: 'port_2',
        slug: 'tondar-vibe-energy-drink',
        title: 'کمپین معرفی نوشیدنی انرژی‌زا «تندر وایب»',
        englishTitle: 'Tondar Vibe Energy Commercial',
        category: 'تیزرهای محصول',
        categoryFa: 'تیزرهای محصول',
        coverImage: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80'
        ],
        videoPreviewUrl: '/videos/hero-showreel.mp4',
        client: 'نوشیدنی‌های انرژی‌زا تندر (کانسپت استودیو)',
        year: '۱۴۰۳',
        duration: '۳۰ ثانیه',
        isConcept: true,
        featured: true,
        summary: 'شبیه‌سازی انفجار مایع نئونی، یخ‌های شناور و انیمیشن پرانرژی قوطی محصول با زاویه دوربین‌های پرسرعت.',
        challenge: 'نمایش پاشش قطرات با وضوح فوق‌العاده بالا و ترکیب نورهای نئونی سایبرپانکی با قوطی آلومینیومی.',
        solution: 'طراحی سه‌بعدی شبیه‌سازی سیالات و کامپوزیت نورهای فرابنفش همراه با باند صوتی پرهیجان جوان‌پسند.'
      },
      {
        id: 'port_3',
        slug: 'zarrin-saffron-campaign',
        title: 'کمپین بین‌المللی «طلای سرخ زرین»',
        englishTitle: 'Zarrin Saffron Global Branding Campaign',
        category: 'کمپین‌های خلاقانه',
        categoryFa: 'کمپین‌های خلاقانه',
        coverImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80'
        ],
        videoPreviewUrl: '/videos/hero-showreel.mp4',
        client: 'صنایع کشاورزی و صادرات زرین (کانسپت استودیو)',
        year: '۱۴۰۳',
        duration: 'کمپین چندرسانه‌ای',
        isConcept: true,
        featured: true,
        summary: 'ترکیب نقوش مینیاتور اصیل ایرانی با فضای مدرن بین‌المللی برای برندینگ صادراتی زعفران سوپرنگین.',
        challenge: 'ایجاد پیوند میان هویت تاریخی زعفران با ذائقه لوکس و مینیمال مشتریان بازارهای صادراتی.',
        solution: 'تدوین سناریوی روایی شاعرانه، عکاسی تبلیغاتی هایپررئال و ویدیوهای کوتاه تبلیغاتی ویژه نمایشگاه‌های خارجی.'
      },
      {
        id: 'port_4',
        slug: 'arka-architectural-platform',
        title: 'پلتفرم دیجیتال هلدینگ معماری «آرکا»',
        englishTitle: 'Arka Architectural Group Digital Platform',
        category: 'طراحی وب‌سایت',
        categoryFa: 'طراحی وب‌سایت',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
        ],
        videoPreviewUrl: '',
        client: 'گروه معماری و مهندسی آرکا (کانسپت استودیو)',
        year: '۱۴۰۳',
        duration: 'طراحی و پیاده‌سازی وب‌سایت',
        isConcept: true,
        featured: true,
        summary: 'وب‌سایتی با مینیمالیسم رادیکال، تعاملات نرم و گالری‌های تصویری برای نمایش پروژه‌های برنده جوایز بین‌المللی آرکا.',
        challenge: 'وب‌سایت قبلی کارفرما کند، نامتناسب با صفحات موبایل و فاقد حس لوکس و مدرن پروژه‌های معماری شرکت بود.',
        solution: 'طراحی مجدد تجربه کاربر در فیگما، پیاده‌سازی فرانت‌اند فوق‌سریع با ری‌اکت و تایپ‌اسکریپت با نرخ فریم ۶۰ در ثانیه.'
      },
      {
        id: 'port_5',
        slug: 'delavar-eco-fashion',
        title: 'فروشگاه آنلاین پوشاک لوکس «دلاور»',
        englishTitle: 'Delavar Fashion E-commerce Platform',
        category: 'طراحی وب‌سایت',
        categoryFa: 'طراحی وب‌سایت',
        coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80'
        ],
        videoPreviewUrl: '',
        client: 'برند پوشاک دلاور (کانسپت استودیو)',
        year: '۱۴۰۳',
        duration: 'پلتفرم تجارت الکترونیک مدرن',
        isConcept: true,
        featured: false,
        summary: 'طراحی فروشگاه اینترنتی متمایز با سرعت بالا و تجربه خرید بدون اصطکاک بر روی گوشی‌های هوشمند.',
        challenge: 'کاهش اصطکاک مراحل ثبت سفارش و سبد خرید در فروشگاه‌های موبایلی و تطبیق با درگاه‌های شتاب.',
        solution: 'طراحی تک‌صفحه‌ای سبد خرید (One-step checkout)، اتصال سریع به درگاه بانکی و انیمیشن‌های مینیمال محصول.'
      },
      {
        id: 'port_6',
        slug: 'tousan-automotive-teaser',
        title: 'تیزر تجاری خودرو «توسن جی‌تی»',
        englishTitle: 'Tousan GT Commercial Teaser',
        category: 'فیلم‌های تبلیغاتی',
        categoryFa: 'فیلم‌های تبلیغاتی',
        coverImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
        ],
        videoPreviewUrl: '/videos/hero-showreel.mp4',
        client: 'خودروهای اسپرت توسن (کانسپت استودیو)',
        year: '۱۴۰۳',
        duration: '۶۰ ثانیه',
        isConcept: true,
        featured: false,
        summary: 'روایتی سینمایی از شتاب در جاده‌های کوهستانی البرز با کانسپت هایپرکار با نورپردازی داینامیک در باران شبانه.',
        challenge: 'شبیه‌سازی رانندگی پرسرعت در باران شبانه با بازتاب نورهای داینامیک و حفظ انطباق آیرودینامیک خودرو.',
        solution: 'رندرهای سه‌بعدی سنگین فوتورئال و تدوین پرشتاب با افکت‌های صدای طبیعی موتور توربو.'
      }
    ],
    inquiries: [
      {
        id: 'inq_1',
        fullName: 'مهندس حسام امینی',
        brandName: 'شرکت فناوران عصر نوین',
        phoneNumber: '09123456789',
        email: 'amini@novintech.ir',
        service: 'تولید ویدئوی تبلیغاتی',
        description: 'ما برای رونمایی از نرم‌افزار سازمانی جدیدمون در نمایشگاه به یک تیزر ۲ دقیقه‌ای هیجانی و سینمایی با جلوه‌های بصری نیاز داریم.',
        budget: '۵۰ تا ۱۰۰ میلیون تومان',
        referenceLink: 'https://example.com/sample-reference',
        status: 'Contacted',
        notes: 'تماس اولیه تلفنی برقرار شد. کارفرما در انتظار پیش‌پروپوزال سناریو است.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'inq_2',
        fullName: 'خانم سارا کریمی',
        brandName: 'استودیو طراحی جواهرات الیا',
        phoneNumber: '09351234567',
        email: 'info@eliagems.com',
        service: 'طراحی و توسعه وب‌سایت',
        description: 'طراحی یک وب‌سایت فروشگاهی جواهرات با ظاهر بسیار لوکس، مینیمال و اتصال به درگاه پرداخت مستقیم.',
        budget: '۵۰ تا ۱۰۰ میلیون تومان',
        referenceLink: '',
        status: 'Under Review',
        notes: 'بریف طراحی رابط کاربری در حال بررسی است.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    settings: {
      studioName: 'استودیو تبلیغاتی هورام',
      tagline: 'از تصور تا تأثیرگذاری | تولید فیلم‌های تبلیغاتی و طراحی وب‌سایت',
      phone: '',
      mobile: '۰۹۱۲۸۵۴۸۶۲۳',
      email: 'hello@hooram.studio',
      address: '',
      instagram: 'https://instagram.com/hooram.studio',
      telegram: 'https://t.me/hooram_studio',
      linkedin: 'https://linkedin.com/company/hooram-studio',
      workingHours: 'شنبه تا چهارشنبه ۹:۰۰ الی ۱۸:۰۰'
    }
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('Seed database updated successfully at:', DATA_FILE);
}

generateSeedData();
