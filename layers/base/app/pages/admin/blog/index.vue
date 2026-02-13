<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Blog Management</h2>
    <div class="grid gap-4 md:grid-cols-3">
      <NuxtLink to="/admin/blog/categories" class="card bg-base-100 shadow hover:shadow-md transition">
        <div class="card-body"><h3 class="card-title">Categories</h3><p>Manage blog categories.</p></div>
      </NuxtLink>
      <NuxtLink to="/admin/blog/posts" class="card bg-base-100 shadow hover:shadow-md transition">
        <div class="card-body"><h3 class="card-title">Posts</h3><p>Create, edit and remove blog posts.</p></div>
      </NuxtLink>
      <NuxtLink to="/admin/blog/comments" class="card bg-base-100 shadow hover:shadow-md transition">
        <div class="card-body"><h3 class="card-title">Comments & Likes</h3><p>Moderate comments and manage likes.</p></div>
      </NuxtLink>
    </div>
  </div>
</template>
