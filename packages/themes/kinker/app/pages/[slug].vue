<script setup lang="ts">
import type { PageBlock } from '~~/packages/base/types/page-builder'

const modules = import.meta.glob('../components/sections/*.vue')
const components: Record<string, Component> = {}

for (const path in modules) {
  const loader = modules[path]
  if (!loader) continue
  const fileName = path.split('/').pop()
  if (!fileName) continue
  const name = fileName.replace('.vue', '')
  components[name] = defineAsyncComponent(() => loader().then((m: any) => m.default))
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)

interface PageRecord {
  id: number
  title: string
  slug: string
  seo?: any
  builder: {
    version: number
    blocks: PageBlock[]
  }
}

const { data, error } = await useFetch<PageRecord>(() => `/api/pages/public/${slug.value}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

const page = computed(() => {
  const raw = data.value
  if (!raw) return null
  const parsed = structuredClone(raw) as any
  if (typeof parsed.builder === 'string') {
    try {
      const b = JSON.parse(parsed.builder)
      parsed.builder = typeof b === 'object' && b !== null ? b : { version: 1, blocks: [] }
    } catch { parsed.builder = { version: 1, blocks: [] } }
  }
  if (typeof parsed.seo === 'string') {
    try {
      const s = JSON.parse(parsed.seo)
      parsed.seo = typeof s === 'object' && s !== null ? s : {}
    } catch { parsed.seo = {} }
  }
  return parsed
})

const layoutOverrides = useLayoutOverrides()

watch(
  () => page.value?.builder?.blocks,
  (blocks) => {
    if (!blocks) return
    layoutOverrides.value.hideNavbar = blocks.some((b: any) => b.type === 'navbar')
    layoutOverrides.value.hideFooter = blocks.some((b: any) => b.type === 'footer')
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  layoutOverrides.value.hideNavbar = false
  layoutOverrides.value.hideFooter = false
})

useHead(() => {
  const seo = page.value?.seo || {}
  return {
    title: seo.title || page.value?.title || '',
    meta: [
      seo.description ? { name: 'description', content: seo.description } : undefined,
    ].filter(Boolean),
  }
})
</script>

<template>
  <div>
    <template v-if="page?.builder?.blocks">
      <template v-for="block in page.builder.blocks" :key="block.uid">
        <div v-if="block.type === 'text'" v-html="block.content" />
        <component v-else-if="block.sectionId && components[block.sectionId]" :is="components[block.sectionId]" />
      </template>
    </template>
    <div v-else class="py-24 text-center">
      <p>{{ $t('cms.notFound') }}</p>
    </div>
  </div>
</template>
