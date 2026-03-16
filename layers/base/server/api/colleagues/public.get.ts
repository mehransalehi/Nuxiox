import { asc, eq, and } from "drizzle-orm"
import { colleagues, colleaguesLocales } from "~~/server/database/schema.gen"
import { useDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const locale = getLocale(event)
  const db = useDb(event)

  return db
    .select({
      id: colleagues.id,
      icon: colleagues.icon,
      image: colleagues.image,
      link: colleagues.link,
      sortOrder: colleagues.sortOrder,
      isActive: colleagues.isActive,
      createdAt: colleagues.createdAt,
      updatedAt: colleagues.updatedAt,

      title: colleaguesLocales.title,
      subtitle: colleaguesLocales.subtitle,
      description: colleaguesLocales.description,
      extra: colleaguesLocales.extra,
    })
    .from(colleagues)
    .leftJoin(
      colleaguesLocales,
      and(
        eq(colleaguesLocales.colleagueId, colleagues.id),
        eq(colleaguesLocales.locale, locale)
      )
    )
    .orderBy(asc(colleagues.sortOrder), asc(colleagues.id))
})
