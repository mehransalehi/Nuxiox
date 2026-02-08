<script setup lang="ts">
import type { HomeBuilder, HomeSectionItem } from '~~/layers/base/types/page-builder'
import { defaultHomeBuilder } from '~~/layers/base/utils/page-builder'

const { data } = await useFetch<HomeBuilder>('/api/home-builder/public', {
  default: () => structuredClone(defaultHomeBuilder),
})

const builder = computed(() => data.value ?? structuredClone(defaultHomeBuilder))
const layoutOverrides = useLayoutOverrides()

const sectionComponentName = (section: HomeSectionItem) => `Sections${section.sectionId}`

watch(
  () => builder.value.sections,
  (sections) => {
    layoutOverrides.value.hideNavbar = sections.some((section) => section.type === 'navbar')
    layoutOverrides.value.hideFooter = sections.some((section) => section.type === 'footer')
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  layoutOverrides.value.hideNavbar = false
  layoutOverrides.value.hideFooter = false
})
</script>

<template>
  <div class="space-y-8">
    <component
      v-for="section in builder.sections"
      :is="sectionComponentName(section)"
      :key="section.uid"
    />
  </div>
</template>
