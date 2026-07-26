import { useUserSession } from '#imports'
import type { UserSession } from '../../types/user-session'

export function useAdminSession() {
  const session = useUserSession()
  
  const isAdmin = computed(() => {
    const user = session.user.value as UserSession | null
    return user?.role === 'admin'
  })
  
  return {
    ...session,
    isAdmin,
    user: session.user as Ref<UserSession | null>
  }
}