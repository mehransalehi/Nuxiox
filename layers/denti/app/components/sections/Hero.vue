<script setup lang="ts">
const { settings } = useSiteSettings()
const { t } = useI18n()

const highlights = computed(() => settings.value.navbar.info?.slice(0, 3) ?? [])
</script>

<template>
  <section class="rounded-3xl bg-gradient-to-b from-sky-100 to-sky-50 p-6 md:p-10">
    <div class="grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div class="space-y-4">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-sky-600">{{ t('site.brand') }}</p>
        <h1 class="text-5xl font-extrabold uppercase leading-none text-sky-500 md:text-7xl">Every Smile Matters</h1>
        <p class="max-w-xl text-sm opacity-70">Our skilled dentists use modern technology to offer complete care in a comfortable and friendly clinic.</p>
        <NuxtLink to="/contact" class="btn rounded-full border-none bg-orange-500 text-white hover:bg-orange-600">Book Appointment</NuxtLink>
      </div>
      <div class="space-y-3">
        <div class="mx-auto flex aspect-square max-w-xs items-center justify-center rounded-full bg-white shadow-lg">
          <span class="text-8xl">🦷</span>
        </div>
        <div class="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          <div v-for="(item, idx) in highlights" :key="item.key" class="rounded-2xl bg-white/80 p-3 text-sm shadow">
            <p class="font-bold text-orange-500">{{ String(idx + 1).padStart(2, '0') }}+</p>
            <p class="font-medium">{{ item.key }}</p>
            <p class="opacity-70">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
