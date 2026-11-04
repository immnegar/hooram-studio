import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { readDB, writeDB } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Enforce JWT_SECRET without hardcoded static fallbacks
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('\n======================================================');
    console.error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing!');
    console.error('In production mode, the server will not start without a securely configured JWT_SECRET.');
    console.error('Please configure JWT_SECRET in your .env or server environment.');
    console.error('======================================================\n');
    process.exit(1);
  } else {
    console.warn('[SECURITY WARNING] JWT_SECRET is not set in environment. Generating an ephemeral random secret for development session.');
    JWT_SECRET = crypto.randomBytes(32).toString('hex');
  }
}

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists and is served statically
const uploadsPath = path.resolve(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBase || 'media'}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for high-res video/image
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg|mp4|webm|quicktime|mov/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype.toLowerCase();
    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('تنها فرمت‌های تصویری و ویدیویی مجاز هستند.'));
    }
  }
});

// Notification dispatcher helper
async function dispatchNotification(inquiry, settings) {
  const notif = settings?.notifications;
  if (!notif) return;

  const msg = `🚨 استعلام جدید در استودیو هورام!\n👤 نام: ${inquiry.fullName}\n🏢 برند: ${inquiry.brandName}\n📞 تماس: ${inquiry.phoneNumber}\n🎯 خدمت: ${inquiry.service}\n💰 بودجه: ${inquiry.budget}\n📝 شرح: ${inquiry.description.slice(0, 100)}...`;

  // 1. Webhook notification
  if (notif.webhookEnabled && notif.webhookUrl) {
    try {
      await fetch(notif.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'new_inquiry', text: msg, inquiry })
      });
      console.log('Webhook notification sent successfully.');
    } catch (e) {
      console.error('Webhook notification error:', e.message);
    }
  }

  // 2. Telegram Bot notification
  if (notif.telegramEnabled && notif.telegramBotToken && notif.telegramChatId) {
    try {
      const tgUrl = `https://api.telegram.org/bot${notif.telegramBotToken}/sendMessage`;
      await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: notif.telegramChatId,
          text: msg
        })
      });
      console.log('Telegram notification sent successfully.');
    } catch (e) {
      console.error('Telegram notification error:', e.message);
    }
  }

  // 3. SMS Notification simulation / integration
  if (notif.smsEnabled && notif.adminPhone) {
    console.log(`[SMS Notification to ${notif.adminPhone}]: استعلام جدید از ${inquiry.fullName} (${inquiry.phoneNumber}) دریافت شد.`);
  }
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'دسترسی غیرمجاز: لطفاً وارد حساب خود شوید.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'توکن نامعتبر یا منقضی شده است.' });
    }
    req.user = user;
    next();
  });
}

// ---------------- AUTH ROUTES ----------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'لطفاً ایمیل و رمز عبور را وارد کنید.' });
  }

  const db = readDB();
  if (!db || !db.admin) {
    return res.status(500).json({ error: 'خطای سرور: پایگاه داده در دسترس نیست.' });
  }

  if (email.trim().toLowerCase() !== db.admin.email.toLowerCase()) {
    return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است.' });
  }

  const isMatch = bcrypt.compareSync(password, db.admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است.' });
  }

  db.admin.lastLogin = new Date().toISOString();
  writeDB(db);

  const token = jwt.sign(
    { id: db.admin.id, email: db.admin.email, name: db.admin.name, role: db.admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const isDefaultPassword = db.admin.isDefaultPassword !== undefined
    ? !!db.admin.isDefaultPassword
    : bcrypt.compareSync('changeme123', db.admin.passwordHash);

  res.json({
    token,
    user: {
      id: db.admin.id,
      name: db.admin.name,
      email: db.admin.email,
      role: db.admin.role,
      lastLogin: db.admin.lastLogin,
      isDefaultPassword
    }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = readDB();
  if (!db || !db.admin) {
    return res.status(500).json({ error: 'خطای سرور' });
  }
  const isDefaultPassword = db.admin.isDefaultPassword !== undefined
    ? !!db.admin.isDefaultPassword
    : bcrypt.compareSync('changeme123', db.admin.passwordHash);

  res.json({
    id: db.admin.id,
    name: db.admin.name,
    email: db.admin.email,
    role: db.admin.role,
    lastLogin: db.admin.lastLogin,
    isDefaultPassword
  });
});

// ---------------- PUBLIC / STATS / SETTINGS ----------------
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json(db ? db.settings : {});
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json({ message: 'تنظیمات با موفقیت به‌روزرسانی شد.', settings: db.settings });
});

