<script setup lang="ts">
const { data } = await useFetch('/api/testimonials/public', { default: () => [] as any[] })
</script>

<template>
  <section class="space-y-6 scroll-reveal">
    <div class="rounded-3xl bg-sky-100 p-6 md:p-8">
      <div class="grid items-center gap-4 md:grid-cols-[1fr_260px]">
        <div>
          <h2 class="text-4xl font-bold">Book <span class="text-sky-500">Free Consultation</span></h2>
          <NuxtLink to="/contact" class="btn mt-4 rounded-full border-none bg-orange-500 text-white hover:bg-orange-600">Book now ↗</NuxtLink>
        </div>
        <img
          class="mx-auto h-40 w-40 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1522844990619-4951c40f7eda?auto=format&fit=crop&w=400&q=80"
          alt="consultation"
        >
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in data" :key="item.id" class="rounded-2xl bg-base-100 p-5 shadow">
        <p class="mb-3 text-lg">“{{ item.content }}”</p>
        <p class="font-semibold text-sky-600">{{ item.name }}</p>
        <p class="text-sm opacity-70">{{ item.role }}</p>
      </article>
    </div>
  </section>
</template>
