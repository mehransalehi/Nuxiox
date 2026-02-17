<template>
  <section class="bg-[#f9fafb] py-20">
    <div class="mx-auto max-w-6xl px-6">
      <div class="text-center" data-animate>
        <UiTopTitle>our blog</UiTopTitle>
        <UiTitle>Latest Blog & Articles</UiTitle>
        <UiSubTitle>Stay informed with the latest dental health tips, news, and expert insights from<br>our team.
        </UiSubTitle>
      </div>
      <div class="mt-10 grid gap-6 md:grid-cols-4">
        <a href="#" v-for="post in posts" :key="post.title">
          <article class="card bg-white  transition-all duration-300 shadow hover:shadow-2xl group" data-animate>
            <figure class="card-image-zoom relative">
              <NuxtImg :src="post.image" :alt="post.title"
                class="h-32 w-full object-cover group-hover:scale-110 duration-700 transition-all" />
              <span
                class="absolute top-3 left-3 flex items-center justify-center rounded-2xl glass text-neutral/70 text-xs font-bold p-1 shadow-md">
                Health Care
              </span>
            </figure>
            <div class="flex px-4 pt-4 text-xs text-neutral/40 gap-x-5">
              <div><i class="fa-regular fa-calendar"></i> Feb 13</div>
              <div><i class="fa-regular fa-clock"></i> 6 min</div>
            </div>
            <div class="card-body p-4">
              <h3 class="text-sm font-bold group-hover:text-primary">{{ post.title }}</h3>
            </div>
          </article>
        </a>
      </div>
      <div class="mt-10 text-center" data-animate>
        <UiButton class="btn-neutral">View More</UiButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const posts = [
  { title: 'How to Keep Your Teeth Healthy Every Day', image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=800&q=80' },
  { title: 'When You Should Book A Dental Cleaning', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80' },
  { title: 'Top 5 Benefits of Routine Checkups', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80' },
  { title: 'The Role of Technology in Modern Dentistry', image: 'https://images.unsplash.com/photo-1629909615957-bea00f5d0c2c?auto=format&fit=crop&w=800&q=80' }
]
</script>
