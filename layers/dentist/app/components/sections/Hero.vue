<script setup lang="ts">
const { settings } = useSiteSettings()
const { t } = useI18n()

const highlights = computed(() => settings.value.navbar.info?.slice(0, 3) ?? [])
const tags = ['Braces', 'Denta Care', 'Dentist', 'Dentures', 'Invisalign', 'Teeth Cleaning']
</script>

<template>
  <!-- <section class="space-y-4 scroll-reveal">
    <div class="rounded-3xl bg-sky-100 p-5 md:p-8">
      <div class="grid items-center gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div class="space-y-4">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-sky-700">{{ t('site.brand') }}</p>
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
</section> -->



  <section class="bg-linear-to-br from-[#b9f3e8] via-[#8ae6d7] to-[#5ad9c8]">
    <div class="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 pb-10 pt-28 md:grid-cols-2 md:items-center ">
      <div data-animate>
        <p class="text-xs font-bold uppercase tracking-[0.28em] text-primary">we care for your smile</p>
        <h1 class="mt-3 text-5xl font-black leading-tight text-slate-900 md:text-6xl">Making Better<br>Smile.</h1>
        <p class="mt-5 max-w-md text-sm text-slate-700">
          Experience world-class dentistry and friendly care designed to keep your confidence bright and healthy.
        </p>
        <div class="mt-7 flex gap-3">
          <button
            class="btn btn-neutral rounded-full text-white hover-float shadow hover:shadow-xl scale-100 hover:scale-105 transition-all py-6 px-8">Book
            An Appointment</button>
          <button
            class="btn rounded-full shadow hover:shadow-xl scale-100 hover:scale-105 transition-all py-6 px-8">Learn
            More</button>
        </div>
        <div class="stats mt-8 bg-transparent shadow-none overflow-hidden">
          <div class="stat px-4 hover:scale-110 hover:rotate-1 transition-all">
            <div class="stat-title text-slate-800 text-3xl font-bold">15k+</div>
            <div class="stat-desc">Happy Patients</div>
          </div>
          <div class="stat px-4 hover:scale-110 hover:rotate-1 transition-all">
            <div class="stat-title text-slate-800 text-3xl font-bold">20+</div>
            <div class="stat-desc">Years Experience</div>
          </div>
          <div class="stat px-4 hover:scale-110 hover:rotate-1 transition-all">
            <div class="stat-title text-slate-800 text-3xl font-bold">98%</div>
            <div class="stat-desc">Positive Feedback</div>
          </div>
        </div>
      </div>

      <div class="relative" data-animate>
        <NuxtImg class="h-full aspect-[1.2/1.5] rounded-2xl object-cover shadow-soft hover-float shadow-xl hover:rotate-2 transition-all -rotate-2"
          src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80"
          alt="Dental consultation" />
        <div
          class="glass absolute -bottom-5 -left-6 rounded-2xl text-xs font-semibold h-20 p-4 flex justify-center items-center hover:scale-110 transition-all">
          <div class=" bg-primary/10 aspect-square h-10 me-2 flex justify-center items-center rounded-full text-2xl">
            <i class="fa-solid fa-tooth text-primary"></i>
          </div>
          We care for
          your smile
        </div>
      </div>
    </div>
  </section>
</template>
