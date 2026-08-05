<script setup>
</script>

<template>
  <section id="about" class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Visual Column -->
        <div class="relative order-2 lg:order-1">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <div class="rounded-3xl overflow-hidden shadow-md aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80" 
                  alt="Happy child drawing"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-6 bg-teal-100/70 rounded-3xl text-center space-y-1">
                <p class="text-3xl font-extrabold text-teal-800 font-heading">15+</p>
                <p class="text-sm font-semibold text-teal-900">{{ $t('about.yearsExp') }}</p>
              </div>
            </div>
            <div class="space-y-4 pt-8">
              <div class="p-6 bg-rose-100/70 rounded-3xl text-center space-y-1">
                <p class="text-3xl font-extrabold text-rose-800 font-heading">1.5 - 6</p>
                <p class="text-sm font-semibold text-rose-900">{{ $t('about.ageGroups') }}</p>
              </div>
              <div class="rounded-3xl overflow-hidden shadow-md aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80" 
                  alt="Children learning outdoors"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Content Column -->
        <div class="space-y-6 order-1 lg:order-2">
          <div class="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            {{ $t('about.title') }}
          </div>

          <h2 class="text-3xl sm:text-4xl font-bold font-heading text-slate-800">
            {{ $t('about.subtitle') }}
          </h2>

          <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
            {{ $t('about.description') }}
          </p>

          <ul class="space-y-3 pt-2">
            <li class="flex items-center space-x-3 gap-3">
              <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>
              <span class="font-medium text-slate-700">{{ $t('about.safeEnvironment') }}</span>
            </li>
            <li class="flex items-center space-x-3 gap-3">
              <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>
              <span class="font-medium text-slate-700">{{ $t('about.smallClasses') }}</span>
            </li>
          </ul>

          <div class="pt-4">
            <a href="#services" class="btn-kindergarten-secondary inline-block">
              {{ $t('about.exploreBtn') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
