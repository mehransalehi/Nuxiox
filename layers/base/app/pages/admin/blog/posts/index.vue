<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })
useHead({ title: 'Admin Blog Posts' })
const { data, refresh } = await useFetch('/api/admin/blog/posts', { default: () => [] as any[] })

const removePost = async (id: number) => {
  await $fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Blog Posts</h2>
      <NuxtLink class="btn btn-primary" to="/admin/blog/posts/new">Create post</NuxtLink>
    </div>

    <div class="card bg-base-100 shadow overflow-x-auto"><table class="table">
      <thead><tr><th>Title</th><th>Status</th><th>Comments</th><th>Allow Comments</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td>{{ row.title }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.commentsCount }}</td>
          <td>{{ row.allowComments ? 'Yes' : 'No' }}</td>
          <td class="space-x-2">
            <NuxtLink class="btn btn-xs" :to="`/admin/blog/posts/${row.id}`">Edit</NuxtLink>
            <button class="btn btn-xs btn-error" @click="removePost(row.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table></div>
  </div>
</template>
