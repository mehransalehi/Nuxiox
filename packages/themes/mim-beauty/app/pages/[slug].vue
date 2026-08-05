<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DecorativeBg from '../components/ui/DecorativeBg.vue'
import Hero from '../components/sections/Hero.vue'
import Promotions from '../components/sections/Promotions.vue'
import About from '../components/sections/About.vue'
import Services from '../components/sections/Services.vue'
import Hours from '../components/sections/Hours.vue'
import Portfolio from '../components/sections/Portfolio.vue'
import Testimonial from '../components/sections/Testimonial.vue'
import Contact from '../components/sections/Contact.vue'
import Team from '../components/sections/Team.vue'
import Blog from '../components/sections/Blog.vue'
import Results from '../components/sections/Results.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

interface PageBlock {
  uid: string
  type: 'text' | 'section' | 'navbar' | 'footer'
  content?: string
  sectionId?: string
}

interface CMSPage {
  id: number
  title: string
  slug: string
  builder: {
    blocks: PageBlock[]
  }
}

const page = ref<CMSPage | null>(null)
const isLoading = ref(true)

const sectionComponentMap: Record<string, any> = {
  Hero,
  Service: Services,
  Services,
  Promotions,
  About,
  Testimonial,
  Team,
  Blog,
  Contact,
  Hours,
  Portfolio,
  Results
}

async function fetchPage() {
  isLoading.value = true
  try {
    const res = await $fetch<CMSPage>(`/api/pages/public/${slug.value}`)
    if (res) {
      page.value = res
    }
  } catch (e) {
    page.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPage()
})
</script>

<template>
  <div class="w-full bg-[#FAF8F5] min-h-screen pt-28 pb-24 relative overflow-hidden">
    <!-- Decorative background lamps, bulbs, and grid overlay -->
    <DecorativeBg />

    <div class="relative z-10">
      <div v-if="isLoading" class="py-24 text-center text-stone-500 font-sans text-sm">
        <i class="fa-solid fa-spinner animate-spin text-xl mb-2 block text-[#C5A059]"></i>
        <span>در حال بارگذاری...</span>
      </div>

      <template v-else-if="page && page.builder && page.builder.blocks">
        <template v-for="block in page.builder.blocks" :key="block.uid">
          <div v-if="block.type === 'text'" class="max-w-4xl mx-auto px-6 py-8 card-light-journal rounded-2xl my-6" v-html="block.content" />
          <component
            v-else-if="block.sectionId && sectionComponentMap[block.sectionId]"
            :is="sectionComponentMap[block.sectionId]"
          />
        </template>
      </template>

      <div v-else class="max-w-3xl mx-auto px-6 py-24 text-center space-y-4">
        <h1 class="text-3xl font-extrabold text-[#222222] font-sans">{{ $t('cms.notFound') }}</h1>
        <NuxtLink :to="$localePath('/')" class="btn-gold-dark inline-block px-8 py-3 rounded-xl text-xs font-bold">
          {{ $t('nav.home') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
