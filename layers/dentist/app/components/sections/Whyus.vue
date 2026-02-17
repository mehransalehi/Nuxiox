<script setup lang="ts">
const items = [
  { icon: 'fa-solid fa-user-doctor', title: 'Professional Dentists', text: 'Highly skilled specialists focused on comfort and precision.' },
  { icon: 'fa-solid fa-microscope', title: 'Modern Technology', text: 'Latest tools and diagnostics for accurate treatment plans.' },
  { icon: 'fa-solid fa-shield-heart', title: 'Safe Procedures', text: 'Strict hygiene standards and patient-first treatment workflow.' },
  { icon: 'fa-solid fa-hand-holding-heart', title: 'Patient Support', text: 'Friendly care team guiding your treatment every step.' }
]
</script>


<template>
  <section class="bg-neutral py-20 text-white">
    <div class="mx-auto max-w-6xl px-6 text-center">
      <UiTopTitle class="text-base-300!">why choose us</UiTopTitle>
      <UiTitle class="text-white!">What Makes Us Different</UiTitle>
      <div class="mt-12 grid gap-8 md:grid-cols-4">
        <div v-for="item in items" :key="item.title" data-animate
        class="p-2 group">
          <div class="mx-auto mb-4 flex h-16 aspect-square items-center justify-center rounded-xl glass text-secondary group-hover:scale-110 transition-all">
            <i :class="item.icon" class="text-2xl"></i>
          </div>
          <h3 class="text-base font-semibold">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-300">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

