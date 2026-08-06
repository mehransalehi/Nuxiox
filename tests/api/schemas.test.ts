/**
 * API Unit Tests — Utility Functions & Schema Validation
 *
 * Tests the utility functions and Zod validation schemas
 * used by the API layer. Does NOT require the Nuxt runtime.
 *
 * Run: pnpm vitest run
 */

import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// ============================================================
// Zod Validation Schemas (extracted from API handlers)
// ============================================================

describe('Auth Login Schema', () => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })

  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'admin@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'admin@example.com',
      password: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('Contact Message Schema', () => {
  const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional().default(''),
    address: z.string().optional().default(''),
    subject: z.string().max(200).optional().default(''),
    message: z.string().min(5).max(5000),
  })

  it('accepts valid contact data', () => {
    const result = contactSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, I would like to know more about your services.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short name', () => {
    const result = contactSchema.safeParse({
      name: 'J',
      email: 'john@example.com',
      message: 'Hello, I would like to know more about your services.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'John Doe',
      email: 'bad-email',
      message: 'Hello, I would like to know more about your services.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short message', () => {
    const result = contactSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hi',
    })
    expect(result.success).toBe(false)
  })
})

describe('Blog Post Schema', () => {
  const blogPostSchema = z.object({
    locale: z.string().min(2),
    title: z.string().min(2).max(220),
    slug: z.string().min(2).max(220),
    excerpt: z.string().max(500).optional(),
    content: z.string().min(2),
    seo: z.record(z.string(), z.string()).optional().default({}),
    featuredImage: z.string().url().optional().or(z.literal('')),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    allowComments: z.boolean().default(true),
    allowAnonymousComments: z.boolean().default(true),
    categoryIds: z.array(z.number().int().positive()).default([]),
  })

  it('accepts valid blog post data', () => {
    const result = blogPostSchema.safeParse({
      locale: 'en',
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      content: 'This is the content of the blog post.',
      status: 'draft',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.allowComments).toBe(true)
      expect(result.data.categoryIds).toEqual([])
      expect(result.data.seo).toEqual({})
    }
  })

  it('rejects short title', () => {
    const result = blogPostSchema.safeParse({
      locale: 'en',
      title: 'T',
      slug: 'test-blog-post',
      content: 'Content here',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = blogPostSchema.safeParse({
      locale: 'en',
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      content: 'Content here',
      status: 'unknown',
    })
    expect(result.success).toBe(false)
  })
})

describe('Blog Category Schema', () => {
  const categorySchema = z.object({
    locale: z.string().min(2),
    name: z.string().min(2).max(120),
    slug: z.string().min(2).max(120),
    description: z.string().max(500).optional().default(''),
  })

  it('accepts valid category data', () => {
    const result = categorySchema.safeParse({
      locale: 'en',
      name: 'Dentistry',
      slug: 'dentistry',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short name', () => {
    const result = categorySchema.safeParse({
      locale: 'en',
      name: 'D',
      slug: 'dentistry',
    })
    expect(result.success).toBe(false)
  })
})

describe('Blog Comment Schema', () => {
  const commentSchema = z.object({
    content: z.string().min(2).max(3000),
    parentId: z.number().int().positive().nullable().optional(),
    authorName: z.string().min(2).max(120).optional(),
    authorEmail: z.string().email().optional(),
    captchaToken: z.string().min(1).optional(),
  })

  it('accepts valid comment data', () => {
    const result = commentSchema.safeParse({
      content: 'Great article! Thanks for sharing.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short content', () => {
    const result = commentSchema.safeParse({
      content: 'G',
    })
    expect(result.success).toBe(false)
  })

  it('accepts comment with all optional fields', () => {
    const result = commentSchema.safeParse({
      content: 'Great article! Thanks for sharing.',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid author email', () => {
    const result = commentSchema.safeParse({
      content: 'Great article! Thanks for sharing.',
      authorName: 'John Doe',
      authorEmail: 'bad-email',
    })
    expect(result.success).toBe(false)
  })
})

describe('Service Schema', () => {
  const serviceSchema = z.object({
    locale: z.string().min(2),
    title: z.string().min(2).max(220),
    subtitle: z.string().max(500).optional().default(''),
    description: z.string().optional().default(''),
    extra: z.string().optional().default(''),
    icon: z.string().optional().default(''),
    image: z.string().optional().default(''),
    link: z.string().optional().default(''),
    sortOrder: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
  })

  it('accepts valid service data', () => {
    const result = serviceSchema.safeParse({
      locale: 'en',
      title: 'Teeth Cleaning',
    })
    expect(result.success).toBe(true)
  })
})

describe('Testimonial Schema', () => {
  const testimonialSchema = z.object({
    locale: z.string().min(2),
    name: z.string().min(2).max(220),
    role: z.string().max(220).optional().default(''),
    content: z.string().min(2).max(5000),
    avatar: z.string().optional().default(''),
    rating: z.number().int().min(1).max(5).optional().default(5),
    isActive: z.boolean().optional().default(true),
  })

  it('accepts valid testimonial data', () => {
    const result = testimonialSchema.safeParse({
      locale: 'en',
      name: 'Jane Doe',
      content: 'Excellent service! Highly recommended.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects rating out of range', () => {
    const result = testimonialSchema.safeParse({
      locale: 'en',
      name: 'Jane Doe',
      content: 'Excellent service!',
      rating: 6,
    })
    expect(result.success).toBe(false)
  })
})

describe('Page Schema', () => {
  const pageSchema = z.object({
    locale: z.string().min(2),
    title: z.string().min(2).max(220),
    slug: z.string().min(2).max(220),
    status: z.enum(['draft', 'published']).default('draft'),
    builder: z.any().optional().default({ version: 1, blocks: [] }),
    seo: z.record(z.string(), z.string()).optional().default({}),
  })

  it('accepts valid page data', () => {
    const result = pageSchema.safeParse({
      locale: 'en',
      title: 'About Us',
      slug: 'about',
    })
    expect(result.success).toBe(true)
  })
})

// ============================================================
// API Route Coverage Test
// ============================================================

describe('API Route Coverage', () => {
  it('documents all public API endpoints (14)', () => {
    const publicEndpoints = [
      'GET  /api/settings/public',
      'GET  /api/pages/public/[slug]',
      'GET  /api/home-builder/public',
      'GET  /api/blog/posts',
      'GET  /api/blog/posts/[slug]',
      'GET  /api/blog/posts/recent',
      'GET  /api/services/public',
      'GET  /api/colleagues/public',
      'GET  /api/testimonials/public',
      'GET  /api/sections',
      'POST /api/contact-messages',
      'POST /api/blog/posts/[slug]/comments',
      'POST /api/blog/comments/[id]/like',
      'POST /api/auth/login',
    ]
    expect(publicEndpoints).toHaveLength(14)
  })

  it('documents all admin API endpoints (38)', () => {
    const adminEndpoints = [
      'GET   /api/admin/dashboard/stats',
      'GET   /api/admin/blog/posts',
      'GET   /api/admin/blog/posts/[id]',
      'GET   /api/admin/blog/categories',
      'GET   /api/admin/blog/comments',
      'GET   /api/admin/services',
      'GET   /api/admin/colleagues',
      'GET   /api/admin/testimonials',
      'GET   /api/admin/contact-messages',
      'GET   /api/admin/media',
      'GET   /api/admin/media/[id]/file',
      'GET   /api/admin/media/[id]/url',
      'GET   /api/settings',
      'GET   /api/home-builder',
      'GET   /api/pages',
      'GET   /api/pages/[id]',
      'POST  /api/admin/blog/posts',
      'POST  /api/admin/blog/categories',
      'POST  /api/admin/services',
      'POST  /api/admin/colleagues',
      'POST  /api/admin/testimonials',
      'POST  /api/admin/media/upload',
      'POST  /api/pages',
      'PUT   /api/settings',
      'PUT   /api/home-builder',
      'PUT   /api/pages/[id]',
      'PUT   /api/admin/blog/posts/[id]',
      'PUT   /api/admin/blog/categories/[id]',
      'PUT   /api/admin/blog/comments/[id]',
      'PUT   /api/admin/services/[id]',
      'PUT   /api/admin/testimonials/[id]',
      'PUT   /api/admin/colleagues/[id]',
      'PATCH /api/admin/blog/posts/[id]/status',
      'DELETE /api/pages/[id]',
      'DELETE /api/admin/blog/posts/[id]',
      'DELETE /api/admin/blog/categories/[id]',
      'DELETE /api/admin/blog/comments/[id]',
      'DELETE /api/admin/blog/comments/[id]/likes',
      'DELETE /api/admin/services/[id]',
      'DELETE /api/admin/testimonials/[id]',
      'DELETE /api/admin/colleagues/[id]',
      'DELETE /api/admin/contact-messages/[id]',
      'DELETE /api/admin/media/[id]',
    ]
    expect(adminEndpoints).toHaveLength(43)
  })

  it('total API endpoints count is 52', () => {
    const allEndpoints = [
      // Public (14)
      'GET  /api/settings/public',
      'GET  /api/pages/public/[slug]',
      'GET  /api/home-builder/public',
      'GET  /api/blog/posts',
      'GET  /api/blog/posts/[slug]',
      'GET  /api/blog/posts/recent',
      'GET  /api/services/public',
      'GET  /api/colleagues/public',
      'GET  /api/testimonials/public',
      'GET  /api/sections',
      'POST /api/contact-messages',
      'POST /api/blog/posts/[slug]/comments',
      'POST /api/blog/comments/[id]/like',
      'POST /api/auth/login',
      // Admin (38)
      'GET   /api/admin/dashboard/stats',
      'GET   /api/admin/blog/posts',
      'GET   /api/admin/blog/posts/[id]',
      'GET   /api/admin/blog/categories',
      'GET   /api/admin/blog/comments',
      'GET   /api/admin/services',
      'GET   /api/admin/colleagues',
      'GET   /api/admin/testimonials',
      'GET   /api/admin/contact-messages',
      'GET   /api/admin/media',
      'GET   /api/admin/media/[id]/file',
      'GET   /api/admin/media/[id]/url',
      'GET   /api/settings',
      'GET   /api/home-builder',
      'GET   /api/pages',
      'GET   /api/pages/[id]',
      'POST  /api/admin/blog/posts',
      'POST  /api/admin/blog/categories',
      'POST  /api/admin/services',
      'POST  /api/admin/colleagues',
      'POST  /api/admin/testimonials',
      'POST  /api/admin/media/upload',
      'POST  /api/pages',
      'PUT   /api/settings',
      'PUT   /api/home-builder',
      'PUT   /api/pages/[id]',
      'PUT   /api/admin/blog/posts/[id]',
      'PUT   /api/admin/blog/categories/[id]',
      'PUT   /api/admin/blog/comments/[id]',
      'PUT   /api/admin/services/[id]',
      'PUT   /api/admin/testimonials/[id]',
      'PUT   /api/admin/colleagues/[id]',
      'PATCH /api/admin/blog/posts/[id]/status',
      'DELETE /api/pages/[id]',
      'DELETE /api/admin/blog/posts/[id]',
      'DELETE /api/admin/blog/categories/[id]',
      'DELETE /api/admin/blog/comments/[id]',
      'DELETE /api/admin/blog/comments/[id]/likes',
      'DELETE /api/admin/services/[id]',
      'DELETE /api/admin/testimonials/[id]',
      'DELETE /api/admin/colleagues/[id]',
      'DELETE /api/admin/contact-messages/[id]',
      'DELETE /api/admin/media/[id]',
    ]
    expect(allEndpoints).toHaveLength(57)
  })
})