<script setup lang="ts">
const posts = [
  {
    title: '5 Signs Your Child May Need a Checkup',
    excerpt: 'Learn the key warning signs that indicate it\'s time to schedule a pediatric visit for your little one.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
    category: 'Health Tips',
    date: 'Jun 12',
    readTime: '4 min',
    slug: 'child-checkup-signs',
  },
  {
    title: 'Nutrition Guide: Healthy Eating for Kids',
    excerpt: 'Simple, fun ways to build healthy eating habits that your children will actually enjoy.',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=80',
    category: 'Nutrition',
    date: 'Jun 8',
    readTime: '5 min',
    slug: 'healthy-eating-kids',
  },
  {
    title: 'Vaccine Schedule: What Every Parent Should Know',
    excerpt: 'A clear, friendly guide to childhood immunizations and why they keep your community healthy.',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80',
    category: 'Vaccines',
    date: 'Jun 4',
    readTime: '6 min',
    slug: 'vaccine-schedule-guide',
  },
  {
    title: 'Bedtime Routine Tips for Better Sleep',
    excerpt: 'Help your child wind down with these gentle, pediatric-approved bedtime strategies.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    category: 'Sleep',
    date: 'May 28',
    readTime: '4 min',
    slug: 'bedtime-routine-tips',
  },
  {
    title: 'Understanding Developmental Milestones',
    excerpt: 'Track your child\'s growth from infancy through toddlerhood with our milestone checklist.',
    image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=800&q=80',
    category: 'Development',
    date: 'May 20',
    readTime: '7 min',
    slug: 'developmental-milestones',
  },
  {
    title: 'Fever in Children: When to Worry & When to Wait',
    excerpt: 'A pediatrician\'s guide to managing fevers at home and knowing when to seek medical care.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    category: 'Health Tips',
    date: 'May 14',
    readTime: '5 min',
    slug: 'fever-children-guide',
  },
]

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Health Tips': { bg: 'var(--pastel-mint)', text: 'var(--kids-primary-dark)' },
  'Nutrition': { bg: 'var(--pastel-yellow)', text: '#92400E' },
  'Vaccines': { bg: 'var(--pastel-blue)', text: '#1E40AF' },
  'Sleep': { bg: 'var(--pastel-lavender)', text: '#5B21B6' },
  'Development': { bg: 'var(--pastel-pink)', text: '#9D174D' },
}
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden"
    style="background: linear-gradient(180deg, var(--kids-bg-alt) 0%, white 100%);">

    <!-- Decorative blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none dots-pattern opacity-20" />
    <div class="absolute top-10 right-10 w-36 h-36 rounded-full"
      style="background: var(--pastel-blue); filter: blur(60px); opacity: 0.2; animation: blobFloat 8s ease-in-out infinite;" />
    <div class="absolute bottom-20 left-10 w-48 h-48 rounded-full"
      style="background: var(--pastel-pink); filter: blur(70px); opacity: 0.15; animation: blobFloat 12s ease-in-out infinite 2s;" />
    <div class="absolute top-1/3 left-1/2 w-28 h-28 rounded-full"
      style="background: var(--pastel-yellow); filter: blur(50px); opacity: 0.2; animation: blobFloat 9s ease-in-out infinite 4s;" />

    <div class="relative z-10 mx-auto max-w-6xl px-6">
      <!-- Section Header -->
      <div class="text-center mb-16" data-reveal>
        <span class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);">
          📖 Health Blog
        </span>
        <h2 class="font-fredoka text-4xl md:text-5xl font-bold mb-4" style="color: var(--kids-text);">
          Tips for Happy,<br>Healthy Kids
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--kids-text-muted);">
          Expert advice, parenting tips, and pediatric insights to help your family thrive every step of the way.
        </p>
      </div>

      <!-- Blog Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger" data-reveal>
        <NuxtLink
          v-for="(post, i) in posts"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="clay-card !rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <!-- Image -->
          <div class="relative h-48 overflow-hidden">
            <NuxtImg
              :src="post.image"
              :alt="post.title"
              class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />

            <!-- Category Badge -->
            <span
              class="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-sm transition-all duration-300 group-hover:scale-105"
              :style="{
                background: categoryColors[post.category]?.bg || 'var(--pastel-mint)',
                color: categoryColors[post.category]?.text || 'var(--kids-primary-dark)',
              }"
            >
              {{ post.category }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-5">
            <!-- Meta: Date + Read time -->
            <div class="flex items-center gap-4 text-xs font-semibold mb-3" style="color: var(--kids-text-muted);">
              <span class="flex items-center gap-1.5">
                <span class="text-sm">📅</span>
                {{ post.date }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="text-sm">⏱️</span>
                {{ post.readTime }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="font-fredoka text-lg font-bold mb-2 transition-colors duration-300"
              style="color: var(--kids-text);"
            >
              {{ post.title }}
            </h3>

            <!-- Excerpt -->
            <p class="text-sm leading-relaxed line-clamp-2" style="color: var(--kids-text-muted);">
              {{ post.excerpt }}
            </p>

            <!-- Read More -->
            <div class="inline-flex items-center gap-2 mt-4 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
              style="color: var(--kids-primary);"
            >
              <span>Read More</span>
              <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- View All CTA -->
      <div class="mt-12 text-center" data-reveal>
        <NuxtLink
          to="/blog"
          class="clay-btn clay-btn-accent text-base px-10 py-4"
        >
          <span>View All Articles</span>
          <span class="text-xl">📚</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Stagger children on reveal */
.stagger > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stagger[data-reveal].visible > * {
  opacity: 1;
  transform: translateY(0);
}

/* Line clamp for excerpt */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
