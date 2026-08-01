import { eq,and } from 'drizzle-orm'
import { pages,pagesLocales } from '~~/server/database/schema.gen'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = Number(getRouterParam(event, 'id'))
  const locale = getQuery(event).locale as string

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: 'Invalid page id' })
  }

  if (!locale) {
    throw createError({ statusCode: 400, message: 'Locale is required' })
  }

  const db = useDb(event)
  const [page] = await db
    .select()
    .from(pages)
    .leftJoin(pagesLocales, eq(pages.id, pagesLocales.page_id))
    .where(
      and(
        eq(pages.id, id),
        eq(pagesLocales.locale, locale)
      )
    )
    .limit(1)

  if (!page) {
    throw createError({ statusCode: 404, message: "Page not found" })
  }
  return page
})
