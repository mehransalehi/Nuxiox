import { pages } from '~~/server/database/schema.gen'
import { defaultPageBuilder } from '~~/layers/base/utils/page-builder'
import { useDb } from '~~/server/utils/db'

type CreatePagePayload = {
  title: string
  slug: string
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = (await readBody(event)) as Partial<CreatePagePayload>
  if (!body?.title || !body?.slug) {
    throw createError({ statusCode: 400, statusMessage: 'Title and slug are required' })
  }

  const db = useDb(event)
  const now = new Date()
  const seo = {
    title: body.title,
    description: `Learn more about ${body.title}.`,
    canonical: `/${body.slug}`,
    robots: 'index,follow',
  }
  const [created] = await db
    .insert(pages)
    .values({
      title: body.title,
      slug: body.slug,
      status: 'draft',
      seo,
      builder: defaultPageBuilder,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return created
})
