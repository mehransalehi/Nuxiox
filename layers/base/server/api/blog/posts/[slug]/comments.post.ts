import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { blogComments, blogPosts, settings } from '~~/server/database/schema.gen'
import { defaultSettings } from '~~/layers/base/utils/settings'
import { useDb } from '~~/server/utils/db'

const schema = z.object({
  content: z.string().min(2).max(3000),
  parentId: z.number().int().positive().nullable().optional(),
  authorName: z.string().min(2).max(120).optional(),
  authorEmail: z.string().email().optional(),
  captchaToken: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug is required' })

  const body = schema.parse(await readBody(event))
  const db = useDb(event)

  const rows = await db.select().from(settings).where(eq(settings.key, 'blog')).limit(1)
  const blogSettings = {
    ...defaultSettings.blog,
    ...((rows[0]?.value as typeof defaultSettings.blog | undefined) ?? {}),
  }

  if (!blogSettings.commentsEnabled) {
    throw createError({ statusCode: 403, statusMessage: 'Comments are disabled by admin' })
  }

  if (blogSettings.recaptchaSecretKey) {
    const verify = await $fetch<{ success: boolean }>('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: blogSettings.recaptchaSecretKey,
        response: body.captchaToken,
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!verify.success) {
      throw createError({ statusCode: 400, statusMessage: 'Captcha validation failed' })
    }
  }

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')))
    .limit(1)

  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  if (!post.allowComments) throw createError({ statusCode: 403, statusMessage: 'Comments are disabled for this post' })

  const session = await getUserSession(event)
  const user = session?.user

  if (!user?.id && !post.allowAnonymousComments) {
    throw createError({ statusCode: 403, statusMessage: 'You must login to comment on this post' })
  }

  if (!user?.id && !blogSettings.allowAnonymousCommentsByDefault) {
    throw createError({ statusCode: 403, statusMessage: 'Guest comments are disabled by admin' })
  }

  const status = blogSettings.commentsRequireApproval ? 'pending' : 'approved'

  const [created] = await db.insert(blogComments).values({
    postId: post.id,
    parentId: body.parentId ?? null,
    userId: user?.id ?? null,
    authorName: user?.email ?? body.authorName ?? 'Guest',
    authorEmail: user?.email ?? body.authorEmail ?? null,
    content: body.content,
    status,
  }).returning()

  return {
    success: true,
    status,
    comment: created,
  }
})
