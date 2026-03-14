import { eq,and } from 'drizzle-orm'
import { pages,pagesLocales } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = Number(getRouterParam(event, 'id'))
  const locale = getQuery(event).locale as string

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page id' })
  }

  if (!locale) {
    throw createError({ statusCode: 400, statusMessage: 'Locale is required' })
  }

  const db = useDb(event)
  const [page] = await db
    .select()
    .from(pages)
    .leftJoin(pagesLocales, eq(pages.id, pagesLocales.pageId))
    .where(
      and(
        eq(pages.id, id),
        eq(pagesLocales.locale, locale)
      )
    )
    .limit(1)

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" })
  }

  return page
})
