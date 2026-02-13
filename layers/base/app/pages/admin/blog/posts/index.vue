<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })
const { t } = useI18n()
useHead(() => ({ title: t('admin.blog.posts') }))

const { data, refresh } = await useFetch('/api/admin/blog/posts', { default: () => [] as any[] })

const removePost = async (id: number) => {
  await $fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">{{ t('admin.blog.posts') }}</h2>
      <NuxtLink class="btn btn-primary" to="/admin/blog/posts/new">{{ t('admin.blog.createPost') }}</NuxtLink>
    </div>

    <div class="card bg-base-100 shadow overflow-x-auto"><table class="table">
      <thead><tr><th>{{ t('common.title') }}</th><th>{{ t('common.status') }}</th><th>{{ t('admin.blog.comments') }}</th><th>{{ t('admin.blog.allowComments') }}</th><th>{{ t('common.actions') }}</th></tr></thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td>{{ row.title }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.commentsCount }}</td>
          <td>{{ row.allowComments ? t('common.yes') : t('common.no') }}</td>
          <td class="space-x-2">
            <NuxtLink class="btn btn-xs" :to="`/admin/blog/posts/${row.id}`">{{ t('common.edit') }}</NuxtLink>
            <button class="btn btn-xs btn-error" @click="removePost(row.id)">{{ t('common.delete') }}</button>
          </td>
        </tr>
      </tbody>
    </table></div>
  </div>
</template>
