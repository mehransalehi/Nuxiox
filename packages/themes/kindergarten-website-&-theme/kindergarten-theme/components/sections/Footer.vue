<script setup>
</script>

<template>
  <footer class="bg-slate-900 text-slate-300 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
        <!-- Col 1: Brand -->
        <div class="space-y-4 md:col-span-1">
          <div class="flex items-center space-x-3 gap-2">
            <div class="w-9 h-9 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-lg">
              ☀️
            </div>
            <span class="text-xl font-bold font-heading text-white">
              {{ $t('site.name') }}
            </span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            {{ $t('site.tagline') }}
          </p>
        </div>

        <!-- Col 2: Navigation -->
        <div class="space-y-3">
          <h4 class="font-bold text-white text-sm uppercase tracking-wider font-heading">
            {{ $t('nav.home') }}
          </h4>
          <ul class="space-y-2 text-xs">
            <li><a href="#about" class="hover:text-amber-400 transition-colors">{{ $t('nav.about') }}</a></li>
            <li><a href="#services" class="hover:text-amber-400 transition-colors">{{ $t('nav.services') }}</a></li>
            <li><a href="#whyus" class="hover:text-amber-400 transition-colors">{{ $t('nav.whyus') }}</a></li>
            <li><a href="#team" class="hover:text-amber-400 transition-colors">{{ $t('nav.team') }}</a></li>
          </ul>
        </div>

        <!-- Col 3: Programs -->
        <div class="space-y-3">
          <h4 class="font-bold text-white text-sm uppercase tracking-wider font-heading">
            {{ $t('nav.services') }}
          </h4>
          <ul class="space-y-2 text-xs text-slate-400">
            <li>Toddler Discovery</li>
            <li>Early Arts & Crafts</li>
            <li>Kindergarten Readiness</li>
            <li>Music & STEM Exploration</li>
          </ul>
        </div>

        <!-- Col 4: Contact & Socials -->
        <div class="space-y-3">
          <h4 class="font-bold text-white text-sm uppercase tracking-wider font-heading">
            {{ $t('nav.contact') }}
          </h4>
          <p class="text-xs text-slate-400">{{ $t('contact.addressValue') }}</p>
          <p class="text-xs text-slate-400">{{ $t('contact.phoneValue') }}</p>
          <div class="flex space-x-3 gap-3 pt-2">
            <span class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm cursor-pointer hover:bg-amber-500 hover:text-slate-900 transition-colors">📷</span>
            <span class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm cursor-pointer hover:bg-amber-500 hover:text-slate-900 transition-colors">📘</span>
            <span class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm cursor-pointer hover:bg-amber-500 hover:text-slate-900 transition-colors">💬</span>
          </div>
        </div>
      </div>

      <div class="pt-8 text-center text-xs text-slate-500">
        <p>{{ $t('site.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>
