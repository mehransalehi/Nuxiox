<script setup lang="ts">
const { data } = await useFetch('/api/services/public', { default: () => [] as any[] })
</script>

<template>
  <section class="space-y-6 scroll-reveal">
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
  </section>
</template>
