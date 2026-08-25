<script setup lang="ts">
import { useModalStore } from '~~/packages/base/app/stores/modal'

const modalStore = useModalStore()

const images = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
]

const imgKeys = [
  'portfolio_1', 'portfolio_2', 'portfolio_3', 'portfolio_4',
  'portfolio_featured',
  'portfolio_5', 'portfolio_6', 'portfolio_7', 'portfolio_8'
]
</script>

<template>
  <section id="portfolio" class="w-full bg-[#FAFAFA] py-24 border-b border-[#E6DFC9] relative">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">

      <!-- Section Title -->
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-14 reveal active">
        <span data-i18n="portfolio.eyebrow" class="text-xs font-semibold text-stone-500 tracking-wider uppercase block">{{ $t('portfolio.eyebrow') }}</span>
        <h2 data-i18n="portfolio.titlePrefix" class="text-3xl sm:text-5xl font-extrabold text-stone-900 font-sans tracking-tight">
          {{ $t('portfolio.titlePrefix') }}<span data-i18n="portfolio.titleHighlight" class="text-[#B68E56] font-serif italic">{{ $t('portfolio.titleHighlight') }}</span>
        </h2>
        <p data-i18n="portfolio.handle" class="text-xs text-stone-500 pt-1">{{ $t('portfolio.handle') }}</p>
      </div>

      <!-- 5-Column Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">

        <!-- Column 1 -->
        <div class="flex flex-col gap-4 col-span-1 reveal active delay-100">
          <div class="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-sm group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[0])">
            <img :src="images[0]" alt="Instagram Post 1" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_1" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xl">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-sm group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[1])">
            <img :src="images[1]" alt="Instagram Post 2" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_2" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xl">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
        </div>

        <!-- Column 2 -->
        <div class="flex flex-col gap-4 col-span-1 reveal active delay-200">
          <div class="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-sm group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[2])">
            <img :src="images[2]" alt="Instagram Post 3" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_3" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xl">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-sm group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[3])">
            <img :src="images[3]" alt="Instagram Post 4" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_4" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xl">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
        </div>

        <!-- Column 3: Center Featured Image -->
        <div class="col-span-2 sm:col-span-3 lg:col-span-1 flex reveal active delay-300">
          <div class="w-full min-h-[360px] h-full rounded-3xl overflow-hidden relative shadow-md group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[4])">
            <img :src="images[4]" alt="Featured Instagram Post" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_featured" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-6 text-white text-center">
              <i class="fa-brands fa-instagram text-3xl mb-2"></i>
              <span data-i18n="portfolio.viewInstagram" class="text-xs font-bold tracking-wider">{{ $t('portfolio.viewInstagram') }}</span>
            </div>
          </div>
        </div>

        <!-- Column 4 -->
        <div class="flex flex-col gap-4 col-span-1 reveal active delay-400">
          <div class="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-sm group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[5])">
            <img :src="images[5]" alt="Instagram Post 5" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_5" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xl">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-sm group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[6])">
            <img :src="images[6]" alt="Instagram Post 6" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_6" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xl">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
        </div>

        <!-- Column 5 -->
        <div class="flex flex-col gap-4 col-span-1 reveal active delay-500">
          <div class="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-sm group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[7])">
            <img :src="images[7]" alt="Instagram Post 7" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_7" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xl">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-sm group cursor-pointer border border-stone-200/60" @click="modalStore.openImage(images[8])">
            <img :src="images[8]" alt="Instagram Post 8" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-nuxiox-img="portfolio_8" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xl">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>