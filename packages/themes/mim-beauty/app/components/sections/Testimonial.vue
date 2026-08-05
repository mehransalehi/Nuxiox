<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface TestimonialItem {
  id?: number
  name: string
  role?: string | null
  title?: string
  content: string
  rating?: number
  avatar?: string | null
}

const fallbackTestimonials: TestimonialItem[] = [
  {
    name: "سارا محمدی",
    role: "مشتری وفادار",
    title: "بهترین تجربه‌ای که برای سلامت موهایم داشتم!",
    content: "کیفیت خدمات و برخورد حرفه‌ای پرسنل سالن میم بیوتی بی‌نظیر بود. بالیاژ من بدون کوچکترین آسیبی دقیقاً همون چیزی شد که آرزوش رو داشتم.",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "نیلوفر کریمی",
    role: "مشتری کراتین و احیا",
    title: "احیای معجزه‌آسای موهای آسیب‌دیده!",
    content: "موهای من بعد از دکلره شدیداً سوخته بود، اما با پکیج اختصاصی پروتئین‌تراپی میم بیوتی کاملا نرم، ابریشمی و درخشان شد. واقعا ممنونم.",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "بسی کوپر (مریم)",
    role: "مشتری VIP",
    title: "The Best Thing I've Used for My Hair!",
    content: "از نظم بالای وقت‌دهی، محیط فوق‌العاده لوکس و آروم سالن و مشاوره صمیمانه کادر متخصص خیلی راضی بودم. همیشه مشتری ثابتتون می‌مونم.",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "الناز صبوری",
    role: "مشتری هایلایت و کوپ",
    title: "رنگساژ ژورنالی فوق‌العاده خاص!",
    content: "رنگساژ کوکتل مرواریدی که برام زدن فوق‌العاده شیک شد و تمام رفله‌های زردی موهام کاملاً اصلاح شد. پیشنهاد می‌کنم حتما امتحان کنید.",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "مهسا ابراهیمی",
    role: "مشتری استایل و میکاپ",
    title: "تغییر ظاهری شگفت‌انگیز و ماندگار!",
    content: "استایل و براشینگ برای مراسم بسیار ماندگار بود و تا آخر شب موهام هیچ تغییری نکرد. برخورد مدیریت و پرسنل هم بسیار محترمانه بود.",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  }
]

const testimonials = ref<TestimonialItem[]>(fallbackTestimonials)
const currentIndex = ref(2)
const isFading = ref(false)

async function fetchTestimonials() {
  try {
    const data = await $fetch<TestimonialItem[]>('/api/testimonials/public')
    if (data && data.length > 0) {
      testimonials.value = data
    }
  } catch (e) {
    // Keep fallback
  }
}

function selectTestimonial(index: number) {
  if (index === currentIndex.value) return
  isFading.value = true
  setTimeout(() => {
    currentIndex.value = index
    isFading.value = false
  }, 250)
}

function nextTestimonial() {
  const next = (currentIndex.value + 1) % testimonials.value.length
  selectTestimonial(next)
}

function prevTestimonial() {
  const prev = (currentIndex.value - 1 + testimonials.value.length) % testimonials.value.length
  selectTestimonial(prev)
}

onMounted(() => {
  fetchTestimonials()
})
</script>

<template>
  <section id="testimonials" class="w-full bg-[#FAF8F5] py-24 border-b border-[#E6DFC9] relative overflow-hidden">
    <div class="max-w-5xl mx-auto px-6 sm:px-12 relative z-10 text-center reveal active">
      
      <!-- Section Header -->
      <div class="space-y-2 mb-10">
        <span class="text-xs font-semibold text-stone-500 tracking-wider uppercase block">{{ $t('testimonials.eyebrow') }}</span>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-stone-900 font-sans tracking-tight">
          {{ $t('testimonials.titleLine1') }} <br class="sm:hidden">
          <span class="text-[#B68E56] font-serif italic">{{ $t('testimonials.titleLine2') }}</span>
        </h2>
      </div>

      <!-- Avatar Row -->
      <div class="flex items-center justify-center gap-3 sm:gap-5 mb-10 pt-2">
        <button
          v-for="(item, idx) in testimonials"
          :key="idx"
          @click="selectTestimonial(idx)"
          :class="[
            'relative transition-all duration-500 rounded-full cursor-pointer focus:outline-none',
            idx === currentIndex
              ? 'w-16 h-16 sm:w-20 sm:h-20 scale-110 z-20 p-1 border-2 border-stone-800 shadow-xl'
              : 'w-10 h-10 sm:w-12 sm:h-12 opacity-60 hover:opacity-100 scale-90 z-10'
          ]"
        >
          <img :src="item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'" :alt="item.name" class="w-full h-full object-cover rounded-full" />
        </button>
      </div>

      <!-- Slider Controls & Review Card -->
      <div class="relative max-w-3xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        
        <button
          @click="prevTestimonial"
          :aria-label="$t('testimonials.prev')"
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C5A059] hover:bg-[#a88443] text-white flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 shrink-0 cursor-pointer"
        >
          <i class="fa-solid fa-arrow-right text-lg"></i>
        </button>

        <div
          :class="[
            'flex-1 transition-all duration-500 transform px-2 sm:px-6',
            isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          ]"
        >
          <h3 v-if="testimonials[currentIndex]?.title" class="text-xl sm:text-2xl font-bold text-stone-900 mb-3 font-sans">
            {{ testimonials[currentIndex]?.title }}
          </h3>

          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto font-normal mb-6">
            {{ testimonials[currentIndex]?.content }}
          </p>

          <div class="flex items-center justify-center gap-2 mb-4">
            <div class="flex text-amber-400 text-sm gap-1">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <span class="text-xs font-bold text-stone-800 dir-ltr">{{ testimonials[currentIndex]?.rating || '5.0' }}</span>
          </div>

          <div>
            <h4 class="text-sm font-extrabold text-stone-900">{{ testimonials[currentIndex]?.name }}</h4>
            <span v-if="testimonials[currentIndex]?.role" class="text-xs text-stone-400 font-normal">{{ testimonials[currentIndex]?.role }}</span>
          </div>
        </div>

        <button
          @click="nextTestimonial"
          :aria-label="$t('testimonials.next')"
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1e3223] hover:bg-[#122016] text-white flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 shrink-0 cursor-pointer"
        >
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>

      </div>

    </div>
  </section>
</template>
