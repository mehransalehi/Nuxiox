export default defineNuxtRouteMiddleware(async () => {
  const { user, isAdmin, fetch } = useAdminSession()

  if (!user.value && fetch) {
    await fetch()
  }

  if (!user.value || !isAdmin.value) {
    return navigateTo('/login')
  }
})