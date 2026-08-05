<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  createdAt: string
}

const fallbackPosts: Post[] = [
  {
    id: 1,
    title: 'تکنیک‌های مراقبت از موهای بالیاژ شده در تابستان',
    slug: 'balayage-summer-care',
    excerpt: 'چگونه شادابی و درخشش رنگساژ مرواریدی و بالیاژ خود را در برابر آفتاب و کلر استخر حفظ کنیم؟',
    featuredImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    createdAt: '۲۰۲۶/۰۷/۱۵'
  },
  {
    id: 2,
    title: 'تفاوت بوتاکس مو، پروتئین‌تراپی و کراتین چیست؟',
    slug: 'botox-vs-keratin',
    excerpt: 'راهنمای کامل انتخاب بهترین پکیج احیا بر اساس جنس اسکالپ و آسیب‌دیدگی ساقه مو.',
    featuredImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    createdAt: '۲۰۲۶/۰۷/۱۰'
  },
  {
    id: 3,
    title: 'رازهای شاین کریستالی و تثبیت تناژ مرواریدی',
    slug: 'crystal-shine-secrets',
    excerpt: 'بررسی نقش شامپوهای ضد زردی و کوکتل‌های ویتامینه ارگانیک در ماندگاری رنگساژ.',
    featuredImage: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    createdAt: '۲۰۲۶/۰۷/۰۱'
  }
]

const posts = ref<Post[]>(fallbackPosts)

async function fetchPosts() {
  try {
    const data = await $fetch<Post[]>('/api/blog/posts/recent')
    if (data && data.length > 0) {
      posts.value = data
    }
  } catch (e) {
    // Keep fallback
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <section id="blog-section" class="w-full bg-white py-24 border-b border-[#E6DFC9] relative">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
      
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 reveal active">
        <div class="text-right space-y-2">
          <span class="font-serif italic text-2xl text-[#C5A059] tracking-widest block">{{ $t('nav.blog') }}</span>
          <h2 class="text-3xl sm:text-5xl font-extrabold text-[#222222] font-sans">{{ $t('blog.title') }}</h2>
        </div>

        <NuxtLink
          :to="$localePath('/blog')"
          class="btn-gold-outline px-6 py-2.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
        >
          {{ $t('blog.readMore') }} &rarr;
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article
          v-for="post in posts"
          :key="post.id"
          class="card-light-journal rounded-3xl overflow-hidden group flex flex-col justify-between"
        >
          <div class="space-y-4">
            <div class="w-full h-52 overflow-hidden relative bg-stone-100">
              <img
                :src="post.featuredImage || 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80'"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div class="p-6 space-y-3 text-right">
              <span class="text-[11px] text-[#C5A059] font-bold block">{{ post.createdAt }}</span>
              <h3 class="text-lg font-bold text-[#222222] group-hover:text-[#C5A059] transition-colors leading-snug">
                {{ post.title }}
              </h3>
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

    </div>
  </section>
</template>
