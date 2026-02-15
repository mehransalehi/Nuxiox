<script setup lang="ts">
const { data } = await useFetch('/api/colleagues/public', { default: () => [] as any[] })
</script>

<template>
  <section class="space-y-6 scroll-reveal">
    <div class="grid gap-3 md:grid-cols-2 md:items-end">
      <div>
        <p class="text-4xl text-base-content/50">Our</p>
        <h2 class="text-5xl font-bold">Expert Team</h2>
      </div>
      <p class="text-sm opacity-80">The expert team at Denta Care is dedicated to providing personalized, comfortable care.</p>
    </div>

    <div class="carousel carousel-center w-full gap-4 rounded-box">
      <article v-for="item in data" :key="item.id" class="carousel-item w-[220px] rounded-3xl border border-base-200 bg-base-100 p-3 shadow-sm">
        <div class="w-full">
          <img
            class="h-64 w-full rounded-2xl object-cover"
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
            alt="doctor"
          >
          <h3 class="mt-3 text-lg font-bold text-sky-600">{{ item.title }}</h3>
          <p class="text-sm opacity-70">{{ item.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
