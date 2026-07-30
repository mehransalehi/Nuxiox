import { colleagues, colleaguesLocales } from "~~/server/database/schema.gen"
 
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
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const body = await readValidatedBody(event, checkZod(schema));
  const db = useDb(event)

  const [colleague] = await db
    .insert(colleagues)
    .values({
      icon: body.icon ?? null,
      image: body.image ?? null,
      link: body.link ?? null,
      sortOrder: Number(body.sortOrder ?? 0),
      isActive: Boolean(body.isActive ?? true),
    })
    .returning({ id: colleagues.id })

  if (!colleague)
    throw createError({ statusCode: 400, statusMessage: "Colleague not saved" })

  await db.insert(colleaguesLocales).values({
    colleague_id: colleague.id,
    locale: body.locale,
    title: String(body.title ?? "").trim(),
    subtitle: body.subtitle ?? null,
    description: body.description ?? null,
    extra: Array.isArray(body.extra) ? body.extra : [],
  })

  return { id: colleague.id }
})
