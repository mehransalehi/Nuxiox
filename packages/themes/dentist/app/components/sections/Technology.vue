<template>
  <section class="bg-white">
    <div class="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
      <div data-animate>
        <UiTopTitle>our facilities</UiTopTitle>
        <UiTitle>High End Equipments</UiTitle>
        <p class="mt-4 text-sm leading-7">Our clinic uses leading-edge imaging and treatment tools so every visit is
          precise, comfortable and efficient.</p>
        <ul class="list rounded-box mt-4">
          <li class="list-row group items-center hover:bg-primary/3 transition-all duration-500 cursor-pointer">
            <div class="text-4xl font-thin tabular-nums text-primary/50 group-hover:-rotate-10 group-hover:scale-110 transition-all">01</div>
            <div class="flex justify-start items-center">
              <div class="text-xl uppercase font-semibold opacity-60">Digital Operating Lights</div>
            </div>
            <i class="fa-solid fa-arrow-right group-hover:translate-x-0 -translate-x-2.5 transition-all ms-3 text-primary/50 text-xl font-thin"></i>
          </li>
          <li class="list-row group items-center hover:bg-primary/3 transition-all duration-500 cursor-pointer">
            <div class="text-4xl font-thin tabular-nums text-primary/50 group-hover:-rotate-10 group-hover:scale-110 transition-all">02</div>
            <div class="flex justify-start items-center">
              <div class="text-xl uppercase font-semibold opacity-60">Dental Lasers</div>
            </div>
            <i class="fa-solid fa-arrow-right group-hover:translate-x-0 -translate-x-2.5 transition-all ms-3 text-primary/50 text-xl font-thin"></i>
          </li>
          <li class="list-row group items-center hover:bg-primary/3 transition-all duration-500 cursor-pointer">
            <div class="text-4xl font-thin tabular-nums text-primary/50 group-hover:-rotate-10 group-hover:scale-110 transition-all">03</div>
            <div class="flex justify-start items-center">
              <div class="text-xl uppercase font-semibold opacity-60">Endodontic Equipment</div>
            </div>
            <i class="fa-solid fa-arrow-right group-hover:translate-x-0 -translate-x-2.5 transition-all ms-3 text-primary/50 text-xl font-thin"></i>
          </li>
          <li class="list-row group items-center hover:bg-primary/3 transition-all duration-500 cursor-pointer">
            <div class="text-4xl font-thin tabular-nums text-primary/50 group-hover:-rotate-10 group-hover:scale-110 transition-all">04</div>
            <div class="flex justify-start items-center">
              <div class="text-xl uppercase font-semibold opacity-60">Surgical Instruments</div>
            </div>
            <i class="fa-solid fa-arrow-right group-hover:translate-x-0 -translate-x-2.5 transition-all ms-3 text-primary/50 text-xl font-thin"></i>
          </li>

        </ul>
      </div>
      <NuxtImg data-animate
        src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=900&q=80"
        class="rounded-2xl shadow-soft aspect-square" alt="Dental equipment"/>
    </div>
  </section>
</template>
