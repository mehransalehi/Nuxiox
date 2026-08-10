<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'
import video1 from "../../assets/bg.mp4"
import video2 from "../../assets/bg-reverse.mp4"

const modalStore = useModalStore()

const video1Ref = ref<HTMLVideoElement | null>(null)
const video2Ref = ref<HTMLVideoElement | null>(null)
const currentVideoIndex = ref(0)

function switchVideo() {
  const videos = [video1Ref.value, video2Ref.value]
  const current = currentVideoIndex.value
  const next = 1 - current

  if (videos[next]) {
    videos[next]!.currentTime = 0
    videos[next]!.play().catch(() => {})
    videos[next]!.classList.replace('opacity-0', 'opacity-100')
  }
  if (videos[current]) {
    videos[current]!.classList.replace('opacity-100', 'opacity-0')
  }
  currentVideoIndex.value = next
}

onMounted(() => {
  if (video1Ref.value) {
    video1Ref.value.play().catch(() => {})
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between bg-white relative">
    <!-- Video Background & Overlay -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <video
        ref="video1Ref"
        autoplay
        muted
        playsinline
        class="absolute w-full h-full object-cover opacity-100 transition-opacity duration-1000"
        :src="video1"
        @ended="switchVideo"
      ></video>

      <video
        ref="video2Ref"
        muted
        playsinline
        class="absolute w-full h-full object-cover opacity-0 transition-opacity duration-1000"
        :src="video2"
        @ended="switchVideo"
      ></video>
    </div>

    <!-- Main Hero Section -->
    <section id="hero" class="w-full flex-1 flex items-end md:items-center justify-center relative overflow-hidden pt-28 pb-12 z-10">
      <div class="w-full px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col rtl:md:flex-row ltr:md:flex-row-reverse rtl:items-end md:items-center justify-between gap-8">
        
        <!-- Social Icons Right -->
        <div class="w-full md:w-auto flex md:flex-col items-center md:justify-center rtl:justify-end flex-row gap-6 order-2 md:order-1">
          <a href="https://instagram.com" target="_blank" :title="$t('hero.instagram')" class="social-icon text-2xl p-1" :aria-label="$t('hero.instagram')">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a href="https://vk.com" target="_blank" :title="$t('hero.vk')" class="social-icon text-xl p-1" :aria-label="$t('hero.vk')">
            <i class="fa-brands fa-vk"></i>
          </a>
          <a href="https://facebook.com" target="_blank" :title="$t('hero.facebook')" class="social-icon text-xl p-1" :aria-label="$t('hero.facebook')">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
        </div>

        <!-- Main Heading & Content -->
        <div class="m-0! xl:me-24! md:me-6! space-y-6 fade-in ltr:text-left text-left md:rtl:text-right order-1 md:order-2 ltr:ltr:ml-4 rtl:ltr:mr-4 ltr:sm:ltr:ml-8 rtl:sm:ltr:mr-8 ltr:lg:ltr:ml-16 rtl:lg:ltr:mr-16 ltr:xl:ltr:ml-24 rtl:xl:ltr:mr-24 rtl:ml-24">
          <div class="space-y-1">
            <h1 class="text-6xl sm:text-7xl lg:text-7xl xl:text-8xl font-extrabold text-[#3A2016] tracking-tight leading-[1.1] text-shadow-lg text-shadow-[#B68E56] md:text-shadow-transparent">
              {{ $t('hero.title1') }}
            </h1>
            <h2 class="text-6xl sm:text-7xl lg:text-7xl xl:text-8xl font-extrabold text-[#B68E56] tracking-tight leading-[1.1] text-shadow-lg text-shadow-black md:text-shadow-transparent">
              {{ $t('hero.title2') }}
            </h2>
          </div>

          <div class="space-y-1 text-[#3A2016] text-base sm:text-lg font-medium leading-relaxed pt-2 text-shadow-md text-shadow-[#B68E56] md:text-shadow-transparent">
            <p>{{ $t('hero.line1') }}</p>
            <p>{{ $t('hero.line2') }}</p>
          </div>

          <div class="pt-4 flex rtl:justify-end md:rtl:justify-start">
            <button @click="modalStore.openBooking()" class="btn-outline-hero px-10 py-3 text-base font-semibold text-shadow-md text-shadow-[#B68E56] md:text-shadow-transparent">
              {{ $t('hero.bookBtn') }}
            </button>
          </div>
        </div>

      </div>
    </section>

    <div class="pb-4"></div>
  </div>
</template>
