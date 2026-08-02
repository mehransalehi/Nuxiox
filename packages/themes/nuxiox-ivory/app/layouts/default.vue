<script setup lang="ts">
import { useSiteSettings } from '../composables/useSiteSettings';
import { useLayoutOverrides } from '../composables/useLayoutOverrides';
import Navbar from '../components/sections/Navbar.vue';
import Footer from '../components/sections/Footer.vue';

const { settings } = useSiteSettings();
const layoutOverrides = useLayoutOverrides();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
    <!-- Navbar -->
    <Navbar 
      v-if="!layoutOverrides.hideNavbar"
      :menus="settings.navbar.menus"
      :dark-logo="settings.navbar.darkLogo"
      :light-logo="settings.navbar.lightLogo"
      :info="settings.navbar.info"
    />

    <!-- Main Content Slot -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <Footer 
      v-if="!layoutOverrides.hideFooter"
      :menus="settings.footer.menus"
      :dark-logo="settings.footer.darkLogo"
      :light-logo="settings.footer.lightLogo"
      :info="settings.footer.info"
    />
  </div>
</template>
