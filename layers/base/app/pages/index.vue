<script setup lang="ts">
import type { HomeBuilder, HomeSectionItem } from '~~/layers/base/types/page-builder'
import { defaultHomeBuilder } from '~~/layers/base/utils/page-builder'

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

const { data } = await useFetch<HomeBuilder>('/api/home-builder/public', {
  default: () => structuredClone(defaultHomeBuilder),
})

const builder = computed(() => data.value ?? structuredClone(defaultHomeBuilder))
const layoutOverrides = useLayoutOverrides()

const sectionComponentName = (section: string) => defaultSection[section]

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
      :is="sectionComponentName(section.uid)"
      :key="section.uid"
    />
  </div>
</template>
