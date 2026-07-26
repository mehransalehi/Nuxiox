<script setup lang="ts">
const { settings } = useSiteSettings()
</script>

<template>
  <SiteFooter
    :menus="settings.footer.menus"
    :dark-logo="settings.footer.darkLogo"
    :light-logo="settings.footer.lightLogo"
    :info="settings.footer.info"
  />
</template>
