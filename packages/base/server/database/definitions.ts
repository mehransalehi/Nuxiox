// layers/base/server/database/definitions.ts
// Canonical table definitions — single source of truth for all database dialects.
// Each database layer imports these and renders them to the correct Drizzle dialect.

export interface ColumnDef {
  name: string
  type: 'int' | 'text' | 'json' | 'boolean' | 'timestamp' | 'varchar' | 'bigint'
  notNull?: boolean
  default?: unknown
  primaryKey?: boolean | { autoIncrement: boolean }
  unique?: boolean
  length?: number
  mode?: 'json' | 'boolean' | 'timestamp_ms'
  typeAnnotation?: string
  defaultRaw?: string
  onUpdateRaw?: string
  references?: { table: string; column: string; onDelete?: string }
}

export interface IndexDef {
  name: string
  columns: string[]
  unique?: boolean
}

export interface TableDef {
  name: string
  columns: ColumnDef[]
  indexes?: IndexDef[]
}

export interface EntityDef {
  /** Export variable name (e.g. 'users', 'pages', 'pagesLocales') */
  variable: string
  /** Drizzle table name (e.g. 'users', 'pages_locales') */
  tableName: string
  /** Schema priority for layer overrides */
  priority: number
  /** Layer source identifier */
  layerSource: string
  /** Layer name identifier */
  layerName: string
  columns: ColumnDef[]
  indexes?: IndexDef[]
}

// --- Helper to define a column concisely ---
export function col(
  name: string,
  type: ColumnDef['type'],
  opts?: Partial<ColumnDef>,
): ColumnDef {
  return { name, type, ...opts }
}

// --- Helper to define a table entity ---
export function entity(
  variable: string,
  tableName: string,
  columns: ColumnDef[],
  indexes?: IndexDef[],
): EntityDef {
  return {
    variable,
    tableName,
    priority: 10,
    layerSource: '../../layers/base/server/database/definitions',
    layerName: 'base',
    columns,
    indexes,
  }
}

// ========================================================================
// ALL TABLE DEFINITIONS — single source of truth
// ========================================================================

export const USERS = entity('users', 'users', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('username', 'text', { notNull: true, unique: true }),
  col('email', 'text', { notNull: true, unique: true }),
  col('password_hash', 'text'),
  col('token', 'text'),
  col('role', 'text', {
    notNull: true,
    default: 'user',
    typeAnnotation: '"admin" | "user"',
  }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: '(CURRENT_TIMESTAMP)' }),
  col('updated_at', 'timestamp', {
    notNull: true,
    defaultRaw: '(CURRENT_TIMESTAMP)',
    onUpdateRaw: '(CURRENT_TIMESTAMP)',
  }),
])

export const SETTINGS = entity('settings', 'settings', [
  col('key', 'text', { primaryKey: true }),
  col('value', 'json', { notNull: true }),
  col('description', 'text'),
  col('is_public', 'boolean', { notNull: true, default: true }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
  col('updated_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
], [
  { name: 'settings_is_public_idx', columns: ['is_public'] },
])

export const PAGES = entity('pages', 'pages', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('status', 'text', {
    notNull: true,
    default: 'draft',
    typeAnnotation: '"draft" | "published"',
  }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
  col('updated_at', 'timestamp', {
    notNull: true,
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdateRaw: 'CURRENT_TIMESTAMP',
  }),
])

export const PAGES_LOCALES = entity('pagesLocales', 'pages_locales', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('page_id', 'int', {
    notNull: true,
    references: { table: 'pages', column: 'id', onDelete: 'cascade' },
  }),
  col('locale', 'text', { notNull: true }),
  col('slug', 'text', { notNull: true }),
  col('title', 'text', { notNull: true }),
  col('seo', 'json', { notNull: true }),
  col('builder', 'json', { notNull: true }),
], [
  { name: 'pages_locale_unique', columns: ['page_id', 'locale'], unique: true },
  { name: 'pages_slug_locale_unique', columns: ['slug', 'locale'], unique: true },
])

export const SERVICES = entity('services', 'services', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('icon', 'varchar', { length: 191 }),
  col('image', 'varchar', { length: 191 }),
  col('link', 'varchar', { length: 191 }),
  col('sort_order', 'int', { notNull: true, default: 0 }),
  col('is_active', 'boolean', { notNull: true, default: true }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
  col('updated_at', 'timestamp', {
    notNull: true,
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdateRaw: 'CURRENT_TIMESTAMP',
  }),
])

export const SERVICES_LOCALES = entity('servicesLocales', 'services_locales', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('service_id', 'int', {
    notNull: true,
    references: { table: 'services', column: 'id', onDelete: 'cascade' },
  }),
  col('locale', 'text', { notNull: true }),
  col('title', 'text', { notNull: true }),
  col('subtitle', 'text'),
  col('description', 'text'),
  col('extra', 'json', { notNull: true, defaultRaw: "'[]'" }),
], [
  { name: 'services_locale_unique', columns: ['service_id', 'locale'], unique: true },
])

