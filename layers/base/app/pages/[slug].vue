<script setup lang="ts">
import type { PageRecord, PageBlock } from '~~/layers/base/types/page-builder'

//import default sections
import Hero from '../components/sections/Hero.vue'
import About from '../components/sections/About.vue'
import Service from '../components/sections/Service.vue'
import Testimonial from '../components/sections/Testimonial.vue'
import Contact from '../components/sections/Contact.vue'

const defaultSection = {
  hero : Hero,
  about : About,
  service : Service,
  testimonial : Testimonial,
  contact : Contact
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, error } = await useFetch<PageRecord>(`/api/pages/public/${slug.value}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const page = computed(() => data.value as PageRecord)
const layoutOverrides = useLayoutOverrides()
const { settings } = useSiteSettings()

const sectionComponentName = (block: Extract<PageBlock, { type: 'section' | 'navbar' | 'footer' }>) =>
  defaultSection[block.sectionId.toLowerCase()]

watch(
  () => page.value?.builder?.blocks ?? [],
  (blocks) => {
    layoutOverrides.value.hideNavbar = blocks.some((block) => block.type === 'navbar')
    layoutOverrides.value.hideFooter = blocks.some((block) => block.type === 'footer')
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  layoutOverrides.value.hideNavbar = false
  layoutOverrides.value.hideFooter = false
})

useHead(() => {
  const seo = (page.value?.seo ?? {}) as Record<string, unknown>
  return {
    title: typeof seo.title === 'string' ? seo.title : page.value?.title || settings.value.seo.defaultTitle,
    link: [
      typeof seo.canonical === 'string' && seo.canonical ? { rel: 'canonical', href: seo.canonical } : undefined,
    ].filter(Boolean),
    meta: [
      typeof seo.description === 'string' ? { name: 'description', content: seo.description } : { name: 'description', content: settings.value.seo.defaultDescription },
      { property: 'og:title', content: String(seo.ogTitle ?? seo.title ?? page.value?.title ?? settings.value.seo.defaultTitle) },
      { property: 'og:description', content: String(seo.ogDescription ?? seo.description ?? settings.value.seo.defaultDescription) },
      { property: 'og:image', content: String(seo.ogImage ?? settings.value.seo.defaultOgImage ?? '') },
      { name: 'robots', content: String(seo.robots ?? settings.value.seo.robots) },
    ].filter((item) => item && item.content),
  }
})
</script>

<template>
  <div class="space-y-8">
    <template v-for="block in page.builder.blocks" :key="block.uid">
      <div v-if="block.type === 'text'" class="prose max-w-none" v-html="block.content" />
      <component v-else :is="sectionComponentName(block)" />
    </template>
  </div>
</template>