app.get('/api/stats', authenticateToken, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'خطای سرور' });

  const inquiries = db.inquiries || [];
  const portfolio = db.portfolio || [];

  const statusCounts = {
    'New': 0,
    'Under Review': 0,
    'Contacted': 0,
    'Negotiation': 0,
    'Converted to Project': 0,
    'Archived': 0
  };

  inquiries.forEach(inq => {
    if (statusCounts[inq.status] !== undefined) {
      statusCounts[inq.status]++;
    }
  });

  res.json({
    totalInquiries: inquiries.length,
    statusCounts,
    totalPortfolio: portfolio.length,
    featuredPortfolio: portfolio.filter(p => p.featured).length,
    recentInquiries: inquiries.slice(0, 5)
  });
});

// ---------------- INQUIRIES ROUTES ----------------
app.post('/api/inquiries', (req, res) => {
  const { fullName, brandName, phoneNumber, email, service, description, budget, referenceLink } = req.body;

  // Validation
  if (!fullName || fullName.trim().length < 2) {
    return res.status(400).json({ error: 'نام و نام خانوادگی را به درستی وارد کنید.' });
  }

  const phoneRegex = /^(\+98|0)?9\d{9}$/;
  const cleanPhone = (phoneNumber || '').replace(/\s+/g, '');
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    return res.status(400).json({ error: 'شماره موبایل معتبر نیست (مثال: 09121234567).' });
  }

  if (!service) {
    return res.status(400).json({ error: 'لطفاً خدمت مورد نظر خود را انتخاب نمایید.' });
  }

  if (!description || description.trim().length < 10) {
    return res.status(400).json({ error: 'لطفاً توضیحات مختصری درباره پروژه خود (حداقل ۱۰ کاراکتر) بنویسید.' });
  }

  const db = readDB();
  if (!db) return res.status(500).json({ error: 'خطای سرور در ثبت درخواست' });

  const newInquiry = {
    id: `inq_${Date.now()}`,
    fullName: fullName.trim(),
    brandName: (brandName || '').trim() || 'نامشخص',
    phoneNumber: cleanPhone,
    email: (email || '').trim(),
    service,
    description: description.trim(),
    budget: budget || 'توافقی',
    referenceLink: (referenceLink || '').trim(),
    status: 'New',
    notes: '',
    createdAt: new Date().toISOString()
  };

  db.inquiries = [newInquiry, ...(db.inquiries || [])];
  writeDB(db);

  // Asynchronously dispatch notification
  dispatchNotification(newInquiry, db.settings).catch(err => console.error('Notification failed:', err));

  res.status(201).json({
    success: true,
    message: 'درخواست شما با موفقیت ثبت شد. کارشناسان خلاقیت استودیو هورام ظرف حداکثر ۲۴ ساعت کاری با شما تماس خواهند گرفت.',
    inquiryId: newInquiry.id
  });
});

// ---------------- ADMIN PROFILE & SECURITY ----------------
app.put('/api/admin/profile', authenticateToken, (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const db = readDB();
  if (!db || !db.admin) {
    return res.status(500).json({ error: 'خطای سرور' });
  }

  if (currentPassword) {
    const isMatch = bcrypt.compareSync(currentPassword, db.admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'رمز عبور فعلی اشتباه است.' });
    }
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.' });
      }
      db.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
      db.admin.isDefaultPassword = false;
    }
  }

  if (name && name.trim()) {
    db.admin.name = name.trim();
  }
  if (email && email.trim()) {
    db.admin.email = email.trim().toLowerCase();
  }

  writeDB(db);
  res.json({
    message: 'اطلاعات حساب مدیریت با موفقیت به‌روزرسانی شد.',
    user: {
      id: db.admin.id,
      name: db.admin.name,
      email: db.admin.email,
      role: db.admin.role,
      isDefaultPassword: !!db.admin.isDefaultPassword
    }
  });
});

