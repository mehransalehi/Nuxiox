<script setup lang="ts">
const { settings } = useSiteSettings()
const { t } = useI18n()
const heroRef = ref<HTMLElement | null>(null)
use3DTilt(heroRef, 4)
</script>

<template>
  <section class="relative min-h-screen flex items-center overflow-hidden" style="background: var(--d-dark-gradient);">
    <!-- Overlay gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/20 z-[1]" />

    <!-- Decorative lines -->
    <div class="absolute inset-0 z-[1] opacity-[0.03]"
      style="background-image: repeating-linear-gradient(90deg, transparent, transparent 40px, white 40px, white 41px);" />

    <div class="relative z-10 container-premium w-full pt-28 pb-20">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Text Content -->
        <div data-reveal>
          <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[var(--d-accent)]/30 text-xs font-semibold tracking-[0.15em] uppercase mb-8"
            style="color: var(--d-accent);">
            <span class="w-2 h-2 rounded-full" style="background: var(--d-accent);" />
            {{ $t('sections.hero.badge') }}
          </div>

          <h1 class="font-heading text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-[-0.05em] text-white mb-8">
            Your<br>
            <span class="gold-text">Smile</span><br>
            Our Passion
          </h1>

          <p class="text-lg max-w-md leading-relaxed mb-10" style="color: var(--d-text-light);">
            {{ $t('sections.hero.desc') }}
          </p>

          <div class="flex flex-wrap gap-4">
            <NuxtLink to="/contact" class="btn-gold">
              {{ $t('common.book') }} <span class="text-lg">→</span>
            </NuxtLink>
            <a href="#services" class="btn-outline !border-white/30 !text-white hover:!bg-white hover:!text-[var(--d-primary)]">
              {{ $t('common.learn') }}
            </a>
          </div>

          <!-- Stats bar -->
          <div class="flex gap-10 mt-16 pt-10 border-t border-white/10">
            <div v-for="s in [{n:'15+', l:'Years'},{n:'10k+', l:'Patients'},{n:'98%', l:'Satisfaction'}]" :key="s.l">
              <div class="font-heading text-2xl font-bold gold-text">{{ s.n }}</div>
              <div class="text-xs mt-1 tracking-wide" style="color: var(--d-text-light);">{{ s.l }}</div>
            </div>
          </div>
        </div>

        <!-- Right: 3D Card -->
        <div class="hidden lg:flex justify-center" data-reveal="right">
          <div ref="heroRef" class="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden group cursor-default"
            style="transition: transform 0.2s ease-out;">
            <NuxtImg
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
              alt="Dental clinic"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div class="absolute bottom-6 left-6 right-6">
              <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div class="w-10 h-10 rounded-full bg-[var(--d-accent)] flex items-center justify-center text-white font-bold text-lg">✧</div>
                <div>
                  <div class="text-white text-sm font-semibold">Premium Comfort</div>
                  <div class="text-white/60 text-xs">State-of-the-art facilities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="hidden lg:flex justify-center mt-16 animate-bounce">
        <svg class="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </section>
</template>