import type { H3Event } from "h3"
import type { UserSession } from "~~/packages/base/utils/other"

export async function requireAdmin(event: H3Event): Promise<UserSession> {
  const session = await requireUserSession(event)
  const user = session.user as UserSession | null

  if (!user || user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    })
  }

  return user
}