<script setup lang="ts">
const { settings } = useSiteSettings()


const highlights = computed(() => settings.value.navbar.info?.slice(0, 3) ?? [])
const tags = ['Braces', 'Denta Care', 'Dentist', 'Dentures', 'Invisalign', 'Teeth Cleaning']
</script>

<template>
  <section class="space-y-4 scroll-reveal">
    <div class="rounded-3xl bg-sky-100 p-5 md:p-8">
      <div class="grid items-center gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div class="space-y-4">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-sky-700">{{ $t('site.brand') }}</p>
          <h1 class="text-5xl font-extrabold uppercase leading-[0.9] text-sky-400 md:text-7xl">Every Smile <span class="text-sky-500">Matters</span></h1>
          <div class="max-w-sm rounded-2xl bg-white p-4 text-sm shadow">
            Our skilled dentists use advanced technology to offer complete care in a comfortable and friendly clinic.
          </div>
          <NuxtLink to="/contact" class="btn rounded-full border-none bg-orange-500 text-white hover:bg-orange-600">Book Appointment ↗</NuxtLink>
        </div>

        <div class="grid items-center gap-4 sm:grid-cols-[1fr_auto] lg:grid-cols-1">
          <div class="relative mx-auto flex aspect-[4/5] w-full max-w-sm items-end justify-center overflow-hidden rounded-[2rem] bg-white">
            <img
              src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80"
              alt="Tooth"
              class="h-full w-full object-cover"
            >
          </div>

          <div class="space-y-2">
            <div v-for="(item, idx) in highlights" :key="item.key" class="rounded-2xl bg-white p-3 text-sm shadow">
              <p class="text-xl font-extrabold text-orange-500">{{ idx + 1 }}0+</p>
              <p class="font-semibold">{{ item.key }}</p>
              <p class="opacity-70">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="overflow-hidden border-y border-base-300 bg-base-100 py-3">
      <div class="denti-marquee-track flex min-w-max gap-8 text-3xl">
        <template v-for="i in 2" :key="`row-${i}`">
          <div v-for="tag in tags" :key="`${i}-${tag}`" class="flex items-center gap-4">
            <span>{{ tag }}</span><span>+</span>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
