<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ArrowRight, Calendar, Tag } from 'lucide-vue-next';

interface BlogPostPreview {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  categories?: { id: number; name: string; slug: string }[];
}

const recentPosts = ref<BlogPostPreview[]>([]);

onMounted(async () => {
  try {
    const res = await fetch('/api/blog/posts/recent');
    if (res.ok) {
      recentPosts.value = await res.json();
    }
  } catch (e) {
    console.error('Failed to load recent posts', e);
  }
});
</script>

<template>
  <section class="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-xs font-bold tracking-widest text-[#00C4DF] uppercase">Journal</span>
          <h2 class="text-4xl sm:text-5xl font-light text-slate-900 dark:text-white leading-tight mt-1">
            Latest <span class="font-bold">Articles</span> & Insights
          </h2>
        </div>

        <router-link 
          to="/blog"
          class="inline-flex items-center gap-2 text-sm font-bold text-[#00C4DF] hover:text-[#0284C7] transition-colors"
        >
          <span>Explore All Articles</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article 
          v-for="post in recentPosts" 
          :key="post.id"
          class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-transform"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img 
              :src="post.featuredImage || '/src/assets/images/smile_patient_hero_1785665461829.jpg'" 
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

              <h3 class="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                {{ post.title }}
              </h3>

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

    </div>
  </section>
</template>
