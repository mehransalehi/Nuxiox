<script setup lang="ts">
const techItems = [
  { num: '01', emoji: '🔬', title: 'Low-Radiation Digital X-Ray', desc: 'Safe, instant imaging with up to 80% less radiation — perfect for growing bodies.' },
  { num: '02', emoji: '🩻', title: 'Child-Sized Ultrasound', desc: 'Gentle, non-invasive scans with kid-friendly wands and warm gel for comfort.' },
  { num: '03', emoji: '🦷', title: 'Pain-Free Laser Dentistry', desc: 'No-drill cavity treatment with soft lasers — quiet, gentle, and anxiety-free.' },
  { num: '04', emoji: '🎮', title: 'VR Distraction Therapy', desc: 'Interactive VR goggles that transport kids to magical worlds during procedures.' },
  { num: '05', emoji: '📊', title: 'Digital Growth Tracking', desc: 'Smart AI-powered charts that monitor height, weight, and milestones over time.' },
]

const funFacts = [
  { emoji: '🦸', text: 'No scary needles — we use numbing gel first!' },
  { emoji: '🌈', text: 'Every room has a different fun theme' },
  { emoji: '🎁', text: 'Kids get a surprise after every visit' },
]
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden"
    style="background: linear-gradient(160deg, var(--kids-bg) 0%, #ffffff 50%, var(--kids-bg-alt) 100%);">

    <!-- Decorative blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
    </div>

    <div class="relative z-10 mx-auto max-w-6xl px-6">
      <!-- Header -->
      <div class="text-center mb-16" data-reveal>
        <span class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);">
          🚀 Our Technology
        </span>
        <h2 class="font-fredoka text-4xl md:text-5xl font-bold mb-4" style="color: var(--kids-text);">
          Gentle Tech for<br>Little Ones
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--kids-text-muted);">
          We use the latest pediatric-friendly equipment to make every visit safe, painless, and even fun.
        </p>
      </div>

      <div class="grid gap-10 md:grid-cols-2 items-start">
        <!-- Left: Tech Items -->
        <div class="space-y-4 stagger" data-reveal>
          <div
            v-for="(item, i) in techItems"
            :key="item.title"
            class="clay-card !rounded-2xl !p-5 flex items-start gap-4 group cursor-default transition-all duration-500 hover:-translate-y-1"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6"
              :style="{ background: 'var(--kids-bg)' }"
            >
              <span class="bounce-in" :style="{ animationDelay: `${i * 0.1 + 0.3}s` }">{{ item.emoji }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold tracking-widest" style="color: var(--kids-primary);">{{ item.num }}</span>
                <h3 class="font-fredoka font-bold text-base truncate" style="color: var(--kids-text);">{{ item.title }}</h3>
              </div>
              <p class="text-sm leading-relaxed" style="color: var(--kids-text-muted);">{{ item.desc }}</p>
            </div>
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
              :style="{ background: 'var(--kids-primary-light)', color: 'white' }"
            >
              <span class="text-sm">→</span>
            </div>
          </div>
        </div>

        <!-- Right: Image + Fun Facts -->
        <div class="space-y-6" data-reveal>
          <!-- Main image with clay card -->
          <div class="relative">
            <NuxtImg
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=900&q=80"
              alt="Child-friendly medical technology"
              class="w-full aspect-[4/3] object-cover clay-card !rounded-[28px] transition-all duration-700 hover:scale-[1.02]"
            />
            <!-- Floating badge -->
            <div class="absolute -bottom-4 -right-4 clay-card !rounded-2xl !p-4 float-anim"
              style="background: white;">
              <div class="flex items-center gap-3">
                <span class="text-3xl">🛡️</span>
                <div>
                  <div class="font-fredoka text-sm font-bold" style="color: var(--kids-text);">100% Safe</div>
                  <div class="text-xs" style="color: var(--kids-text-muted);">Pediatric certified</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fun fact cards -->
          <div class="grid gap-3">
            <div
              v-for="(fact, i) in funFacts"
              :key="fact.text"
              class="clay-card !rounded-xl !px-4 !py-3 flex items-center gap-3 transition-all duration-300 hover:translate-x-2 cursor-default"
              :style="{
                background: i === 0 ? 'var(--pastel-mint)' : i === 1 ? 'var(--pastel-yellow)' : 'var(--pastel-peach)',
                transitionDelay: `${i * 100}ms`
              }"
            >
              <span class="text-xl">{{ fact.emoji }}</span>
              <span class="text-sm font-semibold" style="color: var(--kids-text);">{{ fact.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
