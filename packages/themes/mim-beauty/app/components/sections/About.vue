<template>
  <section id="about" class="w-full bg-white py-24 border-b border-[#E6DFC9] relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <!-- Text & Heading Side -->
        <div class="lg:col-span-5 space-y-6 text-right order-1 lg:order-1 reveal active">
          <div class="space-y-2">
            <span class="font-serif italic text-sm tracking-widest text-[#C5A059] font-semibold uppercase block">
              {{ $t('about.eyebrow') }}
            </span>
            <h2 class="text-4xl sm:text-5xl font-black text-[#222222] tracking-tight font-sans">
              {{ $t('about.title') }}
            </h2>
          </div>

          <p class="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
            {{ $t('about.desc') }}
          </p>

          <div class="pt-4">
            <a
              href="#services"
              class="inline-flex items-center justify-center px-8 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-white font-bold text-xs tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {{ $t('about.exploreBtn') }}
            </a>
          </div>
        </div>

        <!-- Image Collage & Floating Stats -->
        <div class="lg:col-span-7 relative order-2 lg:order-2 reveal active">
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end relative">
            
            <!-- Floating Stats Card (30,000+) -->
            <div class="sm:col-span-12 lg:absolute lg:-top-12 lg:left-12 z-20 bg-white border border-stone-100 rounded-2xl p-5 shadow-xl shadow-stone-200/50 max-w-xs space-y-3 reveal active delay-200">
              <div class="flex items-center justify-between">
                <span class="font-sans font-black text-2xl text-stone-900">{{ $t('about.statsNumber') }}</span>
                <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-sm">
                  <i class="fa-solid fa-arrow-trend-up"></i>
                </div>
              </div>
              <p class="text-[11px] text-stone-500 font-medium leading-snug">
                {{ $t('about.statsDesc') }}
              </p>
              
              <!-- Facepile Avatars -->
              <div class="flex items-center -space-x-2 space-x-reverse pt-1">
                <img class="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Client 1" />
                <img class="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Client 2" />
                <img class="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80" alt="Client 3" />
                <img class="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Client 4" />
                <div class="w-7 h-7 rounded-full border-2 border-white bg-amber-100 text-[#C5A059] flex items-center justify-center text-[10px] font-bold">
                  +5k
                </div>
              </div>
            </div>

            <!-- Image 1 -->
            <div class="sm:col-span-6 space-y-2">
              <div class="w-full h-72 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-stone-100 relative group bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80"
                  alt="Organic hair care products"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span class="block text-center text-xs font-semibold text-stone-400 font-sans">{{ $t('about.bestRatings') }}</span>
            </div>

            <!-- Image 2 -->
            <div class="sm:col-span-6">
              <div class="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-stone-100 relative group bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                  alt="Mim Beauty Salon Interior"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  </section>
</template>
