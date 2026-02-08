<script setup lang="ts">
import type { PageRecord, PageBlock } from '~~/layers/base/types/page-builder'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, error } = await useFetch<PageRecord>(`/api/pages/public/${slug.value}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const page = computed(() => data.value as PageRecord)
const layoutOverrides = useLayoutOverrides()

const sectionComponentName = (block: Extract<PageBlock, { type: 'section' | 'navbar' | 'footer' }>) =>
  `Sections${block.sectionId}`

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
    title: typeof seo.title === 'string' ? seo.title : page.value?.title,
    meta: [
      typeof seo.description === 'string'
        ? { name: 'description', content: seo.description }
        : undefined,
    ].filter(Boolean),
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
