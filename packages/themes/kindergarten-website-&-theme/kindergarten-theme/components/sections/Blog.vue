<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])
const isLoading = ref(true)

async function fetchPosts() {
  try {
    const res = await fetch('/api/blog/posts/recent')
    if (res.ok) {
      posts.value = await res.json()
    } else {
      posts.value = []
    }
  } catch (e) {
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <section id="blog" class="py-16 md:py-24 bg-rose-50/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div class="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
          {{ $t('blog.title') }}
        </div>
        <p class="text-slate-600 text-base sm:text-lg">
          {{ $t('blog.subtitle') }}
        </p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="n in 3" :key="n" class="h-80 bg-slate-200/60 rounded-3xl animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <div class="aspect-16/9 bg-slate-100 overflow-hidden">
              <img 
                :src="post.featuredImage || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'" 
                :alt="post.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-6 space-y-3">
              <span class="text-xs font-bold text-rose-500 uppercase tracking-wide">
                {{ post.createdAt || 'Recent Update' }}
              </span>
              <h3 class="font-bold text-lg font-heading text-slate-800 line-clamp-2">
                {{ post.title }}
              </h3>
              <p class="text-slate-600 text-xs leading-relaxed line-clamp-3">
                {{ post.excerpt }}
              </p>
            </div>
          </div>

          <div class="p-6 pt-0">
            <a 
              :href="`/blog/${post.slug || post.id}`" 
              class="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 gap-1"
            >
              <span>{{ $t('blog.readMore') }}</span>
              <span>→</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
