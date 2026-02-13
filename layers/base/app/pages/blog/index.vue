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
  <div class="grid gap-8 lg:grid-cols-[1fr_300px]">
    <section class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-3xl font-bold">Blog</h1>
        <select v-model="sort" class="select select-bordered" @change="applyFilters">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div v-if="pending" class="alert">Loading...</div>

      <div class="grid gap-4 md:grid-cols-2" v-else>
        <article v-for="post in data?.items || []" :key="post.id" class="card bg-base-100 shadow">
          <figure v-if="post.featuredImage"><img :src="post.featuredImage" :alt="post.title" class="h-48 w-full object-cover" loading="lazy"></figure>
          <div class="card-body">
            <h2 class="card-title">{{ post.title }}</h2>
            <p class="opacity-70">{{ post.excerpt }}</p>
            <NuxtLink :to="`/blog/${post.slug}`" class="btn btn-primary btn-sm w-fit">Read more</NuxtLink>
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
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h3 class="card-title text-lg">Search</h3>
          <input v-model="search" type="text" class="input input-bordered" placeholder="Search posts..." @keyup.enter="applyFilters">
          <button class="btn btn-sm" @click="applyFilters">Apply</button>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h3 class="card-title text-lg">Categories</h3>
          <button class="btn btn-ghost justify-start" :class="{ 'btn-active': !category }" @click="category = ''; applyFilters()">All</button>
          <button
            v-for="item in data?.categories || []"
            :key="item.id"
            class="btn btn-ghost justify-start"
            :class="{ 'btn-active': category === item.slug }"
            @click="category = item.slug; applyFilters()"
          >
            {{ item.name }} ({{ item.count }})
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
