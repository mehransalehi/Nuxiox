import { settings } from '~~/server/database/schema.gen'
import { defaultHomeBuilder } from '~~/layers/base/utils/page-builder'
import type { HomeBuilder } from '~~/layers/base/types/page-builder'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = (await readBody(event)) as Partial<HomeBuilder>
  const payload: HomeBuilder = {
    version: body.version ?? defaultHomeBuilder.version,
    sections: Array.isArray(body.sections) ? body.sections : defaultHomeBuilder.sections,
  }

  const db = useDb(event)
  const now = new Date()

  await db
    .insert(settings)
    .values({
      key: 'home_sections',
      value: payload,
      description: 'Home page sections builder',
      isPublic: true,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: payload,
        description: 'Home page sections builder',
        isPublic: true,
        updatedAt: now,
      },
    })

  return { success: true }
})
