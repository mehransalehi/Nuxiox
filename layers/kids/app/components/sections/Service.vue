<script setup lang="ts">
const { data } = await useFetch('/api/services/public', { default: () => [] as any[] })
const services = [
  { title: '🩺 General Checkup', description: 'Regular health checkups to track your child\'s growth and development.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80' },
  { title: '💉 Vaccinations', description: 'Safe and gentle immunization following the national schedule.', image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=800&q=80' },
  { title: '🦷 Dental Care', description: 'Pediatric dental checkups with a focus on prevention and comfort.', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80' },
  { title: '🤧 Allergy Care', description: 'Testing and treatment for common childhood allergies.', image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80' },
  { title: '🧠 Developmental Screening', description: 'Early detection of developmental delays and milestones.', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80' },
  { title: '🏥 Emergency Care', description: 'Same-day appointments for fevers, injuries, and urgent concerns.', image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80' },
]
</script>

<template>
  <section class="relative py-20 md:py-28" style="background: var(--kids-bg-alt);">
    <div class="mx-auto max-w-6xl px-6">
      <div class="text-center mb-16" data-reveal>
        <span class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);">
          🏥 Our Services
        </span>
        <h2 class="font-fredoka text-4xl md:text-5xl font-bold mb-4" style="color: var(--kids-text);">
          Complete Care for<br>Every Stage
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--kids-text-muted);">
          From newborn checkups to teen health, we offer comprehensive pediatric services.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(service, i) in services"
          :key="service.title"
          class="clay-card !rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500"
          :style="{ transitionDelay: `${i * 60}ms` }"
          data-reveal
        >
          <div class="relative h-44 overflow-hidden">
            <NuxtImg
              :src="service.image"
              :alt="service.title"
              class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div class="p-6">
            <div class="text-2xl mb-2">{{ service.title.split(' ')[0] }}</div>
            <h3 class="font-fredoka text-lg font-bold mb-2" style="color: var(--kids-text);">
              {{ service.title }}
            </h3>
            <p class="text-sm leading-relaxed" style="color: var(--kids-text-muted);">
              {{ service.description }}
            </p>
            <NuxtLink
              to="/contact"
              class="inline-flex items-center gap-2 mt-4 text-sm font-semibold transition-all hover:gap-3"
              style="color: var(--kids-primary);"
            >
              Learn More <span>→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>