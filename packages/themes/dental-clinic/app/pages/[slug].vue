<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import Hero from '../components/sections/Hero.vue';
import Services from '../components/sections/Services.vue';
import About from '../components/sections/About.vue';
import Whyus from '../components/sections/Whyus.vue';
import Technology from '../components/sections/Technology.vue';
import Team from '../components/sections/Team.vue';
import Results from '../components/sections/Results.vue';
import Testimonials from '../components/sections/Testimonials.vue';
import Blog from '../components/sections/Blog.vue';
import Contact from '../components/sections/Contact.vue';

interface PageBlock {
  uid: string;
  type: 'text' | 'section' | 'navbar' | 'footer';
  content?: string;
  sectionId?: string;
}

interface CMSPage {
  id: number;
  status: string;
  title: string;
  slug: string;
  seo?: Record<string, string>;
  builder?: {
    version: number;
    blocks: PageBlock[];
  };
}

const route = useRoute();
const pageData = ref<CMSPage | null>(null);
const loading = ref(true);
const notFound = ref(false);

const componentMap: Record<string, any> = {
  Hero,
  Services,
  About,
  Whyus,
  Technology,
  Team,
  Results,
  Testimonials,
  Blog,
  Contact
};

const fetchPage = async (slugParam: string) => {
  try {
    loading.value = true;
    notFound.value = false;
    const res = await fetch(`/api/pages/public/${slugParam}`);
    if (res.ok) {
      pageData.value = await res.json();
    } else {
      notFound.value = true;
    }
  } catch (err) {
    notFound.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const slug = route.params.slug as string;
  if (slug) fetchPage(slug);
});

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) fetchPage(newSlug as string);
});

const getSectionComponent = (sectionId?: string) => {
  if (!sectionId) return null;
  return componentMap[sectionId] || null;
};
</script>

<template>
  <div class="py-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-[60vh]">
    <div v-if="loading" class="space-y-6 animate-pulse py-12">
      <div class="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-2/3"></div>
      <div class="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
    </div>

    <div v-else-if="notFound" class="text-center py-20 space-y-6">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-teal-100 dark:bg-teal-950 text-teal-600 rounded-full text-3xl font-extrabold">
        404
      </div>
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Dental CMS Page Not Found</h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        The requested dynamic page could not be located on the Nuxiox CMS server.
      </p>
      <a href="/" class="inline-block px-6 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 transition">
        Return to Home Clinic Page
      </a>
    </div>

    <div v-else-if="pageData" class="space-y-12">
      <div v-if="pageData.builder && pageData.builder.blocks">
        <template v-for="block in pageData.builder.blocks" :key="block.uid">
          <div v-if="block.type === 'text'" v-html="block.content" class="prose dark:prose-invert max-w-none my-6"></div>
          <component 
            v-else-if="block.sectionId && getSectionComponent(block.sectionId)" 
            :is="getSectionComponent(block.sectionId)" 
          />
        </template>
      </div>
    </div>
  </div>
</template>
