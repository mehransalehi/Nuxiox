<script setup lang="ts">
const { data } = await useFetch('/api/testimonials/public', { default: () => [] as any[] })

const testimonials = [
  {
    quote: 'The team is incredible with kids. My daughter used to be terrified of doctors — now she asks when we can go back!',
    name: 'Sarah Mitchell',
    child: 'Mom of Lily, 4',
    avatar: 'https://i.pravatar.cc/80?img=32',
    rating: 5,
  },
  {
    quote: 'From the waiting room toys to the gentle exams, every detail is designed for children. We drive 30 minutes just to come here.',
    name: 'David Chen',
    child: 'Dad of Noah, 6',
    avatar: 'https://i.pravatar.cc/80?img=11',
    rating: 5,
  },
  {
    quote: 'Dr. Martinez explained everything in terms my son could understand. He left with a sticker and a big smile. Couldn\'t ask for better care.',
    name: 'Amara Okafor',
    child: 'Mom of Kai, 3',
    avatar: 'https://i.pravatar.cc/80?img=44',
    rating: 5,
  },
  {
    quote: 'I was so nervous about my baby\'s first shots. The nurses were so patient and caring — they made the whole family feel at ease.',
    name: 'Jessica Park',
    child: 'Mom of Emma, 1',
    avatar: 'https://i.pravatar.cc/80?img=9',
    rating: 5,
  },
  {
    quote: 'Our pediatrician remembered my son\'s favorite dinosaur and incorporated it into the checkup. That personal touch means everything.',
    name: 'Marcus Williams',
    child: 'Dad of Leo, 5',
    avatar: 'https://i.pravatar.cc/80?img=53',
    rating: 5,
  },
]

const activeIndex = ref(0)

const nextTestimonial = () => {
  activeIndex.value = (activeIndex.value + 1) % testimonials.length
}

