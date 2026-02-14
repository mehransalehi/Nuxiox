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
  await useDb(event).insert(contactMessages).values(body)
  return { success: true }
})
