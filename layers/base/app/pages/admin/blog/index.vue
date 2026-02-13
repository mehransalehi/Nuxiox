<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })
const { t } = useI18n()
useHead(() => ({ title: t('admin.blog.title') }))
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">{{ t('admin.blog.title') }}</h2>
    <div class="grid gap-4 md:grid-cols-3">
      <NuxtLink to="/admin/blog/categories" class="card bg-base-100 shadow hover:shadow-md transition">
        <div class="card-body"><h3 class="card-title">{{ t('admin.blog.categories') }}</h3><p>{{ t('admin.blog.categoriesDesc') }}</p></div>
      </NuxtLink>
      <NuxtLink to="/admin/blog/posts" class="card bg-base-100 shadow hover:shadow-md transition">
        <div class="card-body"><h3 class="card-title">{{ t('admin.blog.posts') }}</h3><p>{{ t('admin.blog.postsDesc') }}</p></div>
      </NuxtLink>
      <NuxtLink to="/admin/blog/comments" class="card bg-base-100 shadow hover:shadow-md transition">
        <div class="card-body"><h3 class="card-title">{{ t('admin.blog.comments') }}</h3><p>{{ t('admin.blog.commentsDesc') }}</p></div>
      </NuxtLink>
    </div>
  </div>
</template>
