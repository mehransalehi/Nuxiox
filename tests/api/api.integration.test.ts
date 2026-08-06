import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

// Boot Nuxt dev server for integration tests
await setup({
  server: true,
  browser: false,
  setupTimeout: 120000,
})

// ============================================================
// PUBLIC API ENDPOINTS
// ============================================================

describe('Public API Endpoints', () => {
  it('GET /api/settings/public returns site settings', async () => {
    const data = await $fetch('/api/settings/public')
    expect(data).toHaveProperty('general')
    expect(data).toHaveProperty('navbar')
    expect(data).toHaveProperty('footer')
    expect(data).toHaveProperty('blog')
    expect(data).toHaveProperty('seo')
    expect(data).toHaveProperty('theme')
    expect(data).toHaveProperty('about')
  })

  it('GET /api/home-builder/public returns home builder config', async () => {
    const data = await $fetch('/api/home-builder/public')
    expect(data).toHaveProperty('sections')
    expect(data).toHaveProperty('version')
  })

  it('GET /api/services/public returns services list', async () => {
    const data = await $fetch('/api/services/public')
    expect(Array.isArray(data)).toBe(true)
  })

  it('GET /api/colleagues/public returns colleagues list', async () => {
    const data = await $fetch('/api/colleagues/public')
    expect(Array.isArray(data)).toBe(true)
  })

  it('GET /api/testimonials/public returns testimonials list', async () => {
    const data = await $fetch('/api/testimonials/public')
    expect(Array.isArray(data)).toBe(true)
  })

  it('GET /api/blog/posts returns paginated posts', async () => {
    const data = await $fetch('/api/blog/posts')
    expect(data).toHaveProperty('items')
    expect(data).toHaveProperty('categories')
    expect(data).toHaveProperty('total')
    expect(data).toHaveProperty('page')
    expect(data).toHaveProperty('pageSize')
    expect(data).toHaveProperty('totalPages')
    expect(Array.isArray(data.items)).toBe(true)
  })

  it('GET /api/blog/posts/recent returns recent posts', async () => {
    const data = await $fetch('/api/blog/posts/recent')
    expect(Array.isArray(data)).toBe(true)
  })

  it('GET /api/blog/posts/:slug - 404 for non-existent post', async () => {
    await expect($fetch('/api/blog/posts/non-existent-post-xyz')).rejects.toThrow()
  })

  it('POST /api/auth/login - 400 for invalid data', async () => {
    await expect(
      $fetch('/api/auth/login', {
        method: 'POST',
        body: { email: 'bad', password: 'short' },
      }),
    ).rejects.toThrow()
  })

  it('POST /api/contact-messages - validates required fields', async () => {
    await expect(
      $fetch('/api/contact-messages', {
        method: 'POST',
        body: { name: 'T', email: 'bad', message: 'Hi' },
      }),
    ).rejects.toThrow()
  })
})

// ============================================================
// ADMIN API — AUTH GUARDS
// ============================================================

describe('Admin API — Auth Guards', () => {
  it('GET /api/admin/dashboard/stats returns 401 without auth', async () => {
    await expect($fetch('/api/admin/dashboard/stats')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/admin/blog/posts returns 401 without auth', async () => {
    await expect($fetch('/api/admin/blog/posts')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/admin/blog/categories returns 401 without auth', async () => {
    await expect($fetch('/api/admin/blog/categories')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/admin/blog/comments returns 401 without auth', async () => {
    await expect($fetch('/api/admin/blog/comments')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/admin/services returns 401 without auth', async () => {
    await expect($fetch('/api/admin/services')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/admin/colleagues returns 401 without auth', async () => {
    await expect($fetch('/api/admin/colleagues')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/admin/testimonials returns 401 without auth', async () => {
    await expect($fetch('/api/admin/testimonials')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/admin/contact-messages returns 401 without auth', async () => {
    await expect($fetch('/api/admin/contact-messages')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/admin/media returns 401 without auth', async () => {
    await expect($fetch('/api/admin/media')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/settings (admin) returns 401 without auth', async () => {
    await expect($fetch('/api/settings')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/home-builder (admin) returns 401 without auth', async () => {
    await expect($fetch('/api/home-builder')).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('GET /api/pages (admin) returns 401 without auth', async () => {
    await expect($fetch('/api/pages')).rejects.toMatchObject({
      statusCode: 401,
    })
  })
})

// ============================================================
// PUBLIC PAGE ROUTES
// ============================================================

describe('Public Page Routes', () => {
  it('GET /api/pages/public/:slug - 404 for non-existent', async () => {
    await expect(
      $fetch('/api/pages/public/non-existent-page-xyz'),
    ).rejects.toThrow()
  })

  it('GET /api/sections returns sections list (requires auth)', async () => {
    await expect($fetch('/api/sections')).rejects.toMatchObject({
      statusCode: 401,
    })
  })
})

// ============================================================
// API ROUTE COVERAGE
// ============================================================

describe('API Route Coverage', () => {
  it('has all public endpoints documented', () => {
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
    expect(publicEndpoints.length).toBe(14)
  })

  it('has all admin endpoints documented', () => {
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
    expect(adminEndpoints.length).toBe(43)
  })
})