<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.modules.contactMessages') }))
const { data, refresh } = await useFetch('/api/admin/contact-messages', { default: () => [] as any[] })
const remove = async (id: number) => { await $fetch(`/api/admin/contact-messages/${id}`, { method: 'DELETE' }); await refresh() }
</script>
<template>
  <section class="card bg-base-100 shadow"><div class="card-body"><h2 class="card-title">{{ $t('admin.modules.contactMessages') }}</h2>
    <div class="space-y-2"><div v-for="item in data" :key="item.id" class="rounded border p-3"><div class="flex items-center justify-between"><p class="font-semibold">{{ item.name }} ({{ item.email }})</p><button class="btn btn-xs btn-error" @click="remove(item.id)">{{ $t('common.delete') }}</button></div><p class="opacity-70">{{ item.subject }}</p><p>{{ item.message }}</p></div></div>
  </div></section>
</template>
