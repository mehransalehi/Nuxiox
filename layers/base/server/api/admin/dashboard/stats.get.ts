import { desc, eq, sql } from 'drizzle-orm'
import { blogPosts, colleagues, contactMessages, pages, services, settings, users } from '~~/server/database/schema.gen'
import { defaultSettings } from '~~/layers/base/utils/settings'
import { useDb } from '~~/server/utils/db'

const safeCount = async (runner: () => Promise<number>) => {
  try {
    return await runner()
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message.includes('no such table')) return 0
    throw error
  }
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const db = useDb(event)

  const usersCount = await safeCount(async () => {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(users)
    return Number(row?.count ?? 0)
  })

  const pagesCount = await safeCount(async () => {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(pages)
    return Number(row?.count ?? 0)
  })

  const postsCount = await safeCount(async () => {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts)
    return Number(row?.count ?? 0)
  })

  const newContacts = await safeCount(async () => {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(contactMessages)
    return Number(row?.count ?? 0)
  })

  const colleaguesCount = await safeCount(async () => {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(colleagues)
    return Number(row?.count ?? 0)
  })

  const servicesCount = await safeCount(async () => {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(services)
    return Number(row?.count ?? 0)
  })

  const lastBlogPostDate = await (async () => {
    try {
      const [row] = await db
        .select({ createdAt: blogPosts.createdAt, publishedAt: blogPosts.publishedAt })
        .from(blogPosts)
        .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
        .limit(1)
      return Number(row?.publishedAt ?? row?.createdAt ?? 0)
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('no such table')) return 0
      throw error
    }
  })()

  const seoCompletionPercent = await (async () => {
    const keys = Object.keys(defaultSettings.seo)
    try {
      const [seoRow] = await db.select().from(settings).where(eq(settings.key, 'seo')).limit(1)
      const seo = {
        ...defaultSettings.seo,
        ...((seoRow?.value as typeof defaultSettings.seo | undefined) ?? {}),
      }
      const filled = keys.filter((key) => String(seo[key as keyof typeof seo] ?? '').trim().length > 0).length
      return Math.round((filled / keys.length) * 100)
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('no such table')) return 0
      throw error
    }
  })()

  return {
    usersCount,
    pagesCount,
    postsCount,
    newContacts,
    colleaguesCount,
    servicesCount,
    lastBlogPostDate,
    seoCompletionPercent,
  }
})
