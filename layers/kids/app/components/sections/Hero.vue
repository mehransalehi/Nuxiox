<script setup lang="ts">
const { settings } = useSiteSettings()

const highlights = computed(() => settings.value.navbar.info?.slice(0, 3) ?? [])

const stats = [
  { value: '15k+', label: 'Happy Kids' },
  { value: '20+', label: 'Years Caring' },
  { value: '98%', label: 'Happy Parents' },
]

const heroCard = ref<HTMLElement | null>(null)
useParallax3D(heroCard, 6)
</script>

<template>
  <section class="relative min-h-screen flex items-center overflow-hidden pt-24"
    style="background: linear-gradient(160deg, var(--kids-bg) 0%, var(--kids-bg-alt) 50%, #ffffff 100%);">
    
    <!-- Decorative floating elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none dots-pattern opacity-30" />
    <div class="absolute top-20 right-10 w-32 h-32 rounded-full" style="background: var(--pastel-pink); filter: blur(50px); opacity: 0.3; animation: blobFloat 8s ease-in-out infinite;" />
    <div class="absolute bottom-20 left-10 w-40 h-40 rounded-full" style="background: var(--pastel-blue); filter: blur(60px); opacity: 0.25; animation: blobFloat 10s ease-in-out infinite 2s;" />
    <div class="absolute top-1/3 left-1/4 w-20 h-20 rounded-full" style="background: var(--pastel-yellow); filter: blur(40px); opacity: 0.3; animation: blobFloat 7s ease-in-out infinite 1s;" />

    <div class="relative z-10 mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div class="grid items-center gap-12 md:grid-cols-2">
        <!-- Left: Content -->
        <div data-reveal>
          <div class="inline-flex items-center gap-2 clay-card !rounded-full !px-4 !py-2 text-sm font-semibold mb-6"
            style="background: white; color: var(--kids-primary-dark);">
            <span class="text-lg">👶</span>
            <span>{{ $t('site.brand') || 'Pediatric Care' }}</span>
            <span class="w-2 h-2 rounded-full" style="background: var(--kids-accent); animation: pulse 2s infinite;" />
          </div>

          <h1 class="font-fredoka text-5xl md:text-7xl leading-tight font-bold mb-6"
            style="color: var(--kids-text);">
            Caring for
            <span style="color: var(--kids-primary);">Little Smiles</span>
            <br>Every Step
          </h1>

          <p class="text-lg mb-8 max-w-md leading-relaxed" style="color: var(--kids-text-muted);">
            We make doctor visits fun and friendly. Expert pediatricians, a warm environment, and gentle care your child will love.
          </p>

          <div class="flex flex-wrap gap-4">
            <NuxtLink to="/contact" class="clay-btn clay-btn-accent text-base px-8 py-4">
              <span>Book an Appointment</span>
              <span class="text-xl bounce-in" style="animation-delay: 1s;">→</span>
            </NuxtLink>
            <NuxtLink to="/about" class="clay-btn clay-btn-outline text-base px-8 py-4">
              <span>Meet Our Team</span>
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div class="flex gap-8 mt-12">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <div class="font-fredoka text-3xl font-bold" style="color: var(--kids-primary);">
                {{ stat.value }}
              </div>
              <div class="text-xs font-semibold mt-1" style="color: var(--kids-text-muted);">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: 3D Clay Card Image -->
        <div class="flex justify-center md:justify-end" data-reveal data-reveal-delay="200">
          <div
            ref="heroCard"
            class="relative w-full max-w-md aspect-[4/5] clay-card !rounded-[32px] overflow-hidden group cursor-pointer"
            style="transform-style: preserve-3d;"
          >
            <NuxtImg
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80"
              alt="Happy child at doctor"
              class="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            <!-- Floating badge -->
            <div class="absolute -bottom-3 -left-3 clay-card !rounded-2xl !p-4 flex items-center gap-3 float-anim"
              style="background: white;">
              <div class="text-2xl">🩺</div>
              <div>
                <div class="font-fredoka text-sm font-bold" style="color: var(--kids-text);">Gentle Care</div>
                <div class="text-xs" style="color: var(--kids-text-muted);">100% kid-friendly</div>
              </div>
            </div>
            <!-- Top right badge -->
            <div class="absolute top-4 right-4 clay-card !rounded-full !px-4 !py-2 text-sm font-semibold float-anim-delayed"
              style="background: white; color: var(--kids-accent); animation-delay: -2s;">
              ⭐ 4.9 Rating
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>