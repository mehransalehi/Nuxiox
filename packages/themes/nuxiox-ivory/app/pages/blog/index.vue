<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, Filter, Calendar, ArrowRight, BookOpen } from 'lucide-vue-next';

interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  categories?: { id: number; name: string; slug: string }[];
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const route = useRoute();
const router = useRouter();

const search = ref(String(route.query.search || ''));
const category = ref(String(route.query.category || ''));
const sort = ref(String(route.query.sort || 'newest'));
const page = ref(Number(route.query.page || 1));
const pageSize = 6;

const posts = ref<BlogPostItem[]>([]);
const categories = ref<CategoryItem[]>([]);
const totalPages = ref(1);
const totalPosts = ref(0);
const isLoading = ref(true);

const fetchPosts = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams({
      page: String(page.value),
      pageSize: String(pageSize),
      sort: sort.value,
    });
    if (search.value) params.append('search', search.value);
    if (category.value) params.append('category', category.value);

    const res = await fetch(`/api/blog/posts?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      posts.value = data.items || [];
      categories.value = data.categories || [];
      totalPages.value = data.totalPages || 1;
      totalPosts.value = data.total || 0;
    }
  } catch (e) {
    console.error('Failed to load blog posts', e);
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = async () => {
  page.value = 1;
  router.replace({
    query: {
      ...(search.value ? { search: search.value } : {}),
      ...(category.value ? { category: category.value } : {}),
      sort: sort.value,
      page: '1'
    }
  });
  await fetchPosts();
};

const setPage = async (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
  router.replace({
    query: {
      ...(search.value ? { search: search.value } : {}),
      ...(category.value ? { category: category.value } : {}),
      sort: sort.value,
      page: String(newPage)
    }
  });
  await fetchPosts();
};

onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <div class="py-16 bg-white dark:bg-slate-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
      
      <!-- Page Header -->
      <div class="space-y-4 text-center max-w-3xl mx-auto">
        <span class="text-xs font-bold tracking-widest text-[#00C4DF] uppercase">Dental Knowledge Base</span>
        <h1 class="text-4xl sm:text-5xl font-light text-slate-900 dark:text-white leading-tight">
          {{ $t('blog.pageTitle') }}
        </h1>
        <p class="text-sm text-slate-500">
          Expert guides, surgical insights, and teeth whitening tips written by our specialist implantologists.
        </p>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <!-- Search Input -->
          <div class="md:col-span-5 relative">
            <Search class="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input 
              v-model="search"
              @keyup.enter="applyFilters"
              type="text"
              :placeholder="$t('blog.search')"
              class="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#00C4DF]"
            />
          </div>

          <!-- Category Dropdown -->
          <div class="md:col-span-4">
            <select 
              v-model="category"
              @change="applyFilters"
              class="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#00C4DF]"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                {{ cat.name }} ({{ cat.count }})
              </option>
            </select>
          </div>

          <!-- Sort Dropdown -->
          <div class="md:col-span-3">
            <select 
              v-model="sort"
              @change="applyFilters"
              class="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#00C4DF]"
            >
              <option value="newest">{{ $t('blog.newest') }}</option>
              <option value="oldest">{{ $t('blog.oldest') }}</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20 text-slate-500">
        {{ $t('blog.loading') }}
      </div>

      <!-- Empty State -->
      <div v-else-if="posts.length === 0" class="text-center py-20 space-y-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800">
        <BookOpen class="w-12 h-12 text-slate-400 mx-auto" />
        <p class="text-slate-600 dark:text-slate-300 font-medium">{{ $t('blog.noPosts') }}</p>
      </div>

      <!-- Articles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-transform"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img 
              :src="post.featuredImage" 
              :alt="post.title"
              class="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            <div v-if="post.categories?.length" class="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-white text-[11px] font-mono backdrop-blur">
              {{ post.categories[0].name }}
            </div>
          </div>

          <div class="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5 text-[#00C4DF]" />
                {{ new Date(post.publishedAt || Date.now()).toLocaleDateString() }}
              </span>

              <h2 class="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                {{ post.title }}
              </h2>

              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                {{ post.excerpt }}
              </p>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
              <router-link 
                :to="`/blog/${post.slug}`"
                class="inline-flex items-center gap-2 text-xs font-bold text-[#00C4DF] hover:underline"
              >
                <span>{{ $t('blog.readMore') }}</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </router-link>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination Bar -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 pt-8">
        <button 
          @click="setPage(page - 1)" 
          :disabled="page <= 1"
          class="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {{ $t('blog.prev') }}
        </button>

        <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Page {{ page }} of {{ totalPages }}
        </span>

        <button 
          @click="setPage(page + 1)" 
          :disabled="page >= totalPages"
          class="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {{ $t('blog.next') }}
        </button>
      </div>

    </div>
  </div>
</template>
