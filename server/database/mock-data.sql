-- ============================================
-- MOCK DATA FOR LOCAL TESTING (Cloudflare D1 / SQLite)
-- ============================================
-- Idempotent: run this file any number of times safely.
-- Login password for admin@example.com: password123
-- ============================================

-- ⚠️ Clear existing data
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

DELETE FROM "blog_comment_likes";
DELETE FROM "blog_comments";
DELETE FROM "blog_post_categories";
DELETE FROM "blog_posts_locales";
DELETE FROM "blog_posts";
DELETE FROM "blog_categories_locales";
DELETE FROM "blog_categories";
DELETE FROM "colleagues_locales";
DELETE FROM "colleagues";
DELETE FROM "services_locales";
DELETE FROM "services";
DELETE FROM "testimonials_locales";
DELETE FROM "testimonials";
DELETE FROM "pages_locales";
DELETE FROM "pages";
DELETE FROM "contact_messages";
DELETE FROM "media";
DELETE FROM "settings";
DELETE FROM "users";

-- ============================================
-- 1. USERS (Only 2 users exist: id=1, id=2)
-- ============================================
INSERT INTO "users" ("username", "email", "password_hash", "token", "role", "created_at", "updated_at") VALUES
('admin', 'admin@example.com', '$2b$10$.uqUzEVUp9CrtwY9NDcBIevyinW4oGsX6pW2MGxypnANXhvIq/cvm', NULL, 'admin', unixepoch('now') * 1000, unixepoch('now') * 1000),
('editor', 'editor@example.com', '$2b$10$.uqUzEVUp9CrtwY9NDcBIevyinW4oGsX6pW2MGxypnANXhvIq/cvm', NULL, 'user', unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 2. SETTINGS
-- ============================================
INSERT INTO "settings" ("key", "value", "description", "is_public", "created_at", "updated_at") VALUES
('general', json('{"en":{"showSidebar":true,"direction":"ltr","language":"en"},"fa":{"showSidebar":true,"direction":"rtl","language":"fa"}}'), 'General site settings', 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('navbar', json('{"en":{"menus":[{"label":"Home","href":"/"},{"label":"Services","href":"/services"},{"label":"Blog","href":"/blog"},{"label":"About","href":"/about"},{"label":"Contact","href":"/contact"}],"darkLogo":"https://placehold.co/140x40/111827/FFFFFF?text=Logo","lightLogo":"https://placehold.co/140x40/E5E7EB/111827?text=Logo","info":[{"key":"Email","value":"info@dentistclinic.com"},{"key":"Phone","value":"+1 (555) 123-4567"}]},"fa":{"menus":[{"label":"خانه","href":"/"},{"label":"خدمات","href":"/services"},{"label":"وبلاگ","href":"/blog"},{"label":"درباره ما","href":"/about"},{"label":"تماس","href":"/contact"}],"darkLogo":"https://placehold.co/140x40/111827/FFFFFF?text=لوگو","lightLogo":"https://placehold.co/140x40/E5E7EB/111827?text=لوگو","info":[{"key":"ایمیل","value":"info@dentistclinic.com"},{"key":"تلفن","value":"+1 (555) 123-4567"}]}}'), 'Navbar settings', 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('footer', json('{"en":{"menus":[{"label":"Privacy Policy","href":"/privacy"},{"label":"Terms of Service","href":"/terms"},{"label":"FAQ","href":"/faq"}],"darkLogo":"https://placehold.co/140x40/111827/FFFFFF?text=Footer","lightLogo":"https://placehold.co/140x40/E5E7EB/111827?text=Footer","info":[{"key":"Address","value":"123 Main Street, New York, NY 10001"},{"key":"Phone","value":"+1 (555) 123-4567"},{"key":"Email","value":"info@dentistclinic.com"}]},"fa":{"menus":[{"label":"حریم خصوصی","href":"/privacy"},{"label":"شرایط خدمات","href":"/terms"},{"label":"سوالات متداول","href":"/faq"}],"darkLogo":"https://placehold.co/140x40/111827/FFFFFF?text=فوتر","lightLogo":"https://placehold.co/140x40/E5E7EB/111827?text=فوتر","info":[{"key":"آدرس","value":"خیابان اصلی ۱۲۳، نیویورک"},{"key":"تلفن","value":"+1 (555) 123-4567"},{"key":"ایمیل","value":"info@dentistclinic.com"}]}}'), 'Footer settings', 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('blog', json('{"en":{"commentsEnabled":true,"commentsRequireApproval":true,"allowAnonymousCommentsByDefault":true,"recaptchaSiteKey":"","recaptchaSecretKey":""},"fa":{"commentsEnabled":true,"commentsRequireApproval":true,"allowAnonymousCommentsByDefault":true,"recaptchaSiteKey":"","recaptchaSecretKey":""}}'), 'Blog settings', 0, unixepoch('now') * 1000, unixepoch('now') * 1000),
('seo', json('{"en":{"siteName":"Dental Clinic","siteUrl":"https://dentistclinic.com","defaultTitle":"Expert Dental Care","titleSuffix":"| Dental Clinic","defaultDescription":"Professional dental services — teeth whitening, implants, orthodontics, and general dentistry. Book your appointment today.","defaultOgImage":"","robots":"index,follow","twitterHandle":"@dentistclinic","googleSiteVerification":"","bingSiteVerification":"","yandexVerification":""},"fa":{"siteName":"کلینیک دندانپزشکی","siteUrl":"https://dentistclinic.com","defaultTitle":"مراقبت حرفه‌ای دندان","titleSuffix":"| کلینیک دندانپزشکی","defaultDescription":"خدمات حرفه‌ای دندانپزشکی — سفید کردن، ایمپلنت، ارتودنسی و دندانپزشکی عمومی. همین امروز نوبت بگیرید.","defaultOgImage":"","robots":"index,follow","twitterHandle":"@dentistclinic","googleSiteVerification":"","bingSiteVerification":"","yandexVerification":""}}'), 'SEO settings', 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('theme', json('{"en":{"preset":"light","light":{"primary":"#0ea5e9","secondary":"#f000b8","accent":"#37cdbe","neutral":"#3d4451"},"dark":{"primary":"#0ea5e9","secondary":"#f000b8","accent":"#37cdbe","neutral":"#3d4451"}},"fa":{"preset":"light","light":{"primary":"#0ea5e9","secondary":"#f000b8","accent":"#37cdbe","neutral":"#3d4451"},"dark":{"primary":"#0ea5e9","secondary":"#f000b8","accent":"#37cdbe","neutral":"#3d4451"}}}'), 'Theme settings', 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('about', json('{"en":{"info":[{"key":"Experience","value":"15+ years"},{"key":"Patients","value":"10,000+"},{"key":"Branches","value":"3 locations"},{"key":"Awards","value":"Best Clinic 2025"}]},"fa":{"info":[{"key":"تجربه","value":"۱۵+ سال"},{"key":"بیماران","value":"۱۰,۰۰۰+"},{"key":"شعب","value":"۳ شعبه"},{"key":"جوایز","value":"بهترین کلینیک ۲۰۲۵"}]}}'), 'About section settings', 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('home_sections', json('{"version":1,"sections":[{"uid":"hero","sectionId":"Hero","type":"section","source":"sections"},{"uid":"about","sectionId":"About","type":"section","source":"sections"},{"uid":"service","sectionId":"Service","type":"section","source":"sections"},{"uid":"whyus","sectionId":"Whyus","type":"section","source":"sections"},{"uid":"testimonial","sectionId":"Testimonial","type":"section","source":"sections"},{"uid":"blog","sectionId":"Blog","type":"section","source":"sections"},{"uid":"contact","sectionId":"Contact","type":"section","source":"sections"}]}'), 'Home page builder sections', 1, unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 3. PAGES
-- ============================================
INSERT INTO "pages" ("status", "created_at", "updated_at") VALUES
('published', unixepoch('now') * 1000, unixepoch('now') * 1000),
('published', unixepoch('now') * 1000, unixepoch('now') * 1000),
('published', unixepoch('now') * 1000, unixepoch('now') * 1000),
('published', unixepoch('now') * 1000, unixepoch('now') * 1000),
('published', unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 4. PAGES LOCALES
-- ============================================
INSERT INTO "pages_locales" ("page_id", "locale", "slug", "title", "seo", "builder") VALUES
(1, 'en', 'home', 'Home', '{"meta_title":"Home","meta_description":"Welcome to Dental Clinic"}', '{"version":1,"blocks":[]}'),
(1, 'fa', 'home', 'خانه', '{"meta_title":"خانه","meta_description":"به کلینیک دندانپزشکی خوش آمدید"}', '{"version":1,"blocks":[]}'),
(2, 'en', 'about', 'About Us', '{"meta_title":"About Us","meta_description":"Learn about our dental clinic"}', '{"version":1,"blocks":[]}'),
(2, 'fa', 'about', 'درباره ما', '{"meta_title":"درباره ما","meta_description":"درباره کلینیک دندانپزشکی ما بدانید"}', '{"version":1,"blocks":[]}'),
(3, 'en', 'services', 'Our Services', '{"meta_title":"Services","meta_description":"Explore our dental services"}', '{"version":1,"blocks":[]}'),
(3, 'fa', 'services', 'خدمات ما', '{"meta_title":"خدمات","meta_description":"خدمات دندانپزشکی ما را ببینید"}', '{"version":1,"blocks":[]}'),
(4, 'en', 'blog', 'Blog', '{"meta_title":"Blog","meta_description":"Latest dental health articles"}', '{"version":1,"blocks":[]}'),
(4, 'fa', 'blog', 'وبلاگ', '{"meta_title":"وبلاگ","meta_description":"جدیدترین مقالات سلامت دندان"}', '{"version":1,"blocks":[]}'),
(5, 'en', 'contact', 'Contact Us', '{"meta_title":"Contact Us","meta_description":"Get in touch with our dental clinic"}', '{"version":1,"blocks":[]}'),
(5, 'fa', 'contact', 'تماس با ما', '{"meta_title":"تماس با ما","meta_description":"با کلینیک ما در تماس باشید"}', '{"version":1,"blocks":[]}');

-- ============================================
-- 5. SERVICES
-- ============================================
INSERT INTO "services" ("icon", "image", "link", "sort_order", "is_active", "created_at", "updated_at") VALUES
('🦷', '/uploads/teeth-whitening.jpg', NULL, 1, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('🦷', '/uploads/dental-implants.jpg', NULL, 2, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('🦷', '/uploads/orthodontics.jpg', NULL, 3, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('🦷', '/uploads/general-dentistry.jpg', NULL, 4, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
('🦷', '/uploads/crowns-veneers.jpg', NULL, 5, 0, unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 6. SERVICES LOCALES
-- ============================================
INSERT INTO "services_locales" ("service_id", "locale", "title", "subtitle", "description", "extra") VALUES
(1, 'en', 'Teeth Whitening', 'Brighten your smile', 'Professional teeth whitening treatments that can brighten your smile by several shades in a single visit.', json('["Zoom whitening","Laser whitening","Take-home kits"]')),
(1, 'fa', 'سفید کردن دندان', 'لبخند خود را روشن کنید', 'درمان‌های حرفه‌ای سفید کردن دندان که می‌تواند لبخند شما را در یک جلسه چند درجه روشن‌تر کند.', json('["سفید کردن زوم","سفید کردن لیزری","کیت‌های خانگی"]')),
(2, 'en', 'Dental Implants', 'Restore your smile', 'Permanent tooth replacement solutions that look, feel, and function like natural teeth.', json('["Single implants","All-on-4","Implant-supported dentures"]')),
(2, 'fa', 'ایمپلنت دندان', 'لبخند خود را بازیابی کنید', 'راه‌حل‌های دائمی جایگزینی دندان که مانند دندان‌های طبیعی به نظر می‌رسند و عمل می‌کنند.', json('["ایمپلنت تکی","All-on-4","دنچرهای متکی بر ایمپلنت"]')),
(3, 'en', 'Orthodontics', 'Straighten your teeth', 'Modern orthodontic treatments including clear aligners and traditional braces for all ages.', json('["Invisalign","Traditional braces","Retainers"]')),
(3, 'fa', 'ارتودنسی', 'دندان‌های خود را مرتب کنید', 'درمان‌های ارتودنسی مدرن شامل الاینرهای شفاف و بریس‌های سنتی برای تمام سنین.', json('["اینویزیلاین","بریس سنتی","ریتینر"]')),
(4, 'en', 'General Dentistry', 'Comprehensive care', 'Regular check-ups, cleanings, fillings, and preventive care to keep your smile healthy.', json('["Check-ups","Cleanings","Fillings","Root canals"]')),
(4, 'fa', 'دندانپزشکی عمومی', 'مراقبت جامع', 'معاینات منظم، جرم‌گیری، پرکردن و مراقبت‌های پیشگیرانه برای حفظ سلامت لبخند شما.', json('["معاینات","جرم‌گیری","پرکردن","عصب‌کشی"]')),
(5, 'en', 'Crowns & Veneers', 'Perfect your smile', 'Custom-made restorations that improve the appearance and function of damaged teeth.', json('["Porcelain crowns","Veneers","Bridges"]'));

-- ============================================
-- 7. COLLEAGUES (Team Members)
-- ============================================
INSERT INTO "colleagues" ("icon", "image", "link", "sort_order", "is_active", "created_at", "updated_at") VALUES
(NULL, '/uploads/team/dr-smith.jpg', NULL, 1, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
(NULL, '/uploads/team/dr-jones.jpg', NULL, 2, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
(NULL, '/uploads/team/dr-lee.jpg', NULL, 3, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
(NULL, '/uploads/team/dr-garcia.jpg', NULL, 4, 0, unixepoch('now') * 1000, unixepoch('now') * 1000),
(NULL, '/uploads/team/dr-wilson.jpg', NULL, 5, 1, unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 8. COLLEAGUES LOCALES
-- ============================================
INSERT INTO "colleagues_locales" ("colleague_id", "locale", "title", "subtitle", "description", "extra") VALUES
(1, 'en', 'Dr. Sarah Smith', 'Lead Dentist', 'Dr. Smith has over 20 years of experience in cosmetic and restorative dentistry.', json('["Cosmetic dentistry","Implants","IV sedation"]')),
(1, 'fa', 'دکتر سارا اسمیت', 'دندانپزشک ارشد', 'دکتر اسمیت بیش از ۲۰ سال تجربه در دندانپزشکی زیبایی و ترمیمی دارد.', json('["دندانپزشکی زیبایی","ایمپلنت","آرام‌بخشی وریدی"]')),
(2, 'en', 'Dr. Michael Jones', 'Orthodontist', 'Specializing in orthodontic treatments for children and adults.', json('["Invisalign","Braces","Early intervention"]')),
(2, 'fa', 'دکتر مایکل جونز', 'متخصص ارتودنسی', 'متخصص درمان‌های ارتودنسی برای کودکان و بزرگسالان.', json('["اینویزیلاین","بریس","مداخله زودهنگام"]')),
(3, 'en', 'Dr. Emily Lee', 'Pediatric Dentist', 'Making dental visits fun and comfortable for children of all ages.', json('["Children''s dentistry","Sedation","Preventive care"]')),
(3, 'fa', 'دکتر امیلی لی', 'دندانپزشک کودکان', 'ایجاد تجربه‌ای سرگرم‌کننده و راحت از ویزیت دندانپزشکی برای کودکان.', json('["دندانپزشکی کودکان","آرام‌بخشی","مراقبت پیشگیرانه"]')),
(4, 'en', 'Dr. Carlos Garcia', 'Oral Surgeon', 'Expert in complex surgical procedures and wisdom teeth removal.', json('["Wisdom teeth","Bone grafting","TMJ treatment"]')),
(5, 'en', 'Dr. Lisa Wilson', 'Periodontist', 'Specialist in gum disease treatment and dental implant placement.', json('["Gum treatment","Scaling & root planing","Laser therapy"]')),
(5, 'fa', 'دکتر لیزا ویلسون', 'متخصص لثه', 'متخصص درمان بیماری‌های لثه و کاشت ایمپلنت دندان.', json('["درمان لثه","جرم‌گیری عمیق","لیزر درمانی"]'));

-- ============================================
-- 9. TESTIMONIALS
-- ============================================
INSERT INTO "testimonials" ("avatar", "rating", "is_active", "created_at", "updated_at") VALUES
(NULL, 5, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
(NULL, 5, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
(NULL, 4, 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
(NULL, 5, 0, unixepoch('now') * 1000, unixepoch('now') * 1000),
(NULL, 5, 1, unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 10. TESTIMONIALS LOCALES
-- ============================================
INSERT INTO "testimonials_locales" ("testimonial_id", "locale", "name", "role", "content") VALUES
(1, 'en', 'John D.', 'Patient', 'The best dental experience I have ever had. The team was professional, gentle, and the results are amazing!'),
(1, 'fa', 'جان د.', 'بیمار', 'بهترین تجربه دندانپزشکی که تا به حال داشته‌ام. تیم حرفه‌ای، ملایم و نتایج شگفت‌انگیز بود!'),
(2, 'en', 'Maria S.', 'Patient', 'My Invisalign treatment was seamless. Dr. Jones made the whole process easy and comfortable.'),
(2, 'fa', 'ماریا س.', 'بیمار', 'درمان اینویزیلاین من بسیار روان بود. دکتر جونز کل فرآیند را آسان و راحت کرد.'),
(3, 'en', 'Robert K.', 'Patient', 'Great clinic with state-of-the-art equipment. My crown fits perfectly and looks natural.'),
(3, 'fa', 'رابرت ک.', 'بیمار', 'کلینیک عالی با تجهیزات مدرن. روکش من کاملاً مناسب است و طبیعی به نظر می‌رسد.'),
(4, 'en', 'Anna W.', 'Patient', 'The staff is very friendly and accommodating. Highly recommend their teeth whitening service.'),
(5, 'en', 'David M.', 'Patient', 'After years of avoiding the dentist, Dr. Smith made me feel completely at ease. Wonderful care!'),
(5, 'fa', 'دیوید م.', 'بیمار', 'بعد از سال‌ها اجتناب از دندانپزشک، دکتر اسمیت باعث شد کاملاً احساس راحتی کنم. مراقبت فوق‌العاده!');

-- ============================================
-- 11. BLOG CATEGORIES
-- ============================================
INSERT INTO "blog_categories" ("created_at", "updated_at") VALUES
(unixepoch('now') * 1000, unixepoch('now') * 1000),
(unixepoch('now') * 1000, unixepoch('now') * 1000),
(unixepoch('now') * 1000, unixepoch('now') * 1000),
(unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 12. BLOG CATEGORIES LOCALES
-- ============================================
INSERT INTO "blog_categories_locales" ("category_id", "locale", "name", "slug", "description") VALUES
(1, 'en', 'Dental Care Tips', 'dental-care-tips', 'Practical tips for maintaining healthy teeth and gums'),
(1, 'fa', 'نکات مراقبت از دندان', 'dental-care-tips', 'نکات عملی برای حفظ سلامت دندان‌ها و لثه‌ها'),
(2, 'en', 'Treatment Guides', 'treatment-guides', 'Everything you need to know about dental procedures'),
(2, 'fa', 'راهنمای درمان', 'treatment-guides', 'هر آنچه باید درباره روش‌های دندانپزشکی بدانید'),
(3, 'en', 'Clinic News', 'clinic-news', 'Updates and announcements from our dental clinic'),
(3, 'fa', 'اخبار کلینیک', 'clinic-news', 'به‌روزرسانی‌ها و اطلاعیه‌های کلینیک دندانپزشکی ما'),
(4, 'en', 'Patient Stories', 'patient-stories', 'Real experiences from our patients'),
(4, 'fa', 'داستان بیماران', 'patient-stories', 'تجربیات واقعی بیماران ما');

-- ============================================
-- 13. BLOG POSTS
-- ============================================
INSERT INTO "blog_posts" ("author_id", "featured_image", "status", "allow_comments", "allow_anonymous_comments", "published_at", "created_at", "updated_at") VALUES
(1, NULL, 'published', 1, 1, unixepoch('now') * 1000, unixepoch('now') * 1000, unixepoch('now') * 1000),
(1, NULL, 'published', 1, 0, unixepoch('now') * 1000, unixepoch('now') * 1000, unixepoch('now') * 1000),
(1, NULL, 'published', 1, 1, unixepoch('now') * 1000, unixepoch('now') * 1000, unixepoch('now') * 1000),
(2, NULL, 'draft', 1, 1, NULL, unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 14. BLOG POSTS LOCALES
-- ============================================
INSERT INTO "blog_posts_locales" ("post_id", "locale", "title", "slug", "excerpt", "content", "seo") VALUES
(1, 'en', '5 Essential Tips for Healthy Teeth', 'healthy-teeth-tips', 'Simple daily habits that keep your smile bright and healthy', '<h1>5 Essential Tips for Healthy Teeth</h1><p>Maintaining good oral hygiene doesn''t have to be complicated. Here are five simple tips that can make a big difference...</p><h2>1. Brush Twice Daily</h2><p>Use fluoride toothpaste and brush for at least two minutes...</p><h2>2. Don''t Forget to Floss</h2><p>Flossing removes plaque from areas your toothbrush can''t reach...</p><h2>3. Limit Sugary Foods</h2><p>Sugar feeds the bacteria that cause cavities...</p><h2>4. Visit Your Dentist Regularly</h2><p>Professional cleanings and check-ups are essential...</p><h2>5. Drink Plenty of Water</h2><p>Water helps wash away food particles and bacteria...</p>', '{"meta_title":"5 Essential Tips for Healthy Teeth","meta_description":"Simple daily habits that keep your smile bright and healthy"}'),
(1, 'fa', '۵ نکته ضروری برای دندان‌های سالم', 'healthy-teeth-tips', 'عادات ساده روزانه که لبخند شما را روشن و سالم نگه می‌دارد', '<h1>۵ نکته ضروری برای دندان‌های سالم</h1><p>حفظ بهداشت دهان و دندان نیازی به کارهای پیچیده ندارد. در اینجا پنج نکته ساده وجود دارد که می‌تواند تفاوت بزرگی ایجاد کند...</p><h2>۱. دو بار در روز مسواک بزنید</h2><p>از خمیردندان حاوی فلوراید استفاده کنید و حداقل دو دقیقه مسواک بزنید...</p><h2>۲. نخ دندان را فراموش نکنید</h2><p>نخ دندان پلاک را از مناطقی که مسواک نمی‌تواند به آن برسد پاک می‌کند...</p><h2>۳. مصرف غذاهای شیرین را محدود کنید</h2><p>شکر باکتری‌هایی را که باعث پوسیدگی می‌شوند تغذیه می‌کند...</p><h2>۴. به طور منظم به دندانپزشک مراجعه کنید</h2><p>تمیز کردن حرفه‌ای و معاینات منظم ضروری است...</p><h2>۵. آب کافی بنوشید</h2><p>آب به شستشوی ذرات غذا و باکتری‌ها کمک می‌کند...</p>', '{"meta_title":"۵ نکته ضروری برای دندان‌های سالم","meta_description":"عادات ساده روزانه که لبخند شما را روشن و سالم نگه می‌دارد"}'),
(2, 'en', 'What to Expect During a Dental Implant Procedure', 'dental-implant-procedure', 'A step-by-step guide to getting dental implants', '<h1>What to Expect During a Dental Implant Procedure</h1><p>If you''re considering dental implants, you probably have questions about the process. Here''s what you can expect...</p><h2>Initial Consultation</h2><p>Your dentist will examine your mouth and take X-rays to determine if you''re a good candidate...</p><h2>The Implant Placement</h2><p>The implant is surgically placed into your jawbone...</p><h2>Healing Period</h2><p>Over the next few months, the implant will fuse with your bone in a process called osseointegration...</p><h2>Restoration</h2><p>Once healed, a custom crown is attached to the implant...</p>', '{"meta_title":"Dental Implant Procedure Guide","meta_description":"A step-by-step guide to getting dental implants"}'),
(2, 'fa', 'در طول عمل ایمپلنت دندان چه انتظاری داشته باشیم', 'dental-implant-procedure', 'راهنمای گام به گام دریافت ایمپلنت دندان', '<h1>در طول عمل ایمپلنت دندان چه انتظاری داشته باشیم</h1><p>اگر به فکر ایمپلنت دندان هستید، احتمالاً سوالاتی درباره این فرآیند دارید. در اینجا می‌توانید انتظار داشته باشید...</p><h2>مشاوره اولیه</h2><p>دندانپزشک دهان شما را معاینه می‌کند و عکس‌برداری انجام می‌دهد...</p><h2>کاشت ایمپلنت</h2><p>ایمپلنت به صورت جراحی در استخوان فک قرار می‌گیرد...</p><h2>دوره بهبودی</h2><p>در طول چند ماه آینده، ایمپلنت با استخوان شما جوش می‌خورد...</p><h2>ترمیم</h2><p>پس از بهبودی، یک روکش سفارشی به ایمپلنت متصل می‌شود...</p>', '{"meta_title":"راهنمای عمل ایمپلنت دندان","meta_description":"راهنمای گام به گام دریافت ایمپلنت دندان"}'),
(3, 'en', 'The Benefits of Invisalign Over Traditional Braces', 'invisalign-vs-braces', 'Why clear aligners might be the right choice for you', '<h1>The Benefits of Invisalign Over Traditional Braces</h1><p>Invisalign has revolutionized orthodontic treatment. Here''s why many patients prefer it...</p><h2>Nearly Invisible</h2><p>The clear aligners are virtually undetectable...</p><h2>Removable</h2><p>You can take them out for eating, brushing, and flossing...</p><h2>More Comfortable</h2><p>No metal wires or brackets to irritate your mouth...</p><h2>Fewer Office Visits</h2><p>You change aligners at home every few weeks...</p>', '{"meta_title":"Invisalign vs Traditional Braces","meta_description":"Why clear aligners might be the right choice for you"}'),
(3, 'fa', 'مزایای اینویزیلاین نسبت به بریس‌های سنتی', 'invisalign-vs-braces', 'چرا الاینرهای شفاف ممکن است انتخاب مناسبی برای شما باشند', '<h1>مزایای اینویزیلاین نسبت به بریس‌های سنتی</h1><p>اینویزیلاین درمان ارتودنسی را متحول کرده است. در اینجا دلایل ترجیح بسیاری از بیماران...</p><h2>تقریباً نامرئی</h2><p>الاینرهای شفاف تقریباً قابل تشخیص نیستند...</p><h2>قابل برداشتن</h2><p>می‌توانید آنها را برای غذا خوردن، مسواک زدن و نخ دندان خارج کنید...</p><h2>راحت‌تر</h2><p>بدون سیم‌ها و براکت‌های فلزی که دهان شما را اذیت کنند...</p><h2>ویزیت‌های کمتر</h2><p>هر چند هفته یک بار الاینرها را در خانه تعویض می‌کنید...</p>', '{"meta_title":"اینویزیلاین در مقابل بریس‌های سنتی","meta_description":"چرا الاینرهای شفاف ممکن است انتخاب مناسبی برای شما باشند"}'),
(4, 'en', 'How Often Should You Visit the Dentist?', 'how-often-visit-dentist', 'Understanding the recommended frequency for dental check-ups', '<h1>How Often Should You Visit the Dentist?</h1><p>The general recommendation is every six months, but your specific needs may vary...</p>', '{"meta_title":"How Often Visit Dentist","meta_description":"Understanding the recommended frequency for dental check-ups"}');

-- ============================================
-- 15. BLOG POST CATEGORIES (Junction Table)
-- ============================================
INSERT INTO "blog_post_categories" ("post_id", "category_id") VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 1);

-- ============================================
-- 16. BLOG COMMENTS
-- ============================================
INSERT INTO "blog_comments" ("post_id", "user_id", "parent_id", "author_name", "author_email", "content", "seo", "status", "like_count", "created_at", "updated_at") VALUES
-- Post 1 comments
(1, 2, NULL, NULL, NULL, 'Great tips! I started flossing daily and my gums feel much healthier.', '{}', 'approved', 3, unixepoch('now') * 1000, unixepoch('now') * 1000),
(1, NULL, NULL, 'Sarah M.', 'sarah@example.com', 'Thanks for the helpful advice!', '{}', 'approved', 1, unixepoch('now') * 1000, unixepoch('now') * 1000),
(1, NULL, 1, 'Mike R.', 'mike@example.com', 'Same here! Flossing makes such a difference.', '{}', 'approved', 0, unixepoch('now') * 1000, unixepoch('now') * 1000),
-- Post 2 comments
(2, 1, NULL, NULL, NULL, 'I went through this process last year. The results are life-changing!', '{}', 'approved', 5, unixepoch('now') * 1000, unixepoch('now') * 1000),
(2, NULL, NULL, 'Jane D.', 'jane@example.com', 'How long did the healing period take for you?', '{}', 'pending', 0, unixepoch('now') * 1000, unixepoch('now') * 1000),
-- Post 3 comments
(3, 2, NULL, NULL, NULL, 'I love my Invisalign! Best decision I ever made for my smile.', '{}', 'approved', 7, unixepoch('now') * 1000, unixepoch('now') * 1000),
(3, NULL, NULL, 'Tom K.', 'tom@example.com', 'Does Invisalign work for severe cases too?', '{}', 'approved', 0, unixepoch('now') * 1000, unixepoch('now') * 1000),
(3, 1, 7, NULL, NULL, 'Yes, my orthodontist said it can handle most cases now.', '{}', 'approved', 2, unixepoch('now') * 1000, unixepoch('now') * 1000);

-- ============================================
-- 17. BLOG COMMENT LIKES (FIXED - removed user_id = 3)
-- ============================================
INSERT INTO "blog_comment_likes" ("comment_id", "user_id", "created_at") VALUES
(1, 1, unixepoch('now') * 1000),
(1, 2, unixepoch('now') * 1000),
(4, 1, unixepoch('now') * 1000),
(4, 2, unixepoch('now') * 1000),
(6, 1, unixepoch('now') * 1000),
(6, 2, unixepoch('now') * 1000);

-- ============================================
-- 18. CONTACT MESSAGES
-- ============================================
INSERT INTO "contact_messages" ("name", "email", "phone", "address", "subject", "message", "created_at") VALUES
('John Smith', 'john.smith@email.com', '+1 (555) 123-4567', '123 Main St, New York, NY', 'Appointment Request', 'I would like to schedule a teeth cleaning appointment for next week.', unixepoch('now') * 1000),
('Emily Brown', 'emily.brown@email.com', '+1 (555) 234-5678', '456 Oak Ave, Los Angeles, CA', 'Invisalign Inquiry', 'I am interested in Invisalign treatment. Could you provide pricing information?', unixepoch('now') * 1000),
('Michael Johnson', 'michael.j@email.com', '+1 (555) 345-6789', '', 'Emergency', 'I have a severe toothache and need to be seen as soon as possible.', unixepoch('now') * 1000),
('Sarah Davis', 'sarah.davis@email.com', '', '789 Pine Rd, Chicago, IL', 'Feedback', 'Thank you for the wonderful care during my implant procedure. The team was amazing!', unixepoch('now') * 1000),
('Robert Wilson', 'robert.w@email.com', '+1 (555) 456-7890', '321 Elm St, Houston, TX', 'Insurance Question', 'Do you accept Delta Dental insurance? I am considering switching to your clinic.', unixepoch('now') * 1000);

-- ============================================
-- 19. MEDIA
-- ============================================
INSERT INTO "media" ("filename", "original_name", "mime_type", "size", "path", "thumbnail_path", "alt", "title", "width", "height", "uploaded_by", "created_at") VALUES
('teeth-whitening.jpg', 'teeth-whitening.jpg', 'image/jpeg', 1876543, '/uploads/teeth-whitening.jpg', '/uploads/thumbnails/teeth-whitening.jpg', 'Teeth whitening procedure', 'Teeth Whitening', 1200, 800, 1, unixepoch('now') * 1000),
('dental-implants.jpg', 'dental-implants.jpg', 'image/jpeg', 2234567, '/uploads/dental-implants.jpg', '/uploads/thumbnails/dental-implants.jpg', 'Dental implant procedure', 'Dental Implants', 1920, 1080, 1, unixepoch('now') * 1000),
('orthodontics.jpg', 'orthodontics.jpg', 'image/jpeg', 1654321, '/uploads/orthodontics.jpg', '/uploads/thumbnails/orthodontics.jpg', 'Orthodontic treatment', 'Orthodontics', 1200, 800, 2, unixepoch('now') * 1000),
('general-dentistry.jpg', 'general-dentistry.jpg', 'image/jpeg', 1456789, '/uploads/general-dentistry.jpg', '/uploads/thumbnails/general-dentistry.jpg', 'General dentistry checkup', 'General Dentistry', 1200, 800, 2, unixepoch('now') * 1000),
('crowns-veneers.jpg', 'crowns-veneers.jpg', 'image/jpeg', 1987654, '/uploads/crowns-veneers.jpg', '/uploads/thumbnails/crowns-veneers.jpg', 'Dental crowns and veneers', 'Crowns & Veneers', 1200, 800, 1, unixepoch('now') * 1000),
('team/dr-smith.jpg', 'dr-smith.jpg', 'image/jpeg', 1234567, '/uploads/team/dr-smith.jpg', '/uploads/thumbnails/team/dr-smith.jpg', 'Dr. Sarah Smith portrait', 'Dr. Sarah Smith', 800, 800, 1, unixepoch('now') * 1000),
('team/dr-jones.jpg', 'dr-jones.jpg', 'image/jpeg', 1156789, '/uploads/team/dr-jones.jpg', '/uploads/thumbnails/team/dr-jones.jpg', 'Dr. Michael Jones portrait', 'Dr. Michael Jones', 800, 800, 1, unixepoch('now') * 1000),
('team/dr-lee.jpg', 'dr-lee.jpg', 'image/jpeg', 1345678, '/uploads/team/dr-lee.jpg', '/uploads/thumbnails/team/dr-lee.jpg', 'Dr. Emily Lee portrait', 'Dr. Emily Lee', 800, 800, 2, unixepoch('now') * 1000),
('team/dr-garcia.jpg', 'dr-garcia.jpg', 'image/jpeg', 1456789, '/uploads/team/dr-garcia.jpg', '/uploads/thumbnails/team/dr-garcia.jpg', 'Dr. Carlos Garcia portrait', 'Dr. Carlos Garcia', 800, 800, 2, unixepoch('now') * 1000),
('team/dr-wilson.jpg', 'dr-wilson.jpg', 'image/jpeg', 1234567, '/uploads/team/dr-wilson.jpg', '/uploads/thumbnails/team/dr-wilson.jpg', 'Dr. Lisa Wilson portrait', 'Dr. Lisa Wilson', 800, 800, 1, unixepoch('now') * 1000);

COMMIT;
PRAGMA foreign_keys = ON;