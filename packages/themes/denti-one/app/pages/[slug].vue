<script setup lang="ts">
import type { PageRecord, PageBlock } from '~~/packages/base/types/page-builder'

const modules = import.meta.glob('../components/sections/*.vue')
const components: Record<string, Component> = {}

for (const path in modules) {
  const loader = modules[path]
  if (!loader) continue

  const fileName = path.split('/').pop()
  if (!fileName) continue

  const name = fileName.replace('.vue', '')
  components[name] = defineAsyncComponent(() => loader().then((m:any) => m.default))
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, error } = await useFetch<PageRecord>(`/api/pages/public/${slug.value}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

const page = computed(() => {
  const raw = data.value
  if (!raw) return null
  const parsed = structuredClone(raw) as unknown as PageRecord['pages_locales'] & { pages: PageRecord['pages'] }
  if (typeof parsed.builder === 'string') {
    try {
      const b = JSON.parse(parsed.builder)
      if (typeof b === 'object' && b !== null) {
        ;(parsed as Record<string, unknown>).builder = b
      } else {
        ;(parsed as Record<string, unknown>).builder = { version: 1, blocks: [] }
      }
    } catch {
      ;(parsed as Record<string, unknown>).builder = { version: 1, blocks: [] }
    }
  }
  if (typeof parsed.seo === 'string') {
    try {
      const s = JSON.parse(parsed.seo)
      if (typeof s === 'object' && s !== null) {
        ;(parsed as Record<string, unknown>).seo = s
      } else {
        ;(parsed as Record<string, unknown>).seo = {}
      }
    } catch {
      ;(parsed as Record<string, unknown>).seo = {}
    }
  }
  return parsed as unknown as PageRecord
})
const layoutOverrides = useLayoutOverrides()
const { settings } = useSiteSettings()

const sectionComponentName = (block: Extract<PageBlock, { type: 'section' | 'navbar' | 'footer' }>) => components[block.sectionId]

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
    meta: [
      typeof seo.description === 'string' ? { name: 'description', content: seo.description } : { name: 'description', content: settings.value.seo.defaultDescription },
      { property: 'og:title', content: String(seo.ogTitle ?? seo.title ?? page.value?.title ?? settings.value.seo.defaultTitle) },
      { property: 'og:description', content: String(seo.ogDescription ?? seo.description ?? settings.value.seo.defaultDescription) },
      { property: 'og:image', content: String(seo.ogImage ?? settings.value.seo.defaultOgImage ?? '') },
    ].filter((item) => item && item.content),
  }
})
</script>

<template>
  <div v-if="page" class="space-y-10">
    <template v-for="block in page.builder.blocks" :key="block.uid">
      <div v-if="block.type === 'text'" class="prose max-w-none" v-html="block.content" />
      <component v-else :is="sectionComponentName(block)" />
    </template>
  </div>
</template>
