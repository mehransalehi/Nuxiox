<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })
useHead({ title: 'Admin Blog Comments' })

const { data, refresh } = await useFetch('/api/admin/blog/comments', { default: () => [] as any[] })

const updateStatus = async (id: number, status: 'approved' | 'rejected' | 'pending') => {
  await $fetch(`/api/admin/blog/comments/${id}`, { method: 'PUT', body: { status } })
  await refresh()
}

const clearLikes = async (id: number) => {
  await $fetch(`/api/admin/blog/comments/${id}/likes`, { method: 'DELETE' })
  await refresh()
}

const removeComment = async (id: number) => {
  await $fetch(`/api/admin/blog/comments/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Blog Comment & Like Management</h2>
    <div class="overflow-x-auto card bg-base-100 shadow">
      <table class="table">
        <thead>
          <tr>
            <th>Post</th>
            <th>Author</th>
            <th>Content</th>
            <th>Status</th>
            <th>Likes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in data" :key="comment.id">
            <td>{{ comment.postTitle }}</td>
            <td>{{ comment.authorName }}</td>
            <td class="max-w-xs truncate">{{ comment.content }}</td>
            <td><span class="badge">{{ comment.status }}</span></td>
            <td>{{ comment.likeCount }}</td>
            <td class="space-x-2 whitespace-nowrap">
              <button class="btn btn-xs btn-success" @click="updateStatus(comment.id, 'approved')">Approve</button>
              <button class="btn btn-xs btn-error" @click="updateStatus(comment.id, 'rejected')">Reject</button>
              <button class="btn btn-xs" @click="updateStatus(comment.id, 'pending')">Pending</button>
              <button class="btn btn-xs btn-warning" @click="clearLikes(comment.id)">Clear likes</button>
              <button class="btn btn-xs btn-error" @click="removeComment(comment.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
