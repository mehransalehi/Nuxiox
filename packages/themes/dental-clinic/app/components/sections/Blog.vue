<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BookOpen, Calendar, ArrowRight } from 'lucide-vue-next';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  createdAt: string;
}

const posts = ref<BlogPost[]>([]);
const loading = ref(true);

const fetchPosts = async () => {
  try {
    loading.value = true;
    const res = await fetch('/api/blog/posts/recent');
    if (res.ok) {
      posts.value = await res.json();
    }
  } catch (err) {
    console.error('Error fetching blog posts:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
});

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'Recent';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
</script>

<template>
  <section id="blog" class="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div class="space-y-3 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen class="w-4 h-4" />
            <span>Oral Health Education & Insights</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Latest Patient Guides & Dental Tips
          </h2>
          <p class="text-slate-600 dark:text-slate-300 text-base">
            Expert advice from our dentists on whitening safety, dental implants, Invisalign care, and preventing tooth decay.
          </p>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Blog Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="post in posts" 
          :key="post.id"
          class="group bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img 
                v-if="post.featuredImage" 
                :src="post.featuredImage" 
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute bottom-3 left-3 bg-slate-950/80 text-teal-300 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                <Calendar class="w-3.5 h-3.5 text-teal-400" />
                <span>{{ formatDate(post.publishedAt) }}</span>
              </div>
            </div>

            <div class="p-6 space-y-3">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                {{ post.title }}
              </h3>
              <p class="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-3">
                {{ post.excerpt }}
              </p>
            </div>
          </div>

          <div class="px-6 pb-6 pt-2">
            <a 
              :href="'/blog/' + post.slug"
              class="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs hover:gap-3 transition-all"
            >
              <span>Read Full Article</span>
              <ArrowRight class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
