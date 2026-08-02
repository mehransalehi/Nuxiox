<script setup lang="ts">
import { useSiteSettings } from '../composables/useSiteSettings';
import Navbar from '../components/sections/Navbar.vue';
import Footer from '../components/sections/Footer.vue';

const { settings } = useSiteSettings();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
    <Navbar
      :menus="settings.navbar.menus"
      :dark-logo="settings.navbar.darkLogo"
      :light-logo="settings.navbar.lightLogo"
      :info="settings.navbar.info"
      :show-sidebar="settings.general.showSidebar"
    />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer
      :menus="settings.footer.menus"
      :dark-logo="settings.footer.darkLogo"
      :light-logo="settings.footer.lightLogo"
      :info="settings.footer.info"
    />
  </div>
</template>
