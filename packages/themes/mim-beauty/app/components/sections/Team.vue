<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface TeamMember {
  id: number
  title: string
  subtitle?: string | null
  image?: string | null
  description?: string | null
}

const fallbackTeam: TeamMember[] = [
  {
    id: 1,
    title: 'مریم احمدی',
    subtitle: 'مستر بالیاژ و هیرکالریست ارشد',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    description: 'دارای مدرک بین‌المللی بالیاژ از آکادمی لورآل پاریس با ۱۲ سال تجربه'
  },
  {
    id: 2,
    title: 'سارا رضایی',
    subtitle: 'متخصص احیا و کراتین ارگانیک',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    description: 'استاد درمان بافت‌های آسیب‌دیده با بوتاکس و پروتئین فلوراکتیو'
  },
  {
    id: 3,
    title: 'الناز کریمی',
    subtitle: 'استایلیست و کوپ ژورنالی',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    description: 'طراح فرم و کوپ‌های ماندگار متناسب با آناتومی چهره'
  }
]

const team = ref<TeamMember[]>(fallbackTeam)

async function fetchTeam() {
  try {
    const data = await $fetch<TeamMember[]>('/api/colleagues/public')
    if (data && data.length > 0) {
      team.value = data
    }
  } catch (e) {
    // Keep fallback
  }
}

onMounted(() => {
  fetchTeam()
})
</script>

<template>
  <section id="team" class="w-full bg-[#FAF8F5] py-20 border-b border-[#E6DFC9] relative">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-16 reveal active">
        <span class="font-serif italic text-2xl text-[#C5A059] tracking-widest block">{{ $t('hours.teamTag') }}</span>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-[#222222] font-sans">{{ $t('hours.teamTag') }}</h2>
        <p class="text-stone-600 text-sm sm:text-base font-normal">
          {{ $t('hours.teamDesc') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="member in team"
          :key="member.id"
          class="card-light-journal rounded-3xl p-6 text-center space-y-4 group hover:-translate-y-2 transition-transform duration-300"
        >
          <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#C5A059]/30 shadow-md">
            <img :src="member.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'" :alt="member.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div>
            <h3 class="text-xl font-bold text-[#222222]">{{ member.title }}</h3>
            <span v-if="member.subtitle" class="text-xs text-[#C5A059] font-semibold block mt-1">{{ member.subtitle }}</span>
          </div>

          <p v-if="member.description" class="text-xs text-stone-600 leading-relaxed">
            {{ member.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
