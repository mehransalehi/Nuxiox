import { z } from 'zod'
import { contactMessages } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().max(200).optional().default(''),
  message: z.string().min(5).max(5000),
})

export default defineEventHandler(async (event) => {
  const body = schema.parse(await readBody(event))

  try {
    await useDb(event).insert(contactMessages).values(body)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message.includes('no such table')) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Contact messages service is temporarily unavailable',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to save contact message',
    })
  }
})
