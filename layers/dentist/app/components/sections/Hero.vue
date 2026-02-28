<script setup lang="ts">
const { settings } = useSiteSettings()


const highlights = computed(() => settings.value.navbar.info?.slice(0, 3) ?? [])
</script>

<template>
  <section class="bg-linear-to-t from-primary/60 via-primary/30 to-primary/10">
    <div class="mx-auto grid min-h-screen max-w-6xl px-6 pt-28 md:grid-cols-2 md:items-center relative overflow-hidden">
      <div class="w-full">
        <UiTopTitle>{{ $t('site.topslang') }}</UiTopTitle>
        <h1 class="mt-3 text-4xl font-black leading-tight text-slate-900 md:text-6xl">{{ $t('site.slang') }}</h1>
        <p class="mt-5 max-w-md text-sm text-slate-700">
          {{ $t('site.subslang') }}
        </p>
        <div class="mt-7 flex gap-3 flex-col md:flex-row">
          <UiButton class="btn-neutral md:w-auto w-2/3">{{ $t('buttons.appointment') }}</UiButton>
          <UiButton class="md:w-auto w-2/3">{{ $t('buttons.learnmore') }}</UiButton>
        </div>
        <div class="stats mt-8 bg-transparent shadow-none overflow-hidden">
          <div class="stat px-4 hover:scale-110 hover:rotate-1 transition-all">
            <div class="stat-title text-slate-800 md:text-3xl text-xl font-bold">{{ $t('hero.info1.value') }}</div>
            <div class="stat-desc">{{ $t('hero.info1.key') }}</div>
          </div>
          <div class="stat px-4 hover:scale-110 hover:rotate-1 transition-all">
            <div class="stat-title text-slate-800 md:text-3xl text-xl font-bold">{{ $t('hero.info2.value') }}</div>
            <div class="stat-desc">{{ $t('hero.info2.key') }}</div>
          </div>
          <div class="stat px-4 hover:scale-110 hover:rotate-1 transition-all">
            <div class="stat-title text-slate-800 md:text-3xl text-xl font-bold">{{ $t('hero.info3.value') }}</div>
            <div class="stat-desc">{{ $t('hero.info3.key') }}</div>
          </div>
        </div>
      </div>

      <div class="relative" data-animate>
        <NuxtImg class="md:h-full md:aspect-[1.2/1.5] rounded-2xl object-cover shadow-soft hover-float shadow-xl hover:rotate-2 transition-all md:-rotate-2"
          src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80"
          alt="Dental consultation" />
        <div
          class="glass absolute -bottom-5 md:-left-6 left-6 rounded-2xl text-xs font-semibold h-20 p-4 flex justify-center items-center hover:scale-110 transition-all">
          <div class=" bg-primary/10 aspect-square h-10 me-2 flex justify-center items-center rounded-full text-2xl">
            <i class="fa-solid fa-tooth text-primary"></i>
          </div>
          {{ $t('site.topslang') }}
        </div>
      </div>
    </div>
  </section>
</template>
