<script setup lang="ts">
useHead({ title: 'Blog' })

const route = useRoute()
const router = useRouter()

const search = ref(String(route.query.search ?? ''))
const category = ref(String(route.query.category ?? ''))
const sort = ref(String(route.query.sort ?? 'newest'))
const page = ref(Number(route.query.page ?? 1))
const pageSize = 6

const query = computed(() => ({
  search: search.value || undefined,
  category: category.value || undefined,
  sort: sort.value,
  page: page.value,
  pageSize,
}))

const { data, refresh, pending } = await useFetch('/api/blog/posts', { query })

const applyFilters = async () => {
  page.value = 1
  await router.replace({ query: { ...query.value, page: 1 } })
  await refresh()
}

const setPage = async (next: number) => {
  if (!data.value) return
  if (next < 1 || next > data.value.totalPages) return
  page.value = next
  await router.replace({ query: { ...query.value, page: next } })
  await refresh()
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[1fr_320px]">
    <section class="space-y-5">
      <header class="rounded-3xl bg-sky-100 p-6">
        <h1 class="text-4xl font-extrabold">Dental Blog</h1>
        <p class="opacity-70">Discover practical tips, treatment insights, and oral care advice from our experts.</p>
      </header>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="join">
          <button class="join-item btn" :class="{ 'btn-active': sort === 'newest' }" @click="sort='newest'; applyFilters()">Newest</button>
          <button class="join-item btn" :class="{ 'btn-active': sort === 'oldest' }" @click="sort='oldest'; applyFilters()">Oldest</button>
          <button class="join-item btn" :class="{ 'btn-active': sort === 'title' }" @click="sort='title'; applyFilters()">Title</button>
        </div>
      </div>

      <div v-if="pending" class="skeleton h-60 w-full" />

      <div class="grid gap-4 md:grid-cols-2" v-else>
        <article v-for="post in data?.items || []" :key="post.id" class="overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm">
          <figure class="h-44 bg-sky-50">
            <img v-if="post.featuredImage" :src="post.featuredImage" :alt="post.title" class="h-full w-full object-cover" loading="lazy">
            <div v-else class="flex h-full items-center justify-center text-6xl">🦷</div>
          </figure>
          <div class="space-y-3 p-5">
            <h2 class="line-clamp-2 text-xl font-bold">{{ post.title }}</h2>
            <p class="line-clamp-3 text-sm opacity-70">{{ post.excerpt }}</p>
            <NuxtLink :to="`/blog/${post.slug}`" class="btn btn-sm rounded-full border-none bg-sky-500 text-white hover:bg-sky-600">Read more</NuxtLink>
          </div>
        </article>
      </div>

      <div class="join" v-if="(data?.totalPages || 0) > 1">
        <button class="join-item btn" @click="setPage(page - 1)">Prev</button>
        <button class="join-item btn btn-active">{{ page }}</button>
        <button class="join-item btn" @click="setPage(page + 1)">Next</button>
      </div>
    </section>

    <aside class="space-y-4">
      <div class="rounded-3xl border border-base-200 bg-base-100 p-4 shadow-sm">
        <h3 class="mb-2 font-semibold">Search</h3>
        <input v-model="search" type="text" class="input input-bordered w-full rounded-full" placeholder="Search posts..." @keyup.enter="applyFilters">
        <button class="btn btn-sm mt-3" @click="applyFilters">Apply</button>
      </div>

      <div class="rounded-3xl border border-base-200 bg-base-100 p-4 shadow-sm">
        <h3 class="mb-2 font-semibold">Categories</h3>
        <button class="btn btn-ghost mb-1 w-full justify-start" :class="{ 'btn-active': !category }" @click="category = ''; applyFilters()">All</button>
        <button v-for="item in data?.categories || []" :key="item.id" class="btn btn-ghost mb-1 w-full justify-start" :class="{ 'btn-active': category === item.slug }" @click="category = item.slug; applyFilters()">
          {{ item.name }} ({{ item.count }})
        </button>
      </div>
    </aside>
  </div>
</template>
