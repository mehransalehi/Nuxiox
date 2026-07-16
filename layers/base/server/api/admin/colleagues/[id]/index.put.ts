import { eq, and } from "drizzle-orm";
import { colleagues, colleaguesLocales } from "~~/server/database/schema.gen";
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
    .update(colleagues)
    .set({
      icon: body.icon ?? null,
      image: body.image ?? null,
      link: body.link ?? null,
      sortOrder: Number(body.sortOrder ?? 0),
      isActive: Boolean(body.isActive ?? true),
      updatedAt: new Date(),
    })
    .where(eq(colleagues.id, id));

  const [existingLocale] = await db
    .select({ id: colleaguesLocales.id })
    .from(colleaguesLocales)
    .where(
      and(
        eq(colleaguesLocales.colleagueId, id),
        eq(colleaguesLocales.locale, body.locale),
      ),
    )
    .limit(1);

  if (existingLocale) {
    await db
      .update(colleaguesLocales)
      .set({
        title: String(body.title ?? "").trim(),
        subtitle: body.subtitle ?? null,
        description: body.description ?? null,
        extra: Array.isArray(body.extra) ? body.extra : [],
      })
      .where(eq(colleaguesLocales.id, existingLocale.id));
  } else {
    await db.insert(colleaguesLocales).values({
      colleagueId: id,
      locale: body.locale,
      title: String(body.title ?? "").trim(),
      subtitle: body.subtitle ?? null,
      description: body.description ?? null,
      extra: Array.isArray(body.extra) ? body.extra : [],
    });
  }

  return { success: true };
});
