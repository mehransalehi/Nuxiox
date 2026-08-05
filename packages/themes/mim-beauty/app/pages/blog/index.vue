<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DecorativeBg from '../../components/ui/DecorativeBg.vue'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  createdAt: string
  category?: string
}

const searchQuery = ref('')
const selectedCategory = ref('ALL')

const fallbackPosts: Post[] = [
  {
    id: 1,
    title: 'تکنیک‌های مراقبت از موهای بالیاژ شده در تابستان',
    slug: 'balayage-summer-care',
    category: 'بالیاژ',
    excerpt: 'چگونه شادابی و درخشش رنگساژ مرواریدی و بالیاژ خود را در برابر آفتاب و کلر استخر حفظ کنیم؟',
    featuredImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    createdAt: '۲۰۲۶/۰۷/۱۵'
  },
  {
    id: 2,
    title: 'تفاوت بوتاکس مو، پروتئین‌تراپی و کراتین چیست؟',
    slug: 'botox-vs-keratin',
    category: 'احیا و کراتین',
    excerpt: 'راهنمای کامل انتخاب بهترین پکیج احیا بر اساس جنس اسکالپ و آسیب‌دیدگی ساقه مو.',
    featuredImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    createdAt: '۲۰۲۶/۰۷/۱۰'
  },
  {
    id: 3,
    title: 'رازهای شاین کریستالی و تثبیت تناژ مرواریدی',
    slug: 'crystal-shine-secrets',
    category: 'رنگساژ',
    excerpt: 'بررسی نقش شامپوهای ضد زردی و کوکتل‌های ویتامینه ارگانیک در ماندگاری رنگساژ.',
    featuredImage: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    createdAt: '۲۰۲۶/۰۷/۰۱'
  }
]

const posts = ref<Post[]>(fallbackPosts)

async function fetchPosts() {
  try {
    const data = await $fetch<Post[]>('/api/blog/posts')
    if (data && data.length > 0) {
      posts.value = data
    }
  } catch (e) {
    // Keep fallback
  }
}

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = !searchQuery.value || post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesCategory = selectedCategory.value === 'ALL' || post.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="w-full bg-[#FAF8F5] min-h-screen pt-32 pb-24 relative overflow-hidden">
    <!-- Decorative background lamps, bulbs, and grid overlay -->
    <DecorativeBg />

    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10 space-y-12">
      
      <!-- Page Header -->
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <span class="font-serif italic text-2xl text-[#C5A059] tracking-widest block">BLOG & ARTICLES</span>
        <h1 class="text-4xl sm:text-6xl font-extrabold text-[#222222] font-sans">{{ $t('blog.title') }}</h1>
        <p class="text-[#666666] text-sm sm:text-base font-normal">
          {{ $t('blog.subtitle') }}
        </p>
      </div>

      <!-- Search & Filter Controls -->
      <div class="card-light-journal p-6 rounded-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div class="relative flex-1 w-full">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('blog.searchPlaceholder')"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-[#222222] focus:outline-none focus:border-[#C5A059] transition-colors"
          />
          <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
        </div>

        <select
          v-model="selectedCategory"
          class="w-full sm:w-auto bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-[#222222] focus:outline-none focus:border-[#C5A059] transition-colors"
        >
          <option value="ALL">{{ $t('blog.allCategories') }}</option>
          <option value="بالیاژ">بالیاژ</option>
          <option value="احیا و کراتین">احیا و کراتین</option>
          <option value="رنگساژ">رنگساژ</option>
        </select>
      </div>

      <!-- Articles Grid -->
      <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="card-light-journal rounded-3xl overflow-hidden group flex flex-col justify-between"
        >
          <div class="space-y-4">
            <div class="w-full h-56 overflow-hidden relative bg-stone-100">
              <img
                :src="post.featuredImage || 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80'"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div class="p-6 space-y-3 text-right">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-[#C5A059] font-bold">{{ post.createdAt }}</span>
                <span v-if="post.category" class="bg-amber-50 text-[#C5A059] px-2.5 py-1 rounded-full border border-[#E6DFC9] font-medium">{{ post.category }}</span>
              </div>
              
              <h2 class="text-lg font-bold text-[#222222] group-hover:text-[#C5A059] transition-colors leading-snug">
                {{ post.title }}
              </h2>
              
              <p v-if="post.excerpt" class="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {{ post.excerpt }}
              </p>
            </div>
          </div>

          <div class="p-6 pt-0 text-right">
            <NuxtLink
              :to="$localePath(`/blog/${post.slug}`)"
              class="inline-flex items-center gap-2 text-xs font-bold text-[#222222] hover:text-[#C5A059] transition-colors"
            >
              <span>{{ $t('blog.readMore') }}</span>
              <i class="fa-solid fa-arrow-left text-xs"></i>
            </NuxtLink>
          </div>
        </article>
      </div>

      <div v-else class="text-center py-16 text-stone-500">
        {{ $t('blog.notFound') }}
      </div>

    </div>
  </div>
</template>
