<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DecorativeBg from '../../components/ui/DecorativeBg.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

interface CommentNode {
  id: number
  authorName?: string | null
  content: string
  createdAt: string
  likeCount?: number
  replies?: CommentNode[]
}

interface PostDetail {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  content?: string
  featuredImage?: string | null
  publishedAt?: string | null
  createdAt: string
}

const post = ref<PostDetail>({
  id: 1,
  title: 'تکنیک‌های مراقبت از موهای بالیاژ شده در تابستان',
  slug: 'balayage-summer-care',
  content: `<p class="mb-4">بالیاژ یکی از محبوب‌ترین و لوکس‌ترین تکنیک‌های رنگ مو در دنیا است که با ایجاد سایه‌روشن‌های طبیعی، جذابیت فوق‌العاده‌ای به چهره می‌بخشد. اما در فصل تابستان، قرار گرفتن در معرض اشعه ماوراء بنفش خورشید، کلر استخر و آب شور دریا می‌تواند خشکی و تغییر تناژ رنگساژ را به همراه داشته باشد.</p>
  <h3 class="text-xl font-bold my-4 text-[#222222]">۱. استفاده از سرم‌های محافظ حرارت و UV</h3>
  <p class="mb-4">قبل از خروج از منزل یا رفتن به ساحل، حتماً از اسپری‌ها و روغن‌های محافظ ضد آفتاب مو استفاده کنید تا لایه کوتیکول مو آسیب نبیند.</p>
  <h3 class="text-xl font-bold my-4 text-[#222222]">۲. شستشو با شامپوی بدون سولفات و آب ولرم</h3>
  <p class="mb-4">شامپوهای حاوی سولفات باعث شسته شدن سریع‌تر رنگساژ کوکتل مرواریدی می‌شوند. همواره از محصولات ارگانیک تخصصی سالن میم بیوتی استفاده نمایید.</p>`,
  featuredImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80',
  createdAt: '۲۰۲۶/۰۷/۱۵'
})

const comments = ref<CommentNode[]>([
  {
    id: 1,
    authorName: 'مریم سلیمانی',
    content: 'مقاله بسیار کاربردی و مفیدی بود. ممنون از نکات عالی سالن میم بیوتی.',
    createdAt: '۲۰۲۶/۰۷/۱۶',
    likeCount: 4,
    replies: []
  }
])

const commentAuthor = ref('')
const commentText = ref('')

async function fetchPostDetail() {
  try {
    const res = await $fetch<{ post: PostDetail; comments: CommentNode[] }>(`/api/blog/posts/${slug.value}`)
    if (res && res.post) {
      post.value = res.post
      comments.value = res.comments || []
    }
  } catch (e) {
    // Keep fallback
  }
}

async function handleCommentSubmit(e: Event) {
  e.preventDefault()
  if (!commentText.value) return

  const newComment: CommentNode = {
    id: Date.now(),
    authorName: commentAuthor.value || 'مهمان',
    content: commentText.value,
    createdAt: 'هم‌اکنون',
    likeCount: 0,
    replies: []
  }

  try {
    await $fetch(`/api/blog/posts/${slug.value}/comments`, {
      method: 'POST',
      body: {
        authorName: commentAuthor.value,
        content: commentText.value
      }
    })
  } catch (err) {
    // Fallback locally
  }

  comments.value.unshift(newComment)
  commentAuthor.value = ''
  commentText.value = ''
}

onMounted(() => {
  fetchPostDetail()
})
</script>

<template>
  <div class="w-full bg-[#FAF8F5] min-h-screen pt-32 pb-24 relative overflow-hidden">
    <!-- Decorative background lamps, bulbs, and grid overlay -->
    <DecorativeBg />

    <div class="max-w-4xl mx-auto px-6 sm:px-12 relative z-10 space-y-10">
      
      <!-- Post Header -->
      <div class="text-right space-y-4">
        <NuxtLink :to="$localePath('/blog')" class="inline-flex items-center gap-2 text-xs font-bold text-[#C5A059] hover:underline mb-2">
          <i class="fa-solid fa-arrow-right"></i>
          <span>بازگشت به وبلاگ</span>
        </NuxtLink>

        <span class="text-xs font-bold text-[#C5A059] block">{{ post.createdAt }}</span>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-[#222222] font-sans leading-tight">
          {{ post.title }}
        </h1>
      </div>

      <!-- Featured Image -->
      <div class="w-full h-80 sm:h-[450px] rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-100 relative">
        <img
          :src="post.featuredImage || 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80'"
          :alt="post.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Main Article Content -->
      <div class="card-light-journal p-8 sm:p-12 rounded-3xl space-y-6 text-right text-stone-700 leading-relaxed font-normal text-sm sm:text-base">
        <div v-html="post.content"></div>
      </div>

      <!-- Comments Section -->
      <div class="space-y-8 pt-8 border-t border-stone-200">
        <h2 class="text-2xl font-bold text-[#222222] text-right">
          {{ $t('blog.comments') }} ({{ comments.length }})
        </h2>

        <!-- Leave Comment Form -->
        <div class="card-light-journal p-8 rounded-2xl space-y-4">
          <h3 class="text-base font-bold text-[#222222] text-right">{{ $t('blog.leaveComment') }}</h3>
          <form @submit="handleCommentSubmit" class="space-y-4 text-right">
            <div>
              <label class="block text-xs text-stone-600 mb-1">{{ $t('blog.yourName') }}</label>
              <input
                v-model="commentAuthor"
                type="text"
                :placeholder="$t('blog.yourName')"
                class="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-xs text-[#222222] focus:outline-none focus:border-[#C5A059] transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs text-stone-600 mb-1">{{ $t('blog.yourComment') }}</label>
              <textarea
                v-model="commentText"
                rows="4"
                required
                :placeholder="$t('blog.yourComment')"
                class="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-xs text-[#222222] focus:outline-none focus:border-[#C5A059] transition-colors"
              ></textarea>
            </div>
            <button type="submit" class="btn-gold-dark px-8 py-3 rounded-lg text-xs font-semibold">
              {{ $t('blog.postComment') }}
            </button>
          </form>
        </div>

        <!-- Threaded Comments List -->
        <div class="space-y-4 text-right">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="bg-white border border-stone-200/80 p-6 rounded-2xl space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-[#222222]">{{ comment.authorName || 'مهمان' }}</span>
              <span class="text-stone-400">{{ comment.createdAt }}</span>
            </div>
            <p class="text-xs text-stone-600 leading-relaxed">{{ comment.content }}</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
