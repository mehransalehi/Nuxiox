<script setup lang="ts">
const { data } = await useFetch('/api/blog/posts', { query: { pageSize: 4 }, default: () => ({ items: [] as any[] }) })
</script>

<template>
  <section id="blog" class="section" style="background: var(--d-bg-alt);">
    <div class="container-premium">
      <div class="section-header" data-reveal>
        <span class="section-badge">{{ $t('sections.blog.badge') }}</span>
        <h2 class="section-title">{{ $t('sections.blog.title') }}</h2>
        <p class="section-subtitle">{{ $t('sections.blog.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger" data-reveal>
        <NuxtLink v-for="(post, i) in data?.items || []" :key="post.id"
          :to="`/blog/${post.slug}`"
          class="card-premium group !p-0 overflow-hidden cursor-pointer"
          :style="{ transitionDelay: `${i * 60}ms` }"
        >
          <div class="h-48 overflow-hidden">
            <NuxtImg v-if="post.featuredImage" :src="post.featuredImage" :alt="post.title"
              class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
            <div v-else class="w-full h-full flex items-center justify-center text-4xl" style="background: var(--d-bg-alt);">✧</div>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-3 text-xs mb-3" style="color: var(--d-text-muted);">
              <span v-if="post.createdAt">{{ new Date(post.createdAt).toLocaleDateString() }}</span>
            </div>
            <h3 class="font-heading font-bold text-base leading-snug group-hover:text-[var(--d-accent)] transition-colors">
              {{ post.title }}
            </h3>
            <p class="text-xs mt-2 line-clamp-2" style="color: var(--d-text-muted);">{{ post.excerpt }}</p>
            <span class="inline-flex items-center gap-2 text-xs font-semibold mt-4 transition-all group-hover:gap-3"
              style="color: var(--d-accent);">
              {{ $t('common.read') }} <span>→</span>
            </span>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-12" data-reveal>
        <NuxtLink to="/blog" class="btn-outline text-sm">
          View All Articles <span>→</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>