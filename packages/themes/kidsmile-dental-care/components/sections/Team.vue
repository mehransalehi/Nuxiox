<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'
import { Sparkles, Calendar, Award } from 'lucide-vue-next'

const modalStore = useModalStore()
const apiTeam = ref<any[]>([])

async function fetchTeam() {
  try {
    const res = await fetch('/api/colleagues/public')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        apiTeam.value = data
      }
    }
  } catch (e) {
    // Fallback to static translated team
  }
}

onMounted(() => {
  fetchTeam()
})

const defaultMembers = [
  {
    id: 1,
    nameKey: 'team.member1Name',
    roleKey: 'team.member1Role',
    bioKey: 'team.member1Bio',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    color: 'from-amber-400 to-orange-400',
    tag: 'Infant Specialist'
  },
  {
    id: 2,
    nameKey: 'team.member2Name',
    roleKey: 'team.member2Role',
    bioKey: 'team.member2Bio',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    color: 'from-indigo-500 to-purple-500',
    tag: 'Orthodontics Hero'
  },
  {
    id: 3,
    nameKey: 'team.member3Name',
    roleKey: 'team.member3Role',
    bioKey: 'team.member3Bio',
    img: 'https://images.unsplash.com/photo-1594824813585-7946a48a974b?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-400 to-teal-500',
    tag: 'Bubble Hygienist'
  }
]
</script>

<template>
  <section id="team" class="py-16 lg:py-24 bg-white relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">
          <Sparkles class="w-3.5 h-3.5 text-indigo-600" />
          <span>{{ $t('team.badge') }}</span>
        </div>
        
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-950 tracking-tight">
          {{ $t('team.title') }}
        </h2>
        
        <p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          {{ $t('team.subtitle') }}
        </p>
      </div>

      <!-- Team Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="member in defaultMembers"
          :key="member.id"
          class="bg-slate-50 rounded-[2.2rem] p-5 border-2 border-slate-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
        >
          <!-- Image Frame with decorative gradient ring -->
          <div class="relative h-64 sm:h-72 rounded-[1.8rem] overflow-hidden mb-5">
            <img
              :src="member.img"
              :alt="member.tag"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div
              class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r shadow-md"
              :class="member.color"
            >
              {{ member.tag }}
            </div>
          </div>

          <!-- Doctor Info -->
          <div class="space-y-2 text-start flex-1">
            <h3 class="text-xl font-black text-indigo-950 tracking-tight">
              {{ $t(member.nameKey) }}
            </h3>
            <div class="text-xs font-bold text-amber-600">
              {{ $t(member.roleKey) }}
            </div>
            <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
              {{ $t(member.bioKey) }}
            </p>
          </div>

          <!-- Quick Action -->
          <div class="pt-5 mt-4 border-t border-slate-200/80 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500">Available Mon - Fri</span>
            <button
              type="button"
              @click="modalStore.openBooking()"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <Calendar class="w-3.5 h-3.5" />
              <span>Book with Doctor</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
