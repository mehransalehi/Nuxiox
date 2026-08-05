<template>
  <div class="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
    <!-- Grid Pattern Overlay -->
    <div class="absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(#C5A059 1.5px, transparent 1.5px); background-size: 28px 28px;"></div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#C5A0590d_1px,transparent_1px),linear-gradient(to_bottom,#C5A0590d_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"></div>

    <!-- Glowing Light Bulbs & Ambient Orbs -->
    <div class="absolute -top-16 right-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute top-1/2 -left-20 w-80 h-80 bg-[#C5A059]/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 right-10 w-96 h-96 bg-amber-300/25 rounded-full blur-3xl"></div>

    <!-- Hanging Decorative Light Bulbs Left -->
    <div class="absolute top-0 left-6 sm:left-16 flex items-start gap-5 opacity-40 text-[#C5A059] z-0">
      <div class="flex flex-col items-center">
        <div class="w-0.5 h-12 bg-gradient-to-b from-transparent to-[#C5A059]"></div>
        <div class="p-1.5 rounded-full bg-amber-100/60 backdrop-blur-xs shadow-sm">
          <i class="fa-solid fa-lightbulb text-xl animate-pulse"></i>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-0.5 h-20 bg-gradient-to-b from-transparent to-[#C5A059]"></div>
        <div class="p-1 rounded-full bg-amber-100/50 backdrop-blur-xs shadow-sm">
          <i class="fa-regular fa-lightbulb text-lg"></i>
        </div>
      </div>
      <div class="flex flex-col items-center hidden sm:flex">
        <div class="w-0.5 h-8 bg-gradient-to-b from-transparent to-[#C5A059]"></div>
        <div class="p-1 rounded-full bg-amber-100/40 backdrop-blur-xs shadow-sm">
          <i class="fa-solid fa-lightbulb text-sm animate-pulse"></i>
        </div>
      </div>
    </div>

    <!-- Hanging Decorative Light Bulbs Right -->
    <div class="absolute top-0 right-6 sm:right-16 flex items-start gap-5 opacity-40 text-[#C5A059] z-0">
      <div class="flex flex-col items-center hidden sm:flex">
        <div class="w-0.5 h-10 bg-gradient-to-b from-transparent to-[#C5A059]"></div>
        <div class="p-1 rounded-full bg-amber-100/40 backdrop-blur-xs shadow-sm">
          <i class="fa-regular fa-lightbulb text-sm"></i>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-0.5 h-16 bg-gradient-to-b from-transparent to-[#C5A059]"></div>
        <div class="p-1.5 rounded-full bg-amber-100/60 backdrop-blur-xs shadow-sm">
          <i class="fa-solid fa-lightbulb text-xl animate-pulse"></i>
        </div>
      </div>
    </div>

    <!-- Floating Sparkles & Stars -->
    <div class="absolute top-1/3 right-10 text-[#C5A059]/40 text-xl animate-bounce" style="animation-duration: 4s;">
      <i class="fa-solid fa-sparkles"></i>
    </div>
    <div class="absolute bottom-1/4 left-12 text-[#C5A059]/35 text-lg animate-pulse">
      <i class="fa-solid fa-star"></i>
    </div>
    <div class="absolute top-2/3 right-1/3 text-[#C5A059]/20 text-sm">
      <i class="fa-solid fa-atom"></i>
    </div>
  </div>
</template>