const prevTestimonial = () => {
  activeIndex.value = (activeIndex.value - 1 + testimonials.length) % testimonials.length
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % testimonials.length
  }, 5000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden"
    style="background: linear-gradient(180deg, var(--kids-bg-alt) 0%, var(--kids-bg) 50%, white 100%);">
    
    <!-- Decorative blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none dots-pattern opacity-20" />
    <div class="absolute top-10 right-10 w-36 h-36 rounded-full" style="background: var(--pastel-pink); filter: blur(60px); opacity: 0.2; animation: blobFloat 8s ease-in-out infinite;" />
    <div class="absolute bottom-20 left-10 w-48 h-48 rounded-full" style="background: var(--pastel-lavender); filter: blur(70px); opacity: 0.2; animation: blobFloat 12s ease-in-out infinite 2s;" />
    <div class="absolute top-1/2 right-1/4 w-24 h-24 rounded-full" style="background: var(--pastel-yellow); filter: blur(50px); opacity: 0.2; animation: blobFloat 9s ease-in-out infinite 4s;" />

    <div class="relative z-10 mx-auto max-w-6xl px-6">
      <!-- Header -->
      <div class="text-center mb-16" data-reveal>
        <span class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);">
          💬 Happy Families
        </span>
        <h2 class="font-fredoka text-4xl md:text-5xl font-bold mb-4" style="color: var(--kids-text);">
          What Parents<br>Are Saying
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--kids-text-muted);">
          Real stories from families who trust us with their children's health and happiness.
        </p>
      </div>

      <!-- Two-column layout: Featured testimonial + Card grid -->
      <div class="grid gap-8 lg:grid-cols-5 items-start">
        <!-- Left: Featured testimonial (3/5 width) -->
        <div class="lg:col-span-3" data-reveal>
          <div class="relative clay-card !rounded-3xl !p-8 md:!p-12 min-h-[360px]"
            style="background: white;">
            <!-- Floating decorative elements -->
            <div class="absolute -top-4 -right-4 w-16 h-16 flex items-center justify-center rounded-2xl text-2xl float-anim"
              style="background: var(--pastel-yellow); color: var(--kids-accent);">
              ⭐
            </div>
            <div class="absolute -bottom-3 -left-3 w-12 h-12 flex items-center justify-center rounded-xl text-lg float-anim-delayed"
              style="background: var(--pastel-mint); color: var(--kids-primary);">
              💚
            </div>

            <!-- Quote icon -->
            <div class="text-5xl mb-6" style="color: var(--kids-primary); opacity: 0.15;">
              💬
            </div>

            <!-- Quote text -->
            <div class="relative min-h-[120px]">
              <transition name="fade-slide" mode="out-in">
                <p :key="activeIndex" class="text-xl md:text-2xl leading-relaxed font-medium" style="color: var(--kids-text);">
                  "{{ testimonials[activeIndex].quote }}"
                </p>
              </transition>
            </div>

            <!-- Star rating -->
            <div class="mt-6 flex gap-1.5">
              <span v-for="n in 5" :key="n" class="text-xl transition-all"
                :class="n <= testimonials[activeIndex].rating ? 'bounce-in' : 'opacity-20'"
                :style="{ animationDelay: `${n * 80}ms` }"
                style="color: var(--kids-accent);">
                ⭐
              </span>
            </div>

            <!-- Author info -->
            <div class="mt-6 flex items-center gap-4">
              <div class="clay-card !rounded-full overflow-hidden w-14 h-14 shrink-0 !p-0 !border-2"
                style="border-color: var(--kids-primary);">
                <NuxtImg
                  :src="testimonials[activeIndex].avatar"
                  :alt="testimonials[activeIndex].name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <p class="font-fredoka font-bold text-lg" style="color: var(--kids-text);">
                  {{ testimonials[activeIndex].name }}
                </p>
                <p class="text-sm font-semibold" style="color: var(--kids-primary-light);">
                  {{ testimonials[activeIndex].child }}
                </p>
              </div>
            </div>

            <!-- Navigation controls -->
            <div class="mt-8 flex items-center justify-between">
              <div class="flex gap-2">
                <button
                  v-for="(_, idx) in testimonials"
                  :key="idx"
                  class="h-2.5 rounded-full transition-all duration-500 cursor-pointer"
                  :class="idx === activeIndex ? 'w-8' : 'w-2.5'"
                  :style="{
                    background: idx === activeIndex ? 'var(--kids-primary)' : 'var(--kids-border)',
                  }"
                  @click="activeIndex = idx"
                />
              </div>
              <div class="flex gap-2">
                <button
                  class="clay-card !rounded-full !w-10 !h-10 !p-0 flex items-center justify-center text-lg hover:scale-110 transition-all cursor-pointer"
                  style="background: white; color: var(--kids-primary);"
                  @click="prevTestimonial"
                >
                  ←
                </button>
                <button
                  class="clay-card !rounded-full !w-10 !h-10 !p-0 flex items-center justify-center text-lg hover:scale-110 transition-all cursor-pointer"
                  style="background: var(--kids-primary); color: white;"
                  @click="nextTestimonial"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Stat cards + mini testimonials (2/5 width) -->
        <div class="lg:col-span-2 space-y-5" data-reveal>
          <!-- Stats card -->
          <div class="clay-card !rounded-2xl !p-6 text-center"
            style="background: linear-gradient(135deg, var(--kids-primary) 0%, var(--kids-primary-dark) 100%);">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <div class="font-fredoka text-3xl font-bold text-white">5k+</div>
                <div class="text-xs text-white/80 mt-1">Reviews</div>
              </div>
              <div>
                <div class="font-fredoka text-3xl font-bold text-white">4.9</div>
                <div class="text-xs text-white/80 mt-1">Rating</div>
              </div>
              <div>
                <div class="font-fredoka text-3xl font-bold text-white">98%</div>
                <div class="text-xs text-white/80 mt-1">Recommend</div>
              </div>
            </div>
          </div>

          <!-- Mini testimonial cards -->
          <div
            v-for="(t, i) in testimonials.slice(0, 2)"
            :key="t.name"
            class="clay-card !rounded-2xl !p-5 flex items-start gap-3 hover:-translate-x-1 transition-all duration-300 cursor-default"
            :style="{
              background: 'white',
              transitionDelay: `${i * 100}ms`,
              borderLeft: `4px solid var(--kids-primary)`,
            }"
          >
            <div class="text-lg mt-0.5">👶</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm leading-relaxed italic" style="color: var(--kids-text);">
                "{{ t.quote.slice(0, 60) }}…"
              </p>
              <div class="flex items-center gap-1.5 mt-2">
                <span class="text-xs">⭐</span>
                <span class="text-xs font-semibold" style="color: var(--kids-text-muted);">
                  {{ t.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <NuxtLink
            to="/contact"
            class="clay-btn clay-btn-accent w-full justify-center text-base mt-2"
          >
            <span>Share Your Story</span>
            <span>💬</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Fade + slide transition for testimonial quote */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>