export default defineNuxtRouteMiddleware(async () => {
  const { user, fetch } = useUserSession();

  if (!user.value) {
    if (fetch) await fetch();
  }

  if (!user.value) {
    return navigateTo("/user/login");
  }
});