<script setup lang="ts">
const { data } = await useFetch('/api/testimonials/public', { default: () => [] as any[] })
const testimonials = [
  {
    quote: 'Truly an outstanding service from start to finish. The staff are warm, patient, and very professional.',
    name: 'Mia Jacob',
    role: 'Product Designer',
    avatar: 'https://i.pravatar.cc/80?img=12'
  },
  {
    quote: 'The clinic is beautiful and the doctors explained everything clearly. My treatment was painless and quick.',
    name: 'Ethan Harper',
    role: 'Software Engineer',
    avatar: 'https://i.pravatar.cc/80?img=33'
  }
]

const activeIndex = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % testimonials.length
  }, 3500)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <!-- <section class="space-y-6 scroll-reveal">
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
  </section> -->


  <section class="bg-white py-20">
    <div class="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
      <img data-animate src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80" class="rounded-2xl shadow-soft" alt="Customer review">
      <div data-animate>
        <p class="text-xs font-bold uppercase tracking-[0.28em] text-primary">testimonials</p>
        <h2 class="mt-2 text-4xl font-extrabold text-slate-800">What Customers Say</h2>

        <Transition name="fade-up" mode="out-in">
          <div :key="activeIndex" class="mt-4">
            <p class="text-sm leading-7">{{ testimonials[activeIndex].quote }}</p>
            <div class="rating mt-4">
              <i v-for="n in 5" :key="n" class="fa-solid fa-star text-amber-400"></i>
            </div>
            <div class="mt-3 flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 rounded-full"><img :src="testimonials[activeIndex].avatar" alt="avatar"></div>
              </div>
              <div>
                <p class="text-sm font-bold">{{ testimonials[activeIndex].name }}</p>
                <p class="text-xs">{{ testimonials[activeIndex].role }}</p>
              </div>
            </div>
          </div>
        </Transition>

        <div class="mt-6 flex gap-2">
          <button
            v-for="(_, idx) in testimonials"
            :key="idx"
            class="h-2.5 w-7 rounded-full transition-all"
            :class="idx === activeIndex ? 'bg-primary' : 'bg-slate-300'"
            @click="activeIndex = idx"
          />
        </div>
      </div>
    </div>
  </section>
</template>
