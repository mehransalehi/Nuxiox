import type { UserSession } from "../../types/user-session"
export default defineNuxtRouteMiddleware(() => {
    const { user } = useUserSession() as { user: Ref<UserSession | null> }
    if (!user.value || user.value.role !== 'admin') {
        return navigateTo('/login')
    }
})
