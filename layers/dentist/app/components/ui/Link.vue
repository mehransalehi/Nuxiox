<script lang="ts" setup>
    const { toLink } = defineProps<{
        toLink : string
    }>()
</script>
<template>
    <NuxtLink  :to="toLink" class="relative nav-link text-sm text-base-content/70 after:content-[''] after:absolute after:left-0 after:-bottom-2 
          after:h-0.5 after:w-0 after:bg-blue-500 
          after:transition-all after:duration-300 
          hover:after:w-full"><slot />
          </NuxtLink>
</template>