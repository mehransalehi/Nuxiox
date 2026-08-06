-- Nuxiox Database Seed
-- Run: npx wrangler d1 execute nuxiox_db --local --file=scripts/seed.sql

-- ── Settings ──────────────────────────────────────────────
INSERT OR REPLACE INTO settings (key, value, is_public, description) VALUES ('general', '{"showSidebar":true,"direction":"ltr","language":"en"}', 1, 'General site settings');
INSERT OR REPLACE INTO settings (key, value, is_public, description) VALUES ('navbar', '{"menus":[{"label":"Home","link":"/"},{"label":"Services","link":"/service"},{"label":"About","link":"/about"},{"label":"Blog","link":"/blog"}],"darkLogo":"","lightLogo":"","info":{}}', 1, 'Navigation bar settings');
INSERT OR REPLACE INTO settings (key, value, is_public, description) VALUES ('footer', '{"menus":[{"label":"Home","link":"/"},{"label":"Services","link":"/service"},{"label":"About","link":"/about"}],"darkLogo":"","lightLogo":"","info":{}}', 1, 'Footer settings');
INSERT OR REPLACE INTO settings (key, value, is_public, description) VALUES ('blog', '{"allowComments":true,"allowAnonymousComments":true,"recaptchaSiteKey":""}', 1, 'Blog settings');
INSERT OR REPLACE INTO settings (key, value, is_public, description) VALUES ('seo', '{"siteName":"Nuxiox Demo","siteDescription":"A multi-database CMS built on Nuxt 4","verificationCodes":""}', 1, 'SEO settings');
INSERT OR REPLACE INTO settings (key, value, is_public, description) VALUES ('theme', '{"preset":"light","primary":"#4f46e5","secondary":"#7c3aed","accent":"#f59e0b","neutral":"#1f2937"}', 1, 'Theme settings');
INSERT OR REPLACE INTO settings (key, value, is_public, description) VALUES ('about', '{"items":[{"label":"Phone","value":"+1 (555) 123-4567"},{"label":"Email","value":"info@nuxiox.demo"},{"label":"Address","value":"123 Main Street, City"}]}', 1, 'About / contact info');
INSERT OR REPLACE INTO settings (key, value, is_public, description) VALUES ('home_sections', '{"version":1,"sections":[{"uid":"seed-hero","type":"section","sectionId":"Hero","source":"sections"},{"uid":"seed-services","type":"section","sectionId":"Services","source":"sections"},{"uid":"seed-about","type":"section","sectionId":"About","source":"sections"},{"uid":"seed-testimonials","type":"section","sectionId":"Testimonials","source":"sections"},{"uid":"seed-blog","type":"section","sectionId":"Blog","source":"sections"},{"uid":"seed-contact","type":"section","sectionId":"Contact","source":"sections"},{"uid":"seed-footer","type":"section","sectionId":"Footer","source":"sections"}]}', 1, 'Home page builder');

-- ── Services ──────────────────────────────────────────────
INSERT INTO services (icon, image, link, sort_order, is_active) VALUES ('fa-solid fa-tooth', '', '/service', 1, 1);
INSERT INTO services_locales (service_id, locale, title, subtitle, description, extra) VALUES (last_insert_rowid(), 'en', 'General Dentistry', 'Comprehensive dental care', 'Regular checkups, cleanings, and preventive care to keep your smile healthy.', '[]');
INSERT INTO services_locales (service_id, locale, title, subtitle, description, extra) VALUES (last_insert_rowid(), 'fa', 'دندان‌پزشکی عمومی', 'مراقبت جامع دندانی', 'معاینات منظم، تمیز کردن و مراقبت‌های پیشگیرانه برای حفظ سلامت لبخند شما.', '[]');

-- ── Colleagues ────────────────────────────────────────────
INSERT INTO colleagues (is_active) VALUES (1);
INSERT INTO colleagues_locales (colleague_id, locale, title, subtitle, description, extra) VALUES (last_insert_rowid(), 'en', 'Dr. John Smith', 'Lead Dentist', 'Dr. Smith has over 15 years of experience in general and cosmetic dentistry.', '[]');

-- ── Testimonials ──────────────────────────────────────────
INSERT INTO testimonials (rating, is_active) VALUES (5, 1);
INSERT INTO testimonials_locales (testimonial_id, locale, name, role, content) VALUES (last_insert_rowid(), 'en', 'Sarah Johnson', 'Patient', 'Excellent service! The team was very professional and made me feel comfortable throughout the entire procedure.');

-- ── Blog Categories ───────────────────────────────────────
INSERT INTO blog_categories DEFAULT VALUES;
INSERT INTO blog_categories_locales (category_id, locale, name, slug, description) VALUES (last_insert_rowid(), 'en', 'Dental Care', 'dental-care', 'Tips and advice for maintaining good dental health.');

-- ── Blog Posts ────────────────────────────────────────────
INSERT INTO blog_posts (status, allow_comments, allow_anonymous_comments, featured_image) VALUES ('published', 1, 1, '');
INSERT INTO blog_posts_locales (post_id, locale, title, slug, excerpt, content, seo) VALUES (last_insert_rowid(), 'en', 'Welcome to Our Dental Blog', 'welcome-to-our-dental-blog', 'Learn about the latest in dental care and what to expect during your visit.', '<h2>Your Dental Health Matters</h2><p>Regular dental checkups are essential for maintaining good oral health. We recommend visiting us every six months for a routine examination and cleaning.</p><p>During your visit, we will:</p><ul><li>Examine your teeth and gums</li><li>Perform a professional cleaning</li><li>Discuss any concerns you may have</li></ul><p>We look forward to seeing you!</p>', '{"title":"Welcome to Our Dental Blog","description":"Learn about the latest in dental care"}');
INSERT INTO blog_post_categories (post_id, category_id) VALUES (last_insert_rowid(), (SELECT id FROM blog_categories LIMIT 1));

-- ── Pages ─────────────────────────────────────────────────
INSERT INTO pages (status) VALUES ('published');
INSERT INTO pages_locales (page_id, locale, slug, title, seo, builder) VALUES (last_insert_rowid(), 'en', 'service', 'Our Services', '{"title":"Our Services","description":"Comprehensive dental services"}', '{"version":1,"blocks":[{"uid":"seed-service-1","type":"section","sectionId":"Services","source":"sections"}]}');

INSERT INTO pages (status) VALUES ('published');
INSERT INTO pages_locales (page_id, locale, slug, title, seo, builder) VALUES (last_insert_rowid(), 'en', 'about', 'About Us', '{"title":"About Us","description":"Learn more about our dental practice"}', '{"version":1,"blocks":[{"uid":"seed-about-1","type":"section","sectionId":"About","source":"sections"}]}');