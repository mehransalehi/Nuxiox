<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sparkles, Calendar, ArrowRight, BookOpen, Send, Check } from 'lucide-vue-next'

const apiPosts = ref<any[]>([])
const newsletterEmail = ref('')
const isSubscribed = ref(false)

async function fetchBlogPosts() {
  try {
    const res = await fetch('/api/blog/posts/recent')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        apiPosts.value = data
      }
    }
  } catch (e) {
    // Fallback to translated posts
  }
}

function handleSubscribe() {
  if (newsletterEmail.value.trim()) {
    isSubscribed.value = true
    setTimeout(() => {
      newsletterEmail.value = ''
    }, 4000)
  }
}

onMounted(() => {
  fetchBlogPosts()
})

const defaultArticles = [
  {
    id: 1,
    titleKey: 'blog.post1Title',
    categoryKey: 'blog.post1Category',
    dateKey: 'blog.post1Date',
    excerptKey: 'blog.post1Excerpt',
    img: 'https://images.unsplash.com/photo-1593100126453-19b562a800c1?auto=format&fit=crop&w=600&q=80',
    tagColor: 'bg-amber-100 text-amber-900'
  },
  {
    id: 2,
    titleKey: 'blog.post2Title',
    categoryKey: 'blog.post2Category',
    dateKey: 'blog.post2Date',
    excerptKey: 'blog.post2Excerpt',
    img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
    tagColor: 'bg-emerald-100 text-emerald-900'
  },
  {
    id: 3,
    titleKey: 'blog.post3Title',
    categoryKey: 'blog.post3Category',
    dateKey: 'blog.post3Date',
    excerptKey: 'blog.post3Excerpt',
    img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    tagColor: 'bg-purple-100 text-purple-900'
  }
]
</script>

<template>
  <section id="blog" class="py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
          <BookOpen class="w-3.5 h-3.5 text-amber-600" />
          <span data-i18n="blog.badge">{{ $t('blog.badge') }}</span>
        </div>
        
        <h2 data-i18n="blog.title" class="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-950 tracking-tight">
          {{ $t('blog.title') }}
        </h2>
        
        <p data-i18n="blog.subtitle" class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          {{ $t('blog.subtitle') }}
        </p>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <article
          v-for="article in defaultArticles"
          :key="article.id"
          class="bg-white rounded-[2rem] p-4 border border-slate-200/70 shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
        >
          <div>
            <!-- Thumbnail Frame -->
            <div class="relative h-48 sm:h-52 rounded-[1.6rem] overflow-hidden mb-4">
              <img
                :src="article.img"
                :alt="$t(article.titleKey)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span
                class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black shadow-xs"
                :class="article.tagColor"
              >
                {{ $t(article.categoryKey) }}
              </span>
            </div>

            <!-- Meta & Title -->
            <div class="p-2 space-y-2 text-start">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Calendar class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ $t(article.dateKey) }}</span>
              </div>

              <h3 class="text-lg font-black text-indigo-950 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                {{ $t(article.titleKey) }}
              </h3>

              <p class="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {{ $t(article.excerptKey) }}
              </p>
            </div>
          </div>

          <!-- Bottom Read More -->
          <div class="p-2 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span data-i18n="blog.readMore">{{ $t('blog.readMore') }}</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform arrow-dir" />
          </div>
        </article>
      </div>

      <!-- Newsletter Bar (Exact component from reference image!) -->
      <div class="bg-gradient-to-r from-amber-100/90 via-amber-50 to-orange-100/80 rounded-[2.5rem] p-6 sm:p-8 lg:p-10 border-2 border-amber-300/80 shadow-xl relative overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <!-- Left: Envelope sticker & Heading -->
          <div class="lg:col-span-6 flex items-center gap-4 sm:gap-6 text-start">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
              💌
            </div>
            <div class="space-y-1">
              <h3 data-i18n="newsletter.title" class="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
                {{ $t('newsletter.title') }}
              </h3>
              <p data-i18n="newsletter.subtitle" class="text-xs sm:text-sm text-slate-600 font-medium">
                {{ $t('newsletter.subtitle') }}
              </p>
            </div>
          </div>

          <!-- Right: Input & Subscribe button -->
          <div class="lg:col-span-6">
            <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-3">
              <input
                v-model="newsletterEmail"
                type="email"
                required
                :placeholder="$t('newsletter.placeholder')"
                class="flex-1 px-5 py-3.5 rounded-full bg-white border border-amber-300 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
              <button
                type="submit"
                class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <span data-i18n="newsletter.subscribeBtn">{{ $t('newsletter.subscribeBtn') }}</span>
                <Send class="w-4 h-4 arrow-dir" />
              </button>
            </form>
            <div v-if="isSubscribed" class="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-fade-in">
              <Check class="w-4 h-4" />
              <span data-i18n="newsletter.thankYou">{{ $t('newsletter.thankYou') }}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
