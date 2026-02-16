<template>
  <section class="bg-gradient-to-r from-[#0a1732] to-[#162b56] py-20 text-white">
    <div class="mx-auto max-w-6xl px-6 text-center">
      <p class="text-xs font-bold uppercase tracking-[0.28em] text-primary" data-animate>why choose us</p>
      <h2 class="mt-2 text-4xl font-extrabold" data-animate>What Makes Us Different</h2>
      <div class="mt-12 grid gap-8 md:grid-cols-4">
        <div v-for="item in items" :key="item.title" class="p-2" data-animate>
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-primary">
            <i :class="item.icon" class="text-lg"></i>
          </div>
          <h3 class="text-base font-semibold">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-300">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  { icon: 'fa-solid fa-user-doctor', title: 'Professional Dentists', text: 'Highly skilled specialists focused on comfort and precision.' },
  { icon: 'fa-solid fa-microscope', title: 'Modern Technology', text: 'Latest tools and diagnostics for accurate treatment plans.' },
  { icon: 'fa-solid fa-shield-heart', title: 'Safe Procedures', text: 'Strict hygiene standards and patient-first treatment workflow.' },
  { icon: 'fa-solid fa-hand-holding-heart', title: 'Patient Support', text: 'Friendly care team guiding your treatment every step.' }
]
</script>
