<script setup lang="ts">
const { data } = await useFetch<any>('/api/blog/posts')
const posts = computed(() => data.value?.items ?? [])
const categories = computed(() => data.value?.categories ?? [])

const searchQuery = ref('')
const selectedCategory = ref('ALL')

const filteredPosts = computed(() => {
  return posts.value.filter((post: any) => {
    const matchesSearch = !searchQuery.value
      || post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      || (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesCategory = selectedCategory.value === 'ALL' || post.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})
const categorySlugs = computed(
  () => new Map((categories.value ?? []).map((c: any) => [c.name, c.slug]))
)
</script>

<template>
  <div class="py-24">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl sm:text-6xl font-bold">{{ $t('blog.title') }}</h1>
        <p class="text-sm mt-2">{{ $t('blog.subtitle') }}</p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4 max-w-3xl mx-auto">
        <input v-model="searchQuery" :placeholder="$t('blog.searchPlaceholder')" class="w-full input input-bordered" />
        <select v-model="selectedCategory" class="select select-bordered">
          <option value="ALL">{{ $t('blog.allCategories') }}</option>
          <option v-for="c in categories" :key="c.slug" :value="c.name">{{ c.name }}</option>
        </select>
      </div>

      <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article v-for="post in filteredPosts" :key="post.id" class="card">
          <img v-if="post.featuredImage" :src="post.featuredImage" :alt="post.title" class="w-full h-52 object-cover" />
          <div class="p-6">
            <h2 class="text-lg font-bold">{{ post.title }}</h2>
            <p v-if="post.excerpt" class="text-sm mt-2">{{ post.excerpt }}</p>
            <NuxtLink :to="$localePath(`/blog/${post.slug}`)" class="btn btn-sm btn-primary mt-4">
              {{ $t('blog.readMore') }}
            </NuxtLink>
          </div>
        </article>
      </div>
      <div v-else class="text-center py-16">{{ $t('blog.notFound') }}</div>
    </div>
  </div>
</template>