// Test Notification Endpoint
app.post('/api/admin/test-notification', authenticateToken, async (req, res) => {
  const db = readDB();
  const testInquiry = {
    fullName: 'کارفرمای آزمایشی',
    brandName: 'برند نمونه تست',
    phoneNumber: '09121234567',
    service: 'فیلم و تیزر تبلیغاتی هوش مصنوعی',
    budget: 'توافقی',
    description: 'این یک تست ارسال اعلان بلادرنگ از پنل مدیریت هورام است.'
  };
  await dispatchNotification(testInquiry, db?.settings);
  res.json({ success: true, message: 'سیگنال تست اعلان با موفقیت ارسال شد.' });
});

// ---------------- ADMIN MEDIA UPLOAD ----------------
app.post('/api/admin/upload', authenticateToken, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'خطا در بارگذاری فایل' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'هیچ فایلی ارسال نشده است.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

app.get('/api/inquiries', authenticateToken, (req, res) => {
  const db = readDB();
  let inquiries = db ? db.inquiries || [] : [];
  const { status } = req.query;

  if (status) {
    inquiries = inquiries.filter(i => i.status === status);
  }

  res.json(inquiries);
});

app.patch('/api/inquiries/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['New', 'Under Review', 'Contacted', 'Negotiation', 'Converted to Project', 'Archived'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'وضعیت درخواستی معتبر نیست.' });
  }

  const db = readDB();
  const inquiryIndex = db.inquiries.findIndex(i => i.id === id);

  if (inquiryIndex === -1) {
    return res.status(404).json({ error: 'درخواست یافت نشد.' });
  }

  if (status !== undefined) db.inquiries[inquiryIndex].status = status;
  if (notes !== undefined) db.inquiries[inquiryIndex].notes = notes;
  db.inquiries[inquiryIndex].updatedAt = new Date().toISOString();

  writeDB(db);
  res.json(db.inquiries[inquiryIndex]);
});

app.delete('/api/inquiries/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => i.id !== id);

  if (db.inquiries.length === initialLength) {
    return res.status(404).json({ error: 'درخواست یافت نشد.' });
  }

  writeDB(db);
  res.json({ message: 'درخواست با موفقیت حذف گردید.' });
});

// ---------------- PORTFOLIO ROUTES ----------------
app.get('/api/portfolio', (req, res) => {
  const db = readDB();
  const portfolio = db ? db.portfolio || [] : [];
  res.json(portfolio);
});

app.get('/api/portfolio/:slugOrId', (req, res) => {
  const { slugOrId } = req.params;
  const db = readDB();
  const portfolio = db ? db.portfolio || [] : [];

  const item = portfolio.find(p => p.slug === slugOrId || p.id === slugOrId);
  if (!item) {
    return res.status(404).json({ error: 'پروژه‌ای با این مشخصات یافت نشد.' });
  }

  res.json(item);
});

