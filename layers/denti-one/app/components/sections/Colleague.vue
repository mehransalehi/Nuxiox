<script setup lang="ts">
const { data } = await useFetch('/api/colleagues/public', { default: () => [] as any[] })

const members = computed(() => data.value?.length
  ? data.value
  : [
      { id: 'c1', title: 'Dr. Elina Rose', description: 'Cosmetic Dentist' },
      { id: 'c2', title: 'Dr. Sami Noor', description: 'Orthodontist' },
      { id: 'c3', title: 'Dr. Mina Patel', description: 'Pediatric Dentist' },
    ])
</script>

<template>
  <section class="space-y-6 scroll-reveal">
    <div class="grid gap-3 md:grid-cols-2 md:items-end">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">Doctors</p>
        <h2 class="text-4xl font-extrabold md:text-5xl">Meet our expert dental team</h2>
      </div>
      <p class="text-sm opacity-80">A multidisciplinary team focused on comfort, communication, and long-term oral health outcomes.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="member in members" :key="member.id" class="rounded-3xl bg-[#f1f8ff] p-4">
        <img class="h-72 w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=80" alt="Dentist profile">
        <h3 class="mt-3 text-lg font-bold text-sky-700">{{ member.title }}</h3>
        <p class="text-sm opacity-75">{{ member.description }}</p>
      </article>
    </div>
  </section>
</template>
