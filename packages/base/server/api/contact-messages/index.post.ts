import { z } from 'zod'
import { contactMessages } from '~~/server/database/schema.gen'
import { checkZod } from "~~/server/utils/checkZod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  address: z.string().optional().default(''),
  subject: z.string().max(200).optional().default(''),
  message: z.string().min(5).max(5000),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, checkZod(schema));

  try {
    await useDb(event).insert(contactMessages).values(body)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message.includes('no such table')) {
      throw createError({
        statusCode: 503,
        message: 'Contact messages service is temporarily unavailable',
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Unable to save contact message',
    })
  }
})
