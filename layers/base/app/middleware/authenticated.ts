import type { UserSession } from '../../types/user-session'

export default defineNuxtRouteMiddleware(async () => {
  const session = useUserSession() as {
    user: Ref<UserSession | null>
    fetch?: () => Promise<void>
  }

  if (!session.user.value && session.fetch) {
    await session.fetch()
  }

  if (!session.user.value || session.user.value.role !== 'admin') {
    return navigateTo('/login')
  }
})
