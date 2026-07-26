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
  <div class="grid gap-8 lg:grid-cols-[1fr_320px] pt-24 pb-12 px-6 max-w-6xl mx-auto">
    <section class="space-y-6">
      <!-- Header -->
      <div data-reveal class="clay-card !rounded-[24px] !p-8" style="background: white;">
        <span class="inline-block clay-card !rounded-full !px-4 !py-1 text-sm font-semibold mb-3"
          style="background: var(--kids-bg-alt); color: var(--kids-primary-dark);">
          📝 Our Blog
        </span>
        <h1 class="font-fredoka text-4xl font-bold" style="color: var(--kids-text);">Kids Health Blog</h1>
        <p class="mt-2" style="color: var(--kids-text-muted);">Tips, guides, and expert advice for raising happy, healthy children.</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex gap-2">
          <button class="clay-btn !rounded-full !py-1 !px-4 text-sm" :class="{ 'clay-btn-accent': sort === 'newest', 'clay-btn-outline': sort !== 'newest' }" @click="sort='newest'; applyFilters()">Newest</button>
          <button class="clay-btn !rounded-full !py-1 !px-4 text-sm" :class="{ 'clay-btn-accent': sort === 'oldest', 'clay-btn-outline': sort !== 'oldest' }" @click="sort='oldest'; applyFilters()">Oldest</button>
          <button class="clay-btn !rounded-full !py-1 !px-4 text-sm" :class="{ 'clay-btn-accent': sort === 'title', 'clay-btn-outline': sort !== 'title' }" @click="sort='title'; applyFilters()">Title</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="skeleton h-60 w-full rounded-2xl" />

      <!-- Posts Grid -->
      <div class="grid gap-6 md:grid-cols-2" v-else>
        <article
          v-for="post in data?.items || []"
          :key="post.id"
          class="clay-card !rounded-[20px] overflow-hidden group hover:-translate-y-2 transition-all duration-500"
          data-reveal
        >
          <figure class="h-44 overflow-hidden" style="background: var(--kids-bg-alt);">
            <img
              v-if="post.featuredImage"
              :src="post.featuredImage"
              :alt="post.title"
              class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
              loading="lazy"
            >
            <div v-else class="flex h-full items-center justify-center text-5xl">📖</div>
          </figure>
          <div class="p-5 space-y-3">
            <h2 class="font-fredoka text-lg font-bold line-clamp-2" style="color: var(--kids-text);">
              {{ post.title }}
            </h2>
            <p class="text-sm line-clamp-3" style="color: var(--kids-text-muted);">{{ post.excerpt }}</p>
            <NuxtLink
              :to="$localePath(`/blog/${post.slug}`)"
              class="inline-flex items-center gap-2 clay-btn clay-btn-accent text-sm !py-2 !px-5"
            >
              Read More <span>→</span>
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div class="flex gap-2" v-if="(data?.totalPages || 0) > 1">
        <button class="clay-btn !rounded-full !py-1 !px-4 text-sm" :class="{ 'clay-btn-outline': page > 1 }" :disabled="page <= 1" @click="setPage(page - 1)">← Prev</button>
        <button
          v-for="p in data?.totalPages || 0"
          :key="p"
          class="clay-btn !rounded-full !w-10 !h-10 !p-0 flex items-center justify-center text-sm"
          :class="{ 'clay-btn-accent': p === page, 'clay-btn-outline': p !== page }"
          @click="setPage(p)"
        >
          {{ p }}
        </button>
        <button class="clay-btn !rounded-full !py-1 !px-4 text-sm" :class="{ 'clay-btn-outline': page < (data?.totalPages || 0) }" :disabled="page >= (data?.totalPages || 0)" @click="setPage(page + 1)">Next →</button>
      </div>
    </section>

    <!-- Sidebar -->
    <aside class="space-y-4" data-reveal>
      <div class="clay-card !rounded-[20px] !p-5" style="background: white;">
        <h3 class="font-fredoka font-bold mb-3" style="color: var(--kids-text);">🔍 Search</h3>
        <input v-model="search" type="text" class="w-full rounded-xl border-2 !outline-none px-4 py-2 text-sm" style="border-color: var(--kids-border); background: var(--kids-bg);" placeholder="Search posts..." @keyup.enter="applyFilters">
        <button class="clay-btn clay-btn-accent text-sm w-full mt-3 !py-2" @click="applyFilters">Search</button>
      </div>

      <div class="clay-card !rounded-[20px] !p-5" style="background: white;">
        <h3 class="font-fredoka font-bold mb-3" style="color: var(--kids-text);">📂 Categories</h3>
        <button
          class="block w-full text-left clay-card !rounded-xl !p-2 text-sm mb-1 transition-all"
          :class="{ '!bg-[var(--kids-primary)] !text-white': !category }"
          @click="category = ''; applyFilters()"
        >All</button>
        <button
          v-for="item in data?.categories || []"
          :key="item.id"
          class="block w-full text-left clay-card !rounded-xl !p-2 text-sm mb-1 transition-all"
          :class="{ '!bg-[var(--kids-primary)] !text-white': category === item.slug }"
          @click="category = item.slug; applyFilters()"
        >
          {{ item.name }} ({{ item.count }})
        </button>
      </div>
    </aside>
  </div>
</template>