export const COLLEAGUES = entity('colleagues', 'colleagues', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('icon', 'text'),
  col('image', 'text'),
  col('link', 'text'),
  col('sort_order', 'int', { notNull: true, default: 0 }),
  col('is_active', 'boolean', { notNull: true, default: true }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
  col('updated_at', 'timestamp', {
    notNull: true,
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdateRaw: 'CURRENT_TIMESTAMP',
  }),
])

export const COLLEAGUES_LOCALES = entity('colleaguesLocales', 'colleagues_locales', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('colleague_id', 'int', {
    notNull: true,
    references: { table: 'colleagues', column: 'id', onDelete: 'cascade' },
  }),
  col('locale', 'text', { notNull: true }),
  col('title', 'text', { notNull: true }),
  col('subtitle', 'text'),
  col('description', 'text'),
  col('extra', 'json', { notNull: true, defaultRaw: "'[]'" }),
], [
  { name: 'colleagues_locale_unique', columns: ['colleague_id', 'locale'], unique: true },
])

export const TESTIMONIALS = entity('testimonials', 'testimonials', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('avatar', 'varchar', { length: 191 }),
  col('rating', 'int', { notNull: true, default: 5 }),
  col('is_active', 'boolean', { notNull: true, default: true }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
  col('updated_at', 'timestamp', {
    notNull: true,
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdateRaw: 'CURRENT_TIMESTAMP',
  }),
])

export const TESTIMONIALS_LOCALES = entity('testimonialsLocales', 'testimonials_locales', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('testimonial_id', 'int', {
    notNull: true,
    references: { table: 'testimonials', column: 'id', onDelete: 'cascade' },
  }),
  col('locale', 'text', { notNull: true }),
  col('name', 'text', { notNull: true }),
  col('role', 'text'),
  col('content', 'text', { notNull: true }),
], [
  { name: 'testimonials_locale_unique', columns: ['testimonial_id', 'locale'], unique: true },
])

export const CONTACT_MESSAGES = entity('contactMessages', 'contact_messages', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('name', 'text', { notNull: true }),
  col('email', 'text', { notNull: true }),
  col('phone', 'text'),
  col('address', 'text'),
  col('subject', 'text'),
  col('message', 'text', { notNull: true }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
])

export const BLOG_CATEGORIES = entity('blogCategories', 'blog_categories', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
  col('updated_at', 'timestamp', {
    notNull: true,
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdateRaw: 'CURRENT_TIMESTAMP',
  }),
])

export const BLOG_CATEGORIES_LOCALES = entity(
  'blogCategoriesLocales',
  'blog_categories_locales',
  [
    col('id', 'int', { primaryKey: { autoIncrement: true } }),
    col('category_id', 'int', {
      notNull: true,
      references: { table: 'blog_categories', column: 'id', onDelete: 'cascade' },
    }),
    col('locale', 'text', { notNull: true }),
    col('name', 'text', { notNull: true }),
    col('slug', 'text', { notNull: true }),
    col('description', 'text'),
  ],
  [
    { name: 'blog_categories_locale_unique', columns: ['category_id', 'locale'], unique: true },
    { name: 'blog_categories_slug_locale_unique', columns: ['slug', 'locale'], unique: true },
  ],
)

export const BLOG_POSTS = entity('blogPosts', 'blog_posts', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('author_id', 'int', {
    references: { table: 'users', column: 'id', onDelete: 'set null' },
  }),
  col('featured_image', 'varchar', { length: 191 }),
  col('status', 'varchar', {
    length: 20,
    notNull: true,
    default: 'draft',
    typeAnnotation: '"draft" | "published" | "archived"',
  }),
  col('allow_comments', 'boolean', { notNull: true, default: true }),
  col('allow_anonymous_comments', 'boolean', { notNull: true, default: true }),
  col('published_at', 'timestamp'),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
  col('updated_at', 'timestamp', {
    notNull: true,
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdateRaw: 'CURRENT_TIMESTAMP',
  }),
], [
  { name: 'blog_posts_status_published_idx', columns: ['status', 'published_at'] },
  { name: 'blog_posts_author_idx', columns: ['author_id'] },
])

