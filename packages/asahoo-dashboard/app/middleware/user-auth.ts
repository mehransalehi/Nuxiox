export default defineNuxtRouteMiddleware(async () => {
  const { user, fetch } = useUserSession();

  if (!user.value) {
    if (fetch) await fetch();
  }

  if (!user.value || user.value.role !== 'user') {
    return navigateTo("/user/login");
  }
});