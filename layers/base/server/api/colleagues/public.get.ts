import { asc, eq, and } from "drizzle-orm"
import { colleagues, colleaguesLocales } from "~~/server/database/schema.gen"
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {
  const locale = getLocale(event)
  const db = useDb(event)

  return db
    .select({
      id: colleagues.id,
      icon: colleagues.icon,
      image: colleagues.image,
      link: colleagues.link,
      sortOrder: colleagues.sort_order,
      isActive: colleagues.is_active,
      createdAt: colleagues.created_at,
      updatedAt: colleagues.updated_at,

      title: colleaguesLocales.title,
      subtitle: colleaguesLocales.subtitle,
      description: colleaguesLocales.description,
      extra: colleaguesLocales.extra,
    })
    .from(colleagues)
    .leftJoin(
      colleaguesLocales,
      and(
        eq(colleaguesLocales.colleague_id, colleagues.id),
        eq(colleaguesLocales.locale, locale)
      )
    )
    .orderBy(asc(colleagues.sort_order), asc(colleagues.id))
})