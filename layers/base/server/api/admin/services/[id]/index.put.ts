import { eq, and } from "drizzle-orm";
import { services, servicesLocales } from "~~/server/database/schema.gen";
 ;
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { checkZod } from "~~/server/utils/checkZod";
import { z } from "zod";

const schema = z.object({
  locale: z.string().min(2).max(10),
  title: z.string().min(2).max(200),
  subtitle: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  extra: z.array(z.any()).optional().default([]),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  const body = await readValidatedBody(event, checkZod(schema));
  const db = useDb(event);

  await db
    .update(services)
    .set({
      icon: body.icon ?? null,
      image: body.image ?? null,
      link: body.link ?? null,
      sort_order: Number(body.sortOrder ?? 0),
      is_active: Boolean(body.isActive ?? true),
      updated_at: new Date(),
    })
    .where(eq(services.id, id));


    const [existing] = await db
    .select({ id: servicesLocales.id })
    .from(servicesLocales)
    .where(
      and(
        eq(servicesLocales.service_id, id),
        eq(servicesLocales.locale, body.locale),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(servicesLocales)
      .set({
        title: body.title,
        subtitle: body.subtitle ?? null,
        description: body.description ?? null,
        extra: Array.isArray(body.extra) ? body.extra : [],
      })
      .where(eq(servicesLocales.id, existing.id));
  } else {
    await db.insert(servicesLocales).values({
      service_id: id,
      locale: body.locale,
      title: body.title,
      subtitle: body.subtitle ?? null,
      description: body.description ?? null,
      extra: Array.isArray(body.extra) ? body.extra : [],
    });
  }

  return { success: true };
});