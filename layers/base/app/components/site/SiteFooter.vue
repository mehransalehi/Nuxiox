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

const isLinkValue = (value: string) =>
  value.startsWith('http://') ||
  value.startsWith('https://') ||
  value.startsWith('mailto:') ||
  value.startsWith('tel:')

const formatInfoLabel = (item: InfoItem) => `${item.key}:`
</script>

<template>
  <footer class="bg-base-200 border-t border-base-300">
    <div class="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr]">
      <div class="space-y-4">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <img
            v-if="props.lightLogo"
            :src="props.lightLogo"
            alt="Footer logo"
            class="h-8 w-auto dark:hidden"
          />
          <img
            v-if="props.darkLogo"
            :src="props.darkLogo"
            alt="Footer logo"
            class="hidden h-8 w-auto dark:block"
          />
        </NuxtLink>
        <p class="text-sm text-base-content/70">
          {{ props.info.length ? $t('site.stayConnected') : $t('site.thanks') }}
        </p>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">{{ $t('site.language') }}</span>
          </label>
          <select
            class="select select-bordered"
            :value="locale"
            @change="setLocale(($event.target as HTMLSelectElement).value as 'en' | 'fa')"
          >
            <option v-for="item in availableLocales" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <h3 class="footer-title text-base-content">{{ $t('site.menu') }}</h3>
        <ul class="menu menu-vertical">
          <li v-for="menu in props.menus" :key="menu.label">
            <NuxtLink :to="$localePath(menu.href)">{{ menu.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="footer-title text-base-content">{{ $t('site.information') }}</h3>
        <ul class="space-y-2 text-sm text-base-content/70">
          <li v-for="item in props.info" :key="item.key">
            <span class="font-semibold text-base-content">{{ formatInfoLabel(item) }}</span>
            <a v-if="isLinkValue(item.value)" :href="item.value" class="link link-hover">
              {{ item.value }}
            </a>
            <span v-else>{{ item.value }}</span>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
