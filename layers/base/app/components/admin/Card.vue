<script setup lang="ts">

const { title, subtitle } = defineProps({
  title: String,
  subtitle: String,
})
</script>
<template>
  <section class="card bg-base-100 shadow">
    <div class="card-body space-y-4">
      <div>
        <h3 class="card-title">{{ title }}</h3>
        <p class="text-sm opacity-70" v-if="subtitle">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>