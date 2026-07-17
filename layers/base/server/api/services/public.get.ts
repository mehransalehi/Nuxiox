import { asc, eq, and } from 'drizzle-orm'
import { services, servicesLocales } from '~~/server/database/schema.gen'
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {

  const locale = getLocale(event)
  const db = useDb(event)
  const result = await db
    .select({
      id: services.id,
      icon: services.icon,
      image: services.image,
      link: services.link,
      sortOrder: services.sort_order,
      isActive: services.is_active,
      createdAt: services.created_at,
      updatedAt: services.updated_at,

      title: servicesLocales.title,
      subtitle: servicesLocales.subtitle,
      description: servicesLocales.description,
      extra: servicesLocales.extra,
      locale : servicesLocales.locale
    })
    .from(services)
    .leftJoin(
      servicesLocales,
      and(
        eq(servicesLocales.service_id, services.id),
        eq(servicesLocales.locale, locale),
      ),
    )
    .orderBy(asc(services.sort_order), asc(services.id))
  return result; 
})
