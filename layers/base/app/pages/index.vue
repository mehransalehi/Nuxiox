<script setup lang="ts">
import type { HomeBuilder, HomeSectionItem } from '~~/layers/base/types/page-builder'
import { defaultHomeBuilder } from '~~/layers/base/utils/page-builder'

const modules = import.meta.glob('../components/sections/*.vue')
const components: Record<string, Component> = {}

for (const path in modules) {
  const loader = modules[path]
  if (!loader) continue

  const fileName = path.split('/').pop()
  if (!fileName) continue

  const name = fileName.replace('.vue', '')

  components[name] = defineAsyncComponent(() =>
    loader().then((m:any) => m.default)
  )
}

const { data } = await useFetch<HomeBuilder>('/api/home-builder/public', {
  default: () => structuredClone(defaultHomeBuilder),
})
const builder = computed(() => data.value ?? structuredClone(defaultHomeBuilder))
const layoutOverrides = useLayoutOverrides()

const sectionComponentName = (section: string) => components[section]

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
      :is="sectionComponentName(section.sectionId)"
      :key="section.uid"
    />

  </div>
</template>
