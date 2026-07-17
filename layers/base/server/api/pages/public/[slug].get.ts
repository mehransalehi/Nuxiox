import { and, eq } from 'drizzle-orm'
import { pages, pagesLocales } from '~~/server/database/schema.gen'
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })
  }
  const locale = getLocale(event)


  const db = useDb(event)

  const [page] = await db
    .select({
      id: pages.id,
      status: pages.status,
      createdAt: pages.created_at,
      updatedAt: pages.updated_at,

      locale: pagesLocales.locale,
      title: pagesLocales.title,
      slug: pagesLocales.slug,
      seo: pagesLocales.seo,
      builder: pagesLocales.builder,
    })
    .from(pagesLocales)
    .leftJoin(pages, eq(pages.id, pagesLocales.page_id))
    .where(
      and(
        eq(pagesLocales.slug, slug),
        eq(pagesLocales.locale, locale),
        eq(pages.status, 'published')
      )
    )
    .limit(1)

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
