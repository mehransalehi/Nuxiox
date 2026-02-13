import { z } from 'zod'
import { blogPostCategories, blogPosts } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

const schema = z.object({
  title: z.string().min(2).max(220),
  slug: z.string().min(2).max(220),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(2),
  featuredImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  allowComments: z.boolean().default(true),
  allowAnonymousComments: z.boolean().default(true),
  categoryIds: z.array(z.number().int().positive()).default([]),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const body = schema.parse(await readBody(event))
  const db = useDb(event)

  const [post] = await db.insert(blogPosts).values({
    authorId: session.user.id,
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt ?? null,
    content: body.content,
    featuredImage: body.featuredImage || null,
    status: body.status,
    allowComments: body.allowComments,
    allowAnonymousComments: body.allowAnonymousComments,
    publishedAt: body.status === 'published' ? new Date() : null,
  }).returning({ id: blogPosts.id })

  if (body.categoryIds.length) {
    await db.insert(blogPostCategories).values(body.categoryIds.map((categoryId) => ({ postId: post.id, categoryId })))
  }

  return { id: post.id }
})
