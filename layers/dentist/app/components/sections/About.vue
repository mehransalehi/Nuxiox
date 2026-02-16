<script setup lang="ts">
const { settings } = useSiteSettings()
const { t } = useI18n()
const aboutInfo = computed(() => settings.value.about?.info ?? [])

const visionSlides = computed(() =>
(aboutInfo.value.length ? aboutInfo.value : [
  { key: 'Our Vision', value: 'Create a welcoming smile with personalized treatment.' },
  { key: 'Modern Clinic', value: 'Advanced tools and clean spaces for comfortable visits.' },
  { key: 'Friendly Team', value: 'Supportive experts focused on long-term oral health.' },
])
)
</script>

<template>
  <!-- <section class="space-y-6 scroll-reveal">
    <div class="grid gap-4 md:grid-cols-2 md:items-start">
      <div>
        <p class="text-4xl text-base-content/50">About</p>
        <h2 class="text-5xl font-bold">Denta Care</h2>
      </div>
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-orange-500">Our Vision</p>
        <p class="text-sm opacity-80">At Denta Care, our vision is to blend advanced technology with compassionate care.</p>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
      <div class="grid gap-3 sm:grid-cols-2">
        <img class="h-44 w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80" alt="clinic one">
        <img class="h-44 w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=80" alt="clinic two">
        <img class="h-44 w-full rounded-2xl object-cover sm:col-span-2" src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1000&q=80" alt="patient smile">
      </div>

      <div class="rounded-3xl bg-base-200/70 p-4">
        <div class="carousel w-full rounded-2xl">
          <article v-for="(slide, index) in visionSlides" :id="`vision-${index}`" :key="`vision-${index}`" class="carousel-item w-full flex-col gap-3 rounded-2xl bg-base-100 p-5">
            <span class="badge badge-outline">{{ slide.key }}</span>
            <p class="text-lg font-semibold">{{ slide.value }}</p>
            <div class="mt-2 flex justify-end gap-2">
              <a :href="`#vision-${(index - 1 + visionSlides.length) % visionSlides.length}`" class="btn btn-xs btn-circle">❮</a>
              <a :href="`#vision-${(index + 1) % visionSlides.length}`" class="btn btn-xs btn-circle">❯</a>
            </div>
          </article>
        </div>
      </div>
    </div>

    <p class="hidden">{{ t('sections.about.title') }}</p>
  </section> -->

  <section class="bg-white">
    <div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center px-6 py-20">
      <div class="relative" data-animate>
        <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
          class="w-full rounded-2xl object-cover shadow-soft" alt="Dental office">
        <div class="badge badge-primary absolute bottom-4 left-4 p-4 text-white">20+ Years Expertise</div>
      </div>
      <div data-animate>
        <p class="text-xs font-bold uppercase tracking-[0.28em] text-primary">our promise</p>
        <h2 class="text-4xl font-extrabold text-slate-800">A Perfect Smile Guaranteed</h2>
        <p class="mt-4 text-sm leading-7">We combine preventive care, diagnostics and modern technology to bring safe
          and effective treatment plans for every patient.</p>
        <ul class="mt-5 space-y-3 text-sm">
          <li class="flex items-center gap-3"><span
              class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary"><i
                class="fa-solid fa-check"></i></span> Gentle treatment procedures</li>
          <li class="flex items-center gap-3"><span
              class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary"><i
                class="fa-solid fa-check"></i></span> Board certified specialists</li>
          <li class="flex items-center gap-3"><span
              class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary"><i
                class="fa-solid fa-check"></i></span> Transparent treatment plans</li>
        </ul>
        <button class="btn btn-neutral mt-6 rounded-full text-white hover-float">Learn More</button>
      </div>
    </div>
  </section>
</template>