app.post('/api/portfolio', authenticateToken, (req, res) => {
  const { title, englishTitle, category, coverImage, summary, description, challenge, solution, client, duration, year, featured, videoPreviewUrl, gallery, toolsUsed, deliverables } = req.body;

  if (!title || !category || !coverImage) {
    return res.status(400).json({ error: 'عنوان، دسته‌بندی و تصویر کاور الزامی هستند.' });
  }

  const db = readDB();
  const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-') + '-' + Date.now();

  const newProject = {
    id: `port_${Date.now()}`,
    slug,
    title,
    englishTitle: englishTitle || '',
    category,
    categoryFa: category === 'AI Advertising Videos' ? 'تیزرهای تبلیغاتی هوش مصنوعی' :
                category === 'Product Commercials' ? 'ویدیوهای تجاری محصول' :
                category === 'Creative Campaigns' ? 'کمپین‌های خلاق تبلیغاتی' : 'طراحی و توسعه وب‌سایت',
    coverImage,
    gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [coverImage],
    videoPreviewUrl: videoPreviewUrl || '',
    client: client || 'کانسپت استودیو',
    year: year || '۱۴۰۳',
    duration: duration || 'سفارشی',
    isConcept: true,
    featured: !!featured,
    summary: summary || '',
    challenge: challenge || '',
    solution: solution || '',
    deliverables: Array.isArray(deliverables) ? deliverables : ['تحویل فایل نهایی با کیفیت بالا'],
    toolsUsed: Array.isArray(toolsUsed) ? toolsUsed : ['Midjourney', 'Runway', 'Adobe Suite'],
    createdAt: new Date().toISOString()
  };

  db.portfolio = [newProject, ...(db.portfolio || [])];
  writeDB(db);

  res.status(201).json(newProject);
});

app.put('/api/portfolio/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.portfolio.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'پروژه یافت نشد.' });
  }

  db.portfolio[index] = {
    ...db.portfolio[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json(db.portfolio[index]);
});

app.delete('/api/portfolio/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = db.portfolio.length;
  db.portfolio = db.portfolio.filter(p => p.id !== id);

  if (db.portfolio.length === initialLength) {
    return res.status(404).json({ error: 'پروژه یافت نشد.' });
  }

  writeDB(db);
  res.json({ message: 'پروژه با موفقیت حذف گردید.' });
});

// ---------------- SERVICES ROUTES ----------------
app.get('/api/services', (req, res) => {
  const db = readDB();
  res.json(db ? db.services || [] : []);
});

app.put('/api/services/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.services.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'سرویس یافت نشد.' });
  }

  db.services[index] = {
    ...db.services[index],
    ...req.body
  };

  writeDB(db);
  res.json(db.services[index]);
});

// ---------------- SEO AUTOMATION: SITEMAP & ROBOTS ----------------
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'hooram.studio';
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const baseUrl = `${protocol}://${host}`;

  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /admin/*

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.type('text/plain').send(robots);
});

app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'hooram.studio';
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const baseUrl = `${protocol}://${host}`;
  const now = new Date().toISOString().slice(0, 10);

  const db = readDB();
  const portfolio = db?.portfolio || [];

  const staticUrls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/services', priority: '0.9', changefreq: 'weekly' },
    { loc: '/portfolio', priority: '0.9', changefreq: 'daily' },
    { loc: '/process', priority: '0.7', changefreq: 'monthly' },
    { loc: '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
  ];

  const projectUrls = portfolio.map(p => ({
    loc: `/portfolio/${p.slug}`,
    priority: p.featured ? '0.8' : '0.6',
    changefreq: 'weekly',
    lastmod: p.updatedAt ? p.updatedAt.slice(0, 10) : p.createdAt ? p.createdAt.slice(0, 10) : now
  }));

  const allUrls = [...staticUrls, ...projectUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${u.lastmod || now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.type('application/xml').send(sitemapXml);
});

// Serve frontend build static files in production if dist exists
const distPath = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'آدرس API مورد نظر یافت نشد.' });
  }

  // Fallback to React SPA index.html
  if (fs.existsSync(indexPath)) {
    return res.sendFile('index.html', { root: distPath }, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('خطا در بارگذاری برنامه وب.');
      }
    });
  }

  res.status(200).send(`
    <html dir="rtl" style="font-family: sans-serif; text-align: center; padding-top: 50px;">
      <h2>سرور API استودیو هورام فعال است.</h2>
      <p>پوشه بیلد کلاینت هنوز ایجاد نشده است. لطفاً دستور <code>npm run build</code> را اجرا نمایید یا در حالت توسعه از آدرس <code>http://localhost:3000</code> استفاده کنید.</p>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Hooram Studio API Server is listening on http://localhost:${PORT}`);
});