export const BLOG_POSTS_LOCALES = entity('blogPostsLocales', 'blog_posts_locales', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('post_id', 'int', {
    notNull: true,
    references: { table: 'blog_posts', column: 'id', onDelete: 'cascade' },
  }),
  col('locale', 'text', { notNull: true }),
  col('title', 'text', { notNull: true }),
  col('slug', 'text', { notNull: true }),
  col('excerpt', 'text'),
  col('content', 'text', { notNull: true }),
  col('seo', 'json', { notNull: true, defaultRaw: "'{}'" }),
], [
  { name: 'blog_posts_locale_unique', columns: ['post_id', 'locale'], unique: true },
  { name: 'blog_posts_slug_locale_unique', columns: ['slug', 'locale'], unique: true },
])

export const BLOG_POST_CATEGORIES = entity('blogPostCategories', 'blog_post_categories', [
  col('post_id', 'int', {
    notNull: true,
    references: { table: 'blog_posts', column: 'id', onDelete: 'cascade' },
  }),
  col('category_id', 'int', {
    notNull: true,
    references: { table: 'blog_categories', column: 'id', onDelete: 'cascade' },
  }),
], [
  { name: 'blog_post_categories_pk', columns: ['post_id', 'category_id'], unique: true },
  { name: 'blog_post_categories_category_idx', columns: ['category_id'] },
])

export const BLOG_COMMENTS = entity('blogComments', 'blog_comments', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('post_id', 'int', {
    notNull: true,
    references: { table: 'blog_posts', column: 'id', onDelete: 'cascade' },
  }),
  col('user_id', 'int', {
    references: { table: 'users', column: 'id', onDelete: 'set null' },
  }),
  col('parent_id', 'int'),
  col('author_name', 'text'),
  col('author_email', 'text'),
  col('content', 'text', { notNull: true }),
  col('seo', 'json', { notNull: true, defaultRaw: "'{}'" }),
  col('status', 'text', {
    notNull: true,
    default: 'pending',
    typeAnnotation: '"pending" | "approved" | "rejected"',
  }),
  col('like_count', 'int', { notNull: true, default: 0 }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
  col('updated_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
], [
  { name: 'blog_comments_post_status_idx', columns: ['post_id', 'status'] },
  { name: 'blog_comments_parent_idx', columns: ['parent_id'] },
])

export const BLOG_COMMENT_LIKES = entity('blogCommentLikes', 'blog_comment_likes', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('comment_id', 'int', {
    notNull: true,
    references: { table: 'blog_comments', column: 'id', onDelete: 'cascade' },
  }),
  col('user_id', 'int', {
    notNull: true,
    references: { table: 'users', column: 'id', onDelete: 'cascade' },
  }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
], [
  { name: 'blog_comment_likes_unique_idx', columns: ['comment_id', 'user_id'], unique: true },
])

export const MEDIA = entity('media', 'media', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('filename', 'text', { notNull: true }),
  col('original_name', 'text', { notNull: true }),
  col('mime_type', 'text', { notNull: true }),
  col('size', 'int', { notNull: true }),
  col('path', 'text', { notNull: true }),
  col('thumbnail_path', 'text'),
  col('alt', 'text'),
  col('title', 'text'),
  col('width', 'int'),
  col('height', 'int'),
  col('uploaded_by', 'int', {
    references: { table: 'users', column: 'id', onDelete: 'set null' },
  }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: 'CURRENT_TIMESTAMP' }),
], [
  { name: 'media_filename_idx', columns: ['filename'] },
  { name: 'media_uploaded_by_idx', columns: ['uploaded_by'] },
])

// --- Registry of all entities ---
export const ALL_ENTITIES: EntityDef[] = [
  USERS,
  SETTINGS,
  PAGES,
  PAGES_LOCALES,
  SERVICES,
  SERVICES_LOCALES,
  COLLEAGUES,
  COLLEAGUES_LOCALES,
  TESTIMONIALS,
  TESTIMONIALS_LOCALES,
  CONTACT_MESSAGES,
  BLOG_CATEGORIES,
  BLOG_CATEGORIES_LOCALES,
  BLOG_POSTS,
  BLOG_POSTS_LOCALES,
  BLOG_POST_CATEGORIES,
  BLOG_COMMENTS,
  BLOG_COMMENT_LIKES,
  MEDIA,
]
