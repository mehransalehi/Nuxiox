import { eq } from 'drizzle-orm'
import { pages } from '~~/server/database/schema.gen'
import { defaultPageBuilder } from '~~/layers/base/utils/page-builder'
import type { PageBuilder } from '~~/layers/base/types/page-builder'
import { useDb } from '~~/server/utils/db'

type UpdatePagePayload = {
  title?: string
  slug?: string
  status?: 'draft' | 'published'
  seo?: Record<string, unknown>
  builder?: PageBuilder
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page id' })
  }

  const body = (await readBody(event)) as UpdatePagePayload

  const payload: Partial<UpdatePagePayload> & { updatedAt: Date } = {
    updatedAt: new Date(),
  }

  if (body.title !== undefined) payload.title = body.title
  if (body.slug !== undefined) payload.slug = body.slug
  if (body.status !== undefined) payload.status = body.status
  if (body.seo !== undefined) payload.seo = body.seo
  if (body.builder !== undefined) payload.builder = body.builder ?? defaultPageBuilder

  const db = useDb(event)
  const [updated] = await db
    .update(pages)
    .set(payload)
    .where(eq(pages.id, id))
    .returning()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return updated
})
