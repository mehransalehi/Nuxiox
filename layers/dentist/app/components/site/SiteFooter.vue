<script setup lang="ts">
import type { InfoItem, MenuItem } from '~~/layers/base/utils/settings'

type Props = {
  menus: MenuItem[]
  darkLogo: string
  lightLogo: string
  info: InfoItem[]
}

const props = defineProps<Props>()
const { locale, setLocale, t, availableLocales } = useI18n()
</script>

<template>
  <!-- <footer class="space-y-6 border-t border-sky-100 bg-sky-100/70 px-4 py-8 md:px-8">
    <h2 class="denti-gradient-title text-center text-5xl font-extrabold uppercase leading-none md:text-8xl">Denta Care Health Venue</h2>
    <div class="grid gap-6 rounded-3xl bg-sky-200/60 p-6 md:grid-cols-3">
      <div class="space-y-3 text-sm">
        <p class="font-bold text-sky-700">DENTA CARE</p>
        <ul class="space-y-1 opacity-80">
          <li v-for="item in props.info" :key="item.key">{{ item.key }}: {{ item.value }}</li>
        </ul>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">{{ t('site.menu') }}</h3>
        <ul class="space-y-1 text-sm">
          <li v-for="menu in props.menus" :key="menu.label"><NuxtLink :to="menu.href" class="hover:text-sky-600">{{ menu.label }}</NuxtLink></li>
        </ul>
      </div>
      <div class="space-y-3">
        <h3 class="font-semibold">{{ t('site.language') }}</h3>
        <select class="select select-bordered w-full max-w-xs" :value="locale" @change="setLocale(($event.target as HTMLSelectElement).value as 'en' | 'fa')">
          <option v-for="item in availableLocales" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </div>
    </div>
  </footer> -->
  <footer class="bg-[#0a1732] text-slate-300">
    <div class="footer mx-auto max-w-6xl p-10">
      <aside>
        <p class="text-lg font-black text-white"><i class="fa-solid fa-tooth mr-2 text-primary"></i>Denti</p>
        <p>Making smiles beautiful since 2002.</p>
        <div class="mt-4 flex gap-3 text-sm">
          <a class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary"><i class="fa-brands fa-facebook-f"></i></a>
          <a class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary"><i class="fa-brands fa-instagram"></i></a>
          <a class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary"><i class="fa-brands fa-x-twitter"></i></a>
          <a class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
      </aside>
      <nav>
        <h6 class="footer-title">Company</h6>
        <a class="link link-hover">About us</a>
        <a class="link link-hover">Contact</a>
      </nav>
      <nav>
        <h6 class="footer-title">Services</h6>
        <a class="link link-hover">Whitening</a>
        <a class="link link-hover">Implants</a>
      </nav>
      <nav>
        <h6 class="footer-title">Legal</h6>
        <a class="link link-hover">Privacy policy</a>
        <a class="link link-hover">Terms</a>
      </nav>
    </div>
    <div class="border-t border-white/10 py-4 text-center text-xs">© 2026 Denti Dental Clinic.</div>
  </footer>
</template>
