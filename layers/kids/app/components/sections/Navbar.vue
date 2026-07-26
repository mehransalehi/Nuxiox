<script setup lang="ts">
const { settings } = useSiteSettings()
</script>

<template>
  <SiteNavbar
    :menus="settings.navbar.menus"
    :dark-logo="settings.navbar.darkLogo"
    :light-logo="settings.navbar.lightLogo"
    :info="settings.navbar.info"
    :show-sidebar="settings.general.showSidebar"
  />
</template>
