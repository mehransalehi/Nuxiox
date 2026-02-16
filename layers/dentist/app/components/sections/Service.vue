<script setup lang="ts">
const { data } = await useFetch('/api/services/public', { default: () => [] as any[] })
const services = [
  { title: 'Teeth Whitening', description: 'Safe whitening sessions for brighter confidence.', image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80' },
  { title: 'Teeth Checkup', description: 'Routine checkups to maintain oral health.', image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=800&q=80' },
  { title: 'Dental Implant', description: 'Advanced implant procedures by experts.', image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80' }
]
</script>

<template>
  <!-- <section class="space-y-6 scroll-reveal">
    <div class="grid gap-3 md:grid-cols-2 md:items-end">
      <div>
        <p class="text-4xl text-base-content/50">Available</p>
        <h2 class="text-5xl font-bold">Treatments</h2>
      </div>
      <p class="text-sm opacity-80">At Denta Care, we offer a wide range of treatments, from routine cleaning and checkups to advanced procedures.</p>
    </div>

    <div class="carousel carousel-center w-full gap-4 rounded-box pb-2">
      <article
        v-for="item in data"
        :key="item.id"
        class="carousel-item w-[260px] flex-col justify-between rounded-3xl border border-base-200 bg-base-100 p-4 shadow-sm"
      >
        <div>
          <h3 class="text-2xl font-semibold">{{ item.title }}</h3>
          <ul v-if="item.extra?.length" class="my-3 flex flex-wrap gap-2">
            <li v-for="(entry, index) in item.extra" :key="`${item.id}-${index}`" class="badge badge-outline">{{ entry.key }}</li>
          </ul>
          <p class="line-clamp-3 text-sm opacity-70">{{ item.description }}</p>
        </div>
        <img
          class="mt-4 h-36 w-full rounded-2xl object-cover"
          src="https://images.unsplash.com/photo-1609207825181-52d3214556dd?auto=format&fit=crop&w=700&q=80"
          alt="treatment"
        >
      </article>
    </div>
  </section> -->

   <section class="bg-[#f9fafb] py-20">
    <div class="mx-auto max-w-6xl px-6">
      <div class="text-center" data-animate>
        <p class="text-xs font-bold uppercase tracking-[0.28em] text-primary">What we offer</p>
        <h2 class="mt-2 text-4xl font-extrabold text-slate-800">Our Dental Services</h2>
      </div>
      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <div v-for="service in services" :key="service.title" class="card card-hover bg-white transition-all duration-300" data-animate>
          <figure class="card-image-zoom relative">
            <img :src="service.image" :alt="service.title" class="h-44 w-full object-cover">
            <span class="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-md"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
          </figure>
          <div class="card-body">
            <h3 class="card-title">{{ service.title }}</h3>
            <p class="text-sm">{{ service.description }}</p>
            <a class="text-primary text-sm font-semibold">Read More →</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
