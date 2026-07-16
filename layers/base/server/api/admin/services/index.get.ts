import { asc, eq, and } from 'drizzle-orm'
import { services, servicesLocales } from '~~/server/database/schema.gen'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const locale = String(getQuery(event).locale ?? 'en')
  const db = useDb(event)
  const result = await db
    .select({
      id: services.id,
      icon: services.icon,
      image: services.image,
      link: services.link,
      sortOrder: services.sortOrder,
      isActive: services.isActive,
      createdAt: services.createdAt,
      updatedAt: services.updatedAt,

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
        eq(servicesLocales.serviceId, services.id),
      ),
    )
    .orderBy(asc(services.sortOrder), asc(services.id))
  return result; 
})